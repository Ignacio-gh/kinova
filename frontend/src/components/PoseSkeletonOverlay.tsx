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
// vertex = articulación donde está el ángulo
// a, b   = los dos extremos del ángulo

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
  width:        number;
  height:       number;
  exerciseKey:  string;
  frontCamera?: boolean;
};

const MIN_V = 0.25;

export function PoseSkeletonOverlay({
  landmarks, angles, status, width, height, exerciseKey, frontCamera = true,
}: Props) {
  const color = COLOR[status] ?? COLOR.perfect;
  const px = (x: number) => (frontCamera ? 1 - x : x) * width;
  const py = (y: number) => y * height;
  const lm  = (i: number) => landmarks[String(i)];

  // ── Elegir el lado más visible ──────────────────────────────────────────────
  // Suma la visibilidad de cadera + rodilla + tobillo de cada lado
  const leftScore  = [IDX.left.hip,  IDX.left.knee,  IDX.left.ankle ].reduce((s, i) => s + (lm(i)?.v ?? 0), 0);
  const rightScore = [IDX.right.hip, IDX.right.knee, IDX.right.ankle].reduce((s, i) => s + (lm(i)?.v ?? 0), 0);
  const side = leftScore >= rightScore ? IDX.left : IDX.right;

  const chain     = CHAIN[exerciseKey]  ?? CHAIN.default;
  const angleDefs = ANGLES[exerciseKey] ?? ANGLES.default;

  // Posiciones en píxeles de cada joint en la cadena (filtradas por visibilidad)
  const chainPts = chain.map((name) => {
    const l = lm(side[name]);
    if (!l || l.v < MIN_V) return null;
    return { name, x: px(l.x), y: py(l.y) };
  });

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, width, height }}
      pointerEvents="none"
    >
      <Svg width={width} height={height}>

        {/* ── LÍNEAS ─────────────────────────────────────────── */}
        {chainPts.map((pt, i) => {
          if (!pt) return null;
          const next = chainPts.slice(i + 1).find(Boolean); // siguiente visible
          if (!next) return null;
          return (
            <G key={`seg-${i}`}>
              {/* sombra para contraste */}
              <Line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                stroke="rgba(0,0,0,0.65)" strokeWidth={9} strokeLinecap="round" />
              {/* línea en el color del estado */}
              <Line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                stroke={color} strokeWidth={5} strokeLinecap="round" />
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
          if (!vj || !va || !vb || vj.v < MIN_V || va.v < MIN_V || vb.v < MIN_V) return null;

          const arc = makeArc(
            px(vj.x), py(vj.y),
            px(va.x), py(va.y),
            px(vb.x), py(vb.y),
            34,
          );
          if (!arc) return null;

          const LW = 68;  const LH = 32;
          return (
            <G key={`arc-${def.label}`}>
              <Path d={arc.d} fill="none"
                stroke={color} strokeWidth={2.5} strokeDasharray="6,3" opacity={0.95} />
              <Rect x={arc.lx - LW/2} y={arc.ly - LH/2}
                width={LW} height={LH} fill="rgba(0,0,0,0.78)" rx={9} />
              <SvgText x={arc.lx} y={arc.ly + 7}
                textAnchor="middle" fill={color} fontSize={17} fontWeight="bold">
                {Math.round(angleValue)}°
              </SvgText>
            </G>
          );
        })}

        {/* ── PUNTOS ─────────────────────────────────────────── */}
        {chainPts.map((pt, i) => {
          if (!pt) return null;
          return (
            <G key={`dot-${i}`}>
              {/* halo */}
              <Circle cx={pt.x} cy={pt.y} r={16}
                fill="none" stroke={color} strokeWidth={2} opacity={0.25} />
              {/* sombra */}
              <Circle cx={pt.x} cy={pt.y} r={10} fill="rgba(0,0,0,0.6)" />
              {/* punto principal */}
              <Circle cx={pt.x} cy={pt.y} r={8} fill={color} />
            </G>
          );
        })}

      </Svg>
    </View>
  );
}
