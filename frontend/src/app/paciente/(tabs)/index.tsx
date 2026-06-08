import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePacienteInicio, UPCOMING } from '@/hooks/use-paciente-inicio';

const CARD_WIDTH = Dimensions.get('window').width * 0.74;

type TodayCardProps = {
  exercise: { id: string; name: string; muscle: string; reps: number; series: number; completed: boolean };
  onToggle: () => void;
  onStart: () => void;
};

function TodayCard({ exercise, onToggle, onStart }: TodayCardProps) {
  return (
    <View
      className="bg-white rounded-2xl p-5 mr-4"
      style={{
        width: CARD_WIDTH,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
    >
      <Text className="text-navy font-bold text-lg mb-2">{exercise.name}</Text>

      <View className="self-start rounded-full px-3 py-1 mb-5" style={{ backgroundColor: '#e5f7f5' }}>
        <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>
          {exercise.muscle}
        </Text>
      </View>

      <View className="flex-row mb-6" style={{ gap: 28 }}>
        <View>
          <Text className="text-gray-400 text-xs mb-1">Repeticiones</Text>
          <Text className="text-navy font-extrabold" style={{ fontSize: 34 }}>{exercise.reps}</Text>
        </View>
        <View>
          <Text className="text-gray-400 text-xs mb-1">Series</Text>
          <Text className="text-navy font-extrabold" style={{ fontSize: 34 }}>{exercise.series}</Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-turquoise rounded-xl items-center justify-center mb-2"
        style={{ height: 46 }}
        onPress={onStart}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Ionicons name="videocam-outline" size={16} color="white" />
          <Text className="text-white font-semibold">Iniciar ejercicio</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="rounded-xl items-center justify-center"
        style={{
          height: 46,
          backgroundColor: exercise.completed ? '#e5f7f5' : '#F9FAFB',
          borderWidth: 1,
          borderColor: exercise.completed ? '#00A896' : '#E5E7EB',
        }}
        onPress={onToggle}
        activeOpacity={0.75}
      >
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Ionicons
            name={exercise.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={17}
            color={exercise.completed ? '#00A896' : '#9CA3AF'}
          />
          <Text
            className="text-sm font-medium"
            style={{ color: exercise.completed ? '#00A896' : '#6B7280' }}
          >
            {exercise.completed ? 'Completado' : 'Marcar como completado'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function PacienteInicio() {
  const router = useRouter();
  const {
    exercises,
    completedToday,
    weeklyPercent,
    totalWeekly,
    completedWeekly,
    today,
    toggleExercise,
    goToCalendar,
  } = usePacienteInicio();

  const startExercise = (ex: typeof exercises[0]) =>
    router.push({
      pathname: '/paciente/ejercicio/[id]',
      params: {
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        reps: ex.reps,
        series: ex.series,
        angleMin: ex.angleMin != null ? String(ex.angleMin) : '',
        angleMax: ex.angleMax != null ? String(ex.angleMax) : '',
      },
    } as never);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Saludo */}
        <View className="px-5 pt-5 pb-4">
          <Text
            className="text-navy"
            style={{ fontSize: 36, fontStyle: 'italic', fontWeight: '300', letterSpacing: 0.5 }}
          >
            Bienvenido, Carlos
          </Text>
          <Text className="text-gray-400 text-sm mt-1">{today}</Text>
        </View>

        {/* Ejercicios de Hoy — header */}
        <View className="flex-row items-center justify-between px-5 mb-3">
          <Text className="text-navy font-bold" style={{ fontSize: 20 }}>
            Ejercicios de Hoy
          </Text>
          <View className="flex-row items-center" style={{ gap: 5 }}>
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs">
              {completedToday} de {exercises.length} completados
            </Text>
          </View>
        </View>

        {/* Carrusel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 16}
          snapToAlignment="start"
        >
          {exercises.map((ex) => (
            <TodayCard
              key={ex.id}
              exercise={ex}
              onToggle={() => toggleExercise(ex.id)}
              onStart={() => startExercise(ex)}
            />
          ))}
        </ScrollView>

        <View className="px-5 mt-5" style={{ gap: 16 }}>
          {/* Progreso Semanal */}
          <View
            className="bg-white rounded-2xl p-5"
            style={{
              borderWidth: 1, borderColor: '#F3F4F6',
              elevation: 2, shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.07, shadowRadius: 4,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-gray-400 text-sm mb-1">Ejercicios completados</Text>
                <View className="flex-row items-end" style={{ gap: 4 }}>
                  <Text className="text-navy font-extrabold" style={{ fontSize: 36 }}>
                    {completedWeekly}
                  </Text>
                  <Text className="text-gray-300 font-light mb-1" style={{ fontSize: 24 }}>
                    / {totalWeekly}
                  </Text>
                </View>
              </View>
              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: '#e5f7f5' }}
              >
                <Ionicons name="trending-up-outline" size={26} color="#00A896" />
              </View>
            </View>

            <View className="bg-gray-100 rounded-full overflow-hidden mb-3" style={{ height: 10 }}>
              <View
                style={{
                  height: 10,
                  width: `${weeklyPercent}%`,
                  backgroundColor: '#00A896',
                  borderRadius: 99,
                }}
              />
            </View>

            <Text className="text-gray-500 text-sm">
              ¡Excelente trabajo! Estás al {weeklyPercent}% de tu objetivo semanal.
            </Text>
          </View>

          {/* Próximos Ejercicios */}
          <View
            className="bg-white rounded-2xl p-5"
            style={{
              borderWidth: 1, borderColor: '#F3F4F6',
              elevation: 2, shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.07, shadowRadius: 4,
            }}
          >
            <Text className="text-navy font-bold text-lg mb-3">Próximos Ejercicios</Text>

            {UPCOMING.map((u, index) => (
              <View
                key={u.id}
                className="flex-row items-center py-3"
                style={{
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: '#F3F4F6',
                }}
              >
                <View className="flex-1">
                  <View className="flex-row items-center flex-wrap mb-1" style={{ gap: 7 }}>
                    <Text className="text-navy font-semibold text-sm">{u.name}</Text>
                    <View className="bg-gray-100 rounded-full px-2.5 py-0.5">
                      <Text className="text-gray-500 text-xs">{u.day}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-400 text-xs">{u.muscle}</Text>
                  <Text className="text-gray-400 text-xs">
                    {u.series} series × {u.reps} reps
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              className="rounded-xl items-center justify-center mt-3"
              style={{ height: 46, borderWidth: 1.5, borderColor: '#00A896' }}
              onPress={goToCalendar}
              activeOpacity={0.7}
            >
              <Text className="font-semibold text-sm" style={{ color: '#00A896' }}>
                Ver rutina completa
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
