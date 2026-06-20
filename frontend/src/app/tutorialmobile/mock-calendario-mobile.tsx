import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type ExerciseCardProps = {
  exercise: { id: string; name: string; muscle: string; reps: number; series: number; angle?: string };
  completed: boolean;
};

function MockCalendarExerciseCard({ exercise, completed }: ExerciseCardProps) {
  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={{
        borderWidth: 1, borderColor: completed ? '#e5f7f5' : '#F3F4F6',
        elevation: 2, shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4,
      }}
    >
      <Text className="text-navy font-bold text-base mb-1">{exercise.name}</Text>
      <Text className="text-gray-500 text-sm mb-1">{exercise.series} series × {exercise.reps} reps</Text>
      {exercise.angle && <Text className="text-sm mb-2" style={{ color: '#00A896' }}>Ángulo: {exercise.angle}</Text>}
      <View className="self-start rounded-full px-3 py-1 mb-4" style={{ backgroundColor: '#e5f7f5' }}>
        <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>{exercise.muscle}</Text>
      </View>

      <View style={{ gap: 8 }}>
        <TouchableOpacity className="rounded-xl items-center justify-center" style={{ height: 42, borderWidth: 1.5, borderColor: '#00A896' }} activeOpacity={1}>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Ionicons name="play-circle-outline" size={16} color="#00A896" />
            <Text className="text-sm font-semibold" style={{ color: '#00A896' }}>Video Demo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-xl items-center justify-center"
          style={{ height: 42, backgroundColor: completed ? '#e5f7f5' : '#F9FAFB', borderWidth: 1, borderColor: completed ? '#00A896' : '#E5E7EB' }}
          activeOpacity={1}
        >
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Ionicons name={completed ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={completed ? '#00A896' : '#9CA3AF'} />
            <Text className="text-sm font-medium" style={{ color: completed ? '#00A896' : '#6B7280' }}>
              {completed ? 'Completado' : 'Marcar Listo'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MockMiCalendario() {
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const selectedDay = 'Viernes';
  const completedIds = new Set(['1']); // Simulamos que el Lunes ya se completó
  
  const dayExercises = [
    { id: '2', name: 'Sentadilla Asistida', muscle: 'Cuádriceps', reps: 12, series: 3, angle: '90° - 180°' },
    { id: '3', name: 'Elevación de Talones', muscle: 'Gemelos', reps: 15, series: 3 }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        
        {/* Header */}
        <View className="px-5 pt-4 pb-4">
          <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>Mi Calendario Semanal</Text>
          <Text className="text-gray-400 text-sm mt-0.5">Visualiza y completa tus ejercicios asignados</Text>
          <View className="flex-row items-center rounded-2xl px-4 py-3 mt-4" style={{ backgroundColor: '#e5f7f5', borderWidth: 1, borderColor: '#b2ece6' }}>
            <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#00A896' }}>
              <Ionicons name="person-outline" size={16} color="white" />
            </View>
            <Text className="text-gray-600 text-xs flex-1 leading-relaxed">
              Tu rutina actual fue proporcionada y supervisada por el profesional: <Text className="font-bold" style={{ color: '#00A896' }}>Lic. Ignacio Ghiggi</Text>
            </Text>
          </View>
        </View>

        {/* Selector de días (sticky) */}
        <View className="bg-gray-50 pb-3 pt-1">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {DAYS.map((day) => {
              const active = selectedDay === day;
              const hasExercises = day === 'Lunes' || day === 'Viernes'; // Fake data
              const dayCompleted = day === 'Lunes';
              return (
                <TouchableOpacity
                  key={day} className="items-center rounded-xl px-3"
                  style={{ height: 56, minWidth: 56, backgroundColor: active ? '#00A896' : '#FFFFFF', borderWidth: 1, borderColor: active ? '#00A896' : '#E5E7EB', justifyContent: 'center' }}
                  activeOpacity={1}
                >
                  <Text className="text-sm font-bold" style={{ color: active ? '#FFFFFF' : '#002B49' }}>{day}</Text>
                  {hasExercises && !active && (
                    <View className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: dayCompleted ? '#16A34A' : '#00A896' }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Ejercicios del día */}
        <View className="px-5 pb-10 pt-2">
          {dayExercises.map((ex) => (
            <MockCalendarExerciseCard key={ex.id} exercise={ex} completed={false} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}