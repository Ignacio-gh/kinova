import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useWelcome } from '@/hooks/use-welcome';

export default function Index() {
  const { goToPatient, goToKinesiologo, stats } = useWelcome();

  return (
    <SafeAreaView className="flex-1 bg-navy">
      <StatusBar style="light" />

      {/* Círculos decorativos de fondo */}
      <View className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <View
          className="absolute rounded-full bg-turquoise"
          style={{ width: 320, height: 320, right: -90, top: '10%', opacity: 0.06 }}
        />
        <View
          className="absolute rounded-full bg-white"
          style={{ width: 200, height: 200, right: 10, top: '28%', opacity: 0.04 }}
        />
        <View
          className="absolute rounded-full bg-turquoise"
          style={{ width: 260, height: 260, left: -70, bottom: '18%', opacity: 0.05 }}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="px-6 pt-4 flex-row items-center" style={{ gap: 10 }}>
          <View className="w-10 h-10 rounded-full border-2 border-turquoise items-center justify-center">
            <Text className="text-turquoise font-bold text-base">K</Text>
          </View>
          <Text className="text-white text-2xl font-bold tracking-wide">Kinova</Text>
        </View>

        {/* Hero */}
        <View className="flex-1 px-6 pt-10">
          <View className="self-start border border-turquoise rounded-full px-4 py-1.5 mb-6">
            <Text className="text-turquoise text-xs font-medium">
              Rehabilitación con Inteligencia Artificial
            </Text>
          </View>

          <Text
            className="text-white font-extrabold mb-5"
            style={{ fontSize: 36, lineHeight: 44 }}
          >
            Tu kinesiólogo virtual que guía tu rehabilitación con IA
          </Text>

          <Text className="text-gray-300 text-base leading-relaxed mb-10">
            Kinova utiliza visión por computadora e inteligencia artificial para monitorear tus
            ejercicios de rehabilitación en tiempo real, asegurando que cada movimiento sea
            correcto y efectivo.
          </Text>

          {/* Stats */}
          <View className="flex-row justify-between items-center mb-12">
            {stats.map((stat, i) => (
              <View key={stat.value} className="flex-row items-center" style={{ gap: 0 }}>
                {i > 0 && (
                  <View style={{ width: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.12)', marginRight: 16 }} />
                )}
                <View>
                  <Text className="text-turquoise font-extrabold" style={{ fontSize: 30 }}>
                    {stat.value}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tarjetas de acción */}
        <View className="px-6 pb-10" style={{ gap: 14 }}>
          <TouchableOpacity
            className="rounded-2xl p-5 flex-row items-center border border-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            onPress={goToPatient}
            activeOpacity={0.7}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: 'rgba(0,168,150,0.2)', marginRight: 16 }}
            >
              <Text style={{ fontSize: 22 }}>🧑‍🦽</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Soy Paciente</Text>
              <Text className="text-gray-400 text-sm mt-0.5">
                Accede a tu plan de rehabilitación
              </Text>
            </View>
            <Text className="text-turquoise" style={{ fontSize: 26, lineHeight: 30 }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-turquoise rounded-2xl p-5 flex-row items-center"
            onPress={goToKinesiologo}
            activeOpacity={0.7}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 16 }}
            >
              <Text style={{ fontSize: 22 }}>👨‍⚕️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Soy Kinesiólogo</Text>
              <Text className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Gestiona tus pacientes y sesiones
              </Text>
            </View>
            <Text className="text-white" style={{ fontSize: 26, lineHeight: 30 }}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
