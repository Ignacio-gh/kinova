/**
 * PoseSkeletonOverlay
 *
 * Detecta cuál lado del cuerpo es más visible (izq o der)
 * y dibuja UNA sola cadena de puntos conectados para ese lado.
 *
 * Sentadilla          → hombro – cadera – rodilla – tobillo
 * Extensión rodilla   → cadera – rodilla – tobillo
 * Elevación p. recta  → hombro – cadera – rodilla – tobillo
 *
 * Índices MediaPipe:
 *   izq: hombro=11  cadera=23  rodilla=25  tobillo=27
 *   der: hombro=12  cadera=24  rodilla=26  tobillo=28
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { PoseLandmark } from '@/hooks/use-pose-websocket';

// ─── Mapa de nombres de articulación → índice por lado ───────────────────────

const IDX = {
  left:  { shoulder: 11, hip: 23, knee: 25, ankle: 27 },
  right: { shoulder: 12, hip: 24, knee: 26, ankle: 28 },
} as const;

type JointName = keyof typeof IDX.left;

// ─── Cadena de joints por ejercicio ──────────────────────────────────────────

const CHAIN: Record<string, JointName[]> = {
  squat:              ['shoulder', 'hip', 'knee', 'ankle'],
  knee_extension:     ['hip', 'knee', 'ankle'],
  straight_leg_raise: ['shoulder', 'hip', 'knee', 'ankle'],
  default:            ['hip', 'knee', 'ankle'],
};

// ─── Definición de los arcos de ángulo ───────────────────────────────────────

type ArcDef = { label: string; vertex: JointName; a: JointName; b: JointName };

const ANGLES: Record<string, ArcDef[]> = {
  squat: [
    { label: 'knee',  vertex: 'knee', a: 'hip',      b: 'ankle' },
    { label: 'trunk', vertex: 'hip',  a: 'shoulder', b: 'knee'  },
  ],
  knee_extension: [
    { label: 'knee',  vertex: 'knee', a: 'hip',      b: 'ankle' },
  ],
  straight_leg_raise: [
    { label: 'hip',   vertex: 'hip',  a: 'shoulder', b: 'ankle' },
    { label: 'knee',  vertex: 'knee', a: 'hip',      b: 'ankle' },
  ],
  default: [
    { label: 'knee',  vertex: 'knee', a: 'hip',      b: 'ankle' },
  ],
};

// ─── Colores ──────────────────────────────────────────────────────────────────

const COLOR = {
  ok:      '#00E5A0',
  warning: '#FACC15',
  error:   '#F87171',
};

// joint de la corrección → segmentos del skeleton que colorear
const JOINT_TO_SEGMENTS: Record<string, string[]> = {
  tronco:  ['shoulder-hip'],
  rodilla: ['hip-knee', 'knee-ankle'],
  cadera:  ['shoulder-hip', 'hip-knee'],
  sistema: [],
};

type Correction = { joint: string; message: string; severity: string };

function getSegmentColors(corrections: Correction[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of corrections) {
    const col  = c.severity === 'error' ? COLOR.error : COLOR.warning;
    for (const seg of (JOINT_TO_SEGMENTS[c.joint] ?? [])) {
      if (!map.has(seg) || (c.severity === 'error' && map.get(seg) !== COLOR.error))
        map.set(seg, col);
    }
  }
  return map;
}

// ─── Helper: path SVG del arco + posición de la etiqueta ─────────────────────

type ArcResult = { d: string; lx: number; ly: number } | null;

function makeArc(
  jx: number, jy: number,
  ax: number, ay: number,
  bx: number, by: number,
  r: number,
): ArcResult {
  const dA = Math.hypot(ax - jx, ay - jy);
  const dB = Math.hypot(bx - jx, by - jy);
  if (dA < 1 || dB < 1) return null;

  const uAx = (ax - jx) / dA;  const uAy = (ay - jy) / dA;
  const uBx = (bx - jx) / dB;  const uBy = (by - jy) / dB;

  const p1x = jx + r * uAx;    const p1y = jy + r * uAy;
  const p2x = jx + r * uBx;    const p2y = jy + r * uBy;
  const sweep = (uAx * uBy - uAy * uBx) > 0 ? 1 : 0;

  const mx = uAx + uBx;  const my = uAy + uBy;
  const md = Math.hypot(mx, my);
  const lr = r + 28;
  const lx = md > 0.05 ? jx + (mx / md) * lr : jx;
  const ly = md > 0.05 ? jy + (my / md) * lr : jy - lr;

  return {
    d: `M ${p1x.toFixed(1)} ${p1y.toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${p2x.toFixed(1)} ${p2y.toFixed(1)}`,
    lx, ly,
  };
}

// ─── Componente ───────────────────────────────────────────────────────────────

type Props = {
  landmarks:    Record<string, PoseLandmark>;
  angles:       Record<string, number>;
  corrections?: Correction[];
  width:        number;
  height:       number;
  exerciseKey:  string;
  frontCamera?: boolean;
  videoSize?:   { width: number; height: number };
};

// Umbral mínimo de visibilidad. MediaPipe asigna v≈0 en vista lateral,
// por eso usamos 0 — el SVG recorta lo que queda fuera del viewport.
const MIN_V     = 0.0;
const MIN_V_ARC = 0.0;

export function PoseSkeletonOverlay({
  landmarks, angles, corrections = [], width, height, exerciseKey, frontCamera = true, videoSize,
}: Props) {
  const segmentColors = getSegmentColors(corrections);

  let coverScale = 1, coverOffX = 0, coverOffY = 0;
  if (videoSize && videoSize.width > 0 && videoSize.height > 0) {
    coverScale = Math.max(width / videoSize.width, height / videoSize.height);
    coverOffX  = (width  - videoSize.width  * coverScale) / 2;
    coverOffY  = (height - videoSize.height * coverScale) / 2;
  }

  const px = (x: number) => {
    const rx = frontCamera ? 1 - x : x;
    return videoSize ? rx * videoSize.width * coverScale + coverOffX : rx * width;
  };
  const py = (y: number) =>
    videoSize ? y * videoSize.height * coverScale + coverOffY : y * height;

  const lm = (i: number) => landmarks[String(i)];

  const chain     = CHAIN[exerciseKey]  ?? CHAIN.default;
  const angleDefs = ANGLES[exerciseKey] ?? ANGLES.default;

  const chainLeftScore  = chain.reduce((s, name) => s + (lm(IDX.left[name])?.v  ?? 0), 0);
  const chainRightScore = chain.reduce((s, name) => s + (lm(IDX.right[name])?.v ?? 0), 0);
  const side = chainLeftScore >= chainRightScore ? IDX.left : IDX.right;

  const chainPts = chain.map((name) => {
    const l = lm(side[name]);
    if (!l || l.v < MIN_V) return null;
    return { name, x: px(l.x), y: py(l.y) };
  });

  const segmentsDrawable = chainPts.filter(Boolean).length >= 2;

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, width, height }}
      pointerEvents="none"
    >
      <Svg width={width} height={height}>

        {/* ── LÍNEAS (coloreadas por segmento) ─────────────── */}
        {chainPts.map((pt, i) => {
          if (!pt) return null;
          const next = chainPts[i + 1];
          if (!next) return null;
          const segColor = segmentColors.get(`${pt.name}-${next.name}`) ?? COLOR.ok;
          return (
            <G key={`seg-${i}`}>
              <Line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                stroke="rgba(0,0,0,0.65)" strokeWidth={9} strokeLinecap="round" />
              <Line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                stroke={segColor} strokeWidth={5} strokeLinecap="round" />
            </G>
          );
        })}

        {/* ── ARCOS DE ÁNGULO (color del peor segmento adyacente) ── */}
        {angleDefs.map((def) => {
          const angleValue = angles[def.label];
          if (angleValue === undefined) return null;

          const vj = lm(side[def.vertex]);
          const va = lm(side[def.a]);
          const vb = lm(side[def.b]);
          if (!vj || !va || !vb) return null;
          if (vj.v < MIN_V || va.v < MIN_V_ARC || vb.v < MIN_V_ARC) return null;

          const arc = makeArc(
            px(vj.x), py(vj.y),
            px(va.x), py(va.y),
            px(vb.x), py(vb.y),
            34,
          );
          if (!arc) return null;

          const arcColor = segmentColors.get(`${def.a}-${def.vertex}`)
            ?? segmentColors.get(`${def.vertex}-${def.b}`)
            ?? COLOR.ok;

          const LW = 68; const LH = 32;
          return (
            <G key={`arc-${def.label}`}>
              <Path d={arc.d} fill="none"
                stroke={arcColor} strokeWidth={2.5} strokeDasharray="6,3" opacity={0.95} />
              <Rect x={arc.lx - LW/2} y={arc.ly - LH/2}
                width={LW} height={LH} fill="rgba(0,0,0,0.78)" rx={9} />
              <SvgText x={arc.lx} y={arc.ly + 7}
                textAnchor="middle" fill={arcColor} fontSize={17} fontWeight="bold">
                {Math.round(angleValue)}°
              </SvgText>
            </G>
          );
        })}

        {/* ── PUNTOS (color del peor segmento adyacente) ───── */}
        {chainPts.map((pt, i) => {
          if (!pt) return null;
          const prev = chainPts[i - 1];
          const next = chainPts[i + 1];
          const c1 = prev ? segmentColors.get(`${prev.name}-${pt.name}`) : undefined;
          const c2 = next ? segmentColors.get(`${pt.name}-${next.name}`) : undefined;
          const dotColor = (c1 === COLOR.error || c2 === COLOR.error)
            ? COLOR.error
            : (c1 === COLOR.warning || c2 === COLOR.warning)
              ? COLOR.warning
              : COLOR.ok;
          return (
            <G key={`dot-${i}`}>
              <Circle cx={pt.x} cy={pt.y} r={16}
                fill="none" stroke={dotColor} strokeWidth={2} opacity={0.25} />
              <Circle cx={pt.x} cy={pt.y} r={10} fill="rgba(0,0,0,0.6)" />
              <Circle cx={pt.x} cy={pt.y} r={8} fill={dotColor} />
            </G>
          );
        })}

        {/* ── GUÍA DE POSICIÓN (cuando no se ven las articulaciones) ── */}
        {!segmentsDrawable && width > 0 && (
          <G>
            <Rect
              x={width / 2 - 210} y={height * 0.72 - 22}
              width={420} height={44} fill="rgba(0,0,0,0.75)" rx={11}
            />
            <SvgText
              x={width / 2} y={height * 0.72 + 9}
              textAnchor="middle" fill="#FACC15" fontSize={14} fontWeight="600"
            >
              Mostrá caderas, rodillas y tobillos a la cámara
            </SvgText>
          </G>
        )}

      </Svg>
    </View>
  );
}
