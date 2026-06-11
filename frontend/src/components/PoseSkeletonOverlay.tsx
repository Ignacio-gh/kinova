/**
 * PoseSkeletonOverlay
 *
 * Detecta cuál lado del cuerpo es más visible (izq o der)
 * y dibuja UNA sola cadena de puntos conectados para ese lado.
 *
 * COLOREO POR SEGMENTO:
 *   Cada segmento del esqueleto (hombro→cadera, cadera→rodilla, rodilla→tobillo)
 *   se colorea independientemente según las correcciones del evaluador.
 *   Si el tronco está mal pero las piernas bien, solo hombro→cadera se pone
 *   amarillo/rojo y el resto queda verde.
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

// ─── Colores de estado ────────────────────────────────────────────────────────

const COLOR: Record<string, string> = {
  perfect: '#00E5A0',
  improve: '#FACC15',
  bad:     '#F87171',
};

// ─── Mapeo: joint de corrección → segmentos afectados ─────────────────────────
// Cada segmento se identifica como "jointA-jointB" (siguiendo la cadena).
// Cuando el evaluador devuelve una corrección con joint="tronco", los segmentos
// shoulder-hip se colorean según la severidad.

const JOINT_TO_SEGMENTS: Record<string, string[]> = {
  tronco:  ['shoulder-hip'],
  rodilla: ['hip-knee', 'knee-ankle'],
  cadera:  ['shoulder-hip', 'hip-knee'],
  sistema: [],
};

type Correction = { joint: string; message: string; severity: string };

function getSegmentColors(corrections: Correction[]): Map<string, string> {
  const segColors = new Map<string, string>();

  for (const corr of corrections) {
    const segments = JOINT_TO_SEGMENTS[corr.joint] ?? [];
    const color = corr.severity === 'error' ? COLOR.bad : COLOR.improve;

    for (const seg of segments) {
      const current = segColors.get(seg);
      // error (rojo) tiene prioridad sobre warning (amarillo)
      if (!current || (corr.severity === 'error' && current !== COLOR.bad)) {
        segColors.set(seg, color);
      }
    }
  }

  return segColors;
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
  status:       'perfect' | 'improve' | 'bad';
  corrections?: Correction[];
  width:        number;
  height:       number;
  exerciseKey:  string;
  frontCamera?: boolean;
  // Dimensiones reales del video (sin recortar). Cuando se provee, el overlay
  // aplica el mismo transform object-fit:cover que usa el <video> para alinear
  // los landmarks con exactitud sin depender de un recorte manual del canvas.
  videoSize?:   { width: number; height: number };
};

// Umbral mínimo de visibilidad para DIBUJAR un punto o segmento.
// MediaPipe asigna v≈0 a joints en vista lateral incluso cuando tiene
// una estimación de posición razonable — SVG recorta lo que queda
// fuera del viewport, no necesitamos filtrar por posición manualmente.
const MIN_V     = 0.0;
const MIN_V_ARC = 0.0;

export function PoseSkeletonOverlay({
  landmarks, angles, status, corrections = [], width, height, exerciseKey,
  frontCamera = true, videoSize,
}: Props) {
  const defaultColor = COLOR[status] ?? COLOR.perfect;
  const segmentColors = getSegmentColors(corrections);

  // Si se provee videoSize, aplicar el transform object-fit:cover para alinear
  // los landmarks (en [0,1] del frame completo) con el panel de display.
  // Sin videoSize, mapeo directo [0,1] → dimensiones del panel (modo overlay clásico).
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

  const lm  = (i: number) => landmarks[String(i)];

  // ── Elegir el lado más visible ──
  const leftScore  = Object.values(IDX.left ).reduce((s, i) => s + (lm(i)?.v ?? 0), 0);
  const rightScore = Object.values(IDX.right).reduce((s, i) => s + (lm(i)?.v ?? 0), 0);
  const side = leftScore >= rightScore ? IDX.left : IDX.right;

  const chain     = CHAIN[exerciseKey]  ?? CHAIN.default;
  const angleDefs = ANGLES[exerciseKey] ?? ANGLES.default;

  const chainPts = chain.map((name) => {
    const l = lm(side[name]);
    if (!l || l.v < MIN_V) return null;
    return { name, x: px(l.x), y: py(l.y) };
  });

  // Al menos 2 puntos visibles = se puede dibujar algún segmento
  const segmentsDrawable = chainPts.filter(Boolean).length >= 2;

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, width, height }}
      pointerEvents="none"
    >
      <Svg width={width} height={height}>

        {/* ── LÍNEAS (coloreadas por segmento) ────────────────── */}
        {chainPts.map((pt, i) => {
          if (!pt) return null;
          const next = chainPts[i + 1];
          if (!next) return null;

          // Determinar el color de este segmento específico
          const segKey = `${pt.name}-${next.name}`;
          const segColor = segmentColors.get(segKey) ?? defaultColor;

          return (
            <G key={`seg-${i}`}>
              <Line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                stroke="rgba(0,0,0,0.65)" strokeWidth={9} strokeLinecap="round" />
              <Line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                stroke={segColor} strokeWidth={5} strokeLinecap="round" />
            </G>
          );
        })}

        {/* ── ARCOS DE ÁNGULO ────────────────────────────────── */}
        {angleDefs.map((def) => {
          const angleValue = angles[def.label];
          if (angleValue === undefined) return null;

          const vj = lm(side[def.vertex]);
          const va = lm(side[def.a]);
          const vb = lm(side[def.b]);
          // El vértice necesita buena visibilidad; los extremos del arco usan
          // umbral más laxo porque solo definen la dirección del arco visual.
          if (!vj || !va || !vb) return null;
          if (vj.v < MIN_V) return null;
          if (va.v < MIN_V_ARC) return null;
          if (vb.v < MIN_V_ARC) return null;

          const arc = makeArc(
            px(vj.x), py(vj.y),
            px(va.x), py(va.y),
            px(vb.x), py(vb.y),
            34,
          );
          if (!arc) return null;

          // Color del arco = peor color de los segmentos que tocan ese vértice
          const segA = `${def.a}-${def.vertex}`;
          const segB = `${def.vertex}-${def.b}`;
          const arcColor = segmentColors.get(segA) ?? segmentColors.get(segB) ?? defaultColor;

          const LW = 68;  const LH = 32;
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

        {/* ── PUNTOS (color del peor segmento adyacente) ──────── */}
        {chainPts.map((pt, i) => {
          if (!pt) return null;

          // Color del punto = peor color de los segmentos que lo tocan
          const prev = chainPts[i - 1];
          const next = chainPts[i + 1];
          const segPrev = prev ? `${prev.name}-${pt.name}` : '';
          const segNext = next ? `${pt.name}-${next.name}` : '';
          const colorPrev = segPrev ? segmentColors.get(segPrev) : undefined;
          const colorNext = segNext ? segmentColors.get(segNext) : undefined;
          // Rojo > amarillo > default
          const dotColor = (colorPrev === COLOR.bad || colorNext === COLOR.bad)
            ? COLOR.bad
            : (colorPrev === COLOR.improve || colorNext === COLOR.improve)
              ? COLOR.improve
              : defaultColor;

          return (
            <G key={`dot-${i}`}>
              <Circle cx={pt.x} cy={pt.y} r={16}
                fill="none" stroke={dotColor} strokeWidth={2} opacity={0.25} />
              <Circle cx={pt.x} cy={pt.y} r={10} fill="rgba(0,0,0,0.6)" />
              <Circle cx={pt.x} cy={pt.y} r={8} fill={dotColor} />
            </G>
          );
        })}

        {/* ── GUÍA DE POSICIÓN (cuando no se ven las articulaciones del ejercicio) ── */}
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
