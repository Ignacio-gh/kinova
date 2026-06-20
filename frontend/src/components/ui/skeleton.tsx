import { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  radius?: number;
  dark?: boolean;
  delay?: number;
  style?: ViewStyle;
}

// Caja individual con animación de pulso
export function SkeletonBox({
  width,
  height,
  radius = 8,
  dark = false,
  delay = 0,
  style,
}: SkeletonBoxProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 1,    duration: 700, useNativeDriver: false }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: dark ? 'rgba(255,255,255,0.14)' : '#E2E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
}

// ─── Skeletons compuestos reutilizables ───────────────────────────────────────

// Fila de texto: línea ancha + línea corta
export function SkeletonTextBlock({ dark = false }: { dark?: boolean }) {
  return (
    <View style={{ gap: 8 }}>
      <SkeletonBox width="65%" height={22} radius={6} dark={dark} />
      <SkeletonBox width="40%" height={14} radius={6} dark={dark} delay={120} />
    </View>
  );
}

// Tarjeta genérica con cabecera y líneas internas
export function SkeletonCard({
  height = 110,
  dark = false,
  delay = 0,
  style,
}: {
  height?: number;
  dark?: boolean;
  delay?: number;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: dark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
          gap: 10,
          height,
        },
        style,
      ]}
    >
      <SkeletonBox width="50%" height={14} radius={6} dark={dark} delay={delay} />
      <SkeletonBox width="80%" height={12} radius={6} dark={dark} delay={delay + 80} />
      <SkeletonBox width="35%" height={12} radius={6} dark={dark} delay={delay + 160} />
    </View>
  );
}

// Fila de paciente / item de lista
export function SkeletonRow({
  dark = false,
  delay = 0,
}: {
  dark?: boolean;
  delay?: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
        borderRadius: 12,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
      }}
    >
      <SkeletonBox width={36} height={36} radius={18} dark={dark} delay={delay} />
      <View style={{ flex: 1, gap: 6 }}>
        <SkeletonBox width="55%" height={13} radius={5} dark={dark} delay={delay + 60} />
        <SkeletonBox width="35%" height={11} radius={5} dark={dark} delay={delay + 120} />
      </View>
      <SkeletonBox width={48} height={20} radius={10} dark={dark} delay={delay + 80} />
      <SkeletonBox width={48} height={20} radius={10} dark={dark} delay={delay + 100} />
    </View>
  );
}

// Tarjeta de estadística cuadrada (para historial)
export function SkeletonStatCard({ dark = false, delay = 0 }: { dark?: boolean; delay?: number }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 8,
        minHeight: 90,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
      }}
    >
      <SkeletonBox width="60%" height={12} radius={5} dark={dark} delay={delay} />
      <SkeletonBox width="45%" height={28} radius={6} dark={dark} delay={delay + 80} />
    </View>
  );
}
