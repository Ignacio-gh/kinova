import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

function MockRoutineCard({ exercise }: { exercise: any }) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3" style={{ borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 }}>
      <Text className="text-navy font-bold text-base mb-1">{exercise.name}</Text>
      <Text className="text-gray-500 text-sm mb-1">{exercise.series} series × {exercise.reps} reps</Text>
      {exercise.angle && <Text className="text-sm mb-2" style={{ color: '#00A896' }}>Ángulo: {exercise.angle}</Text>}
      <View className="bg-turquoise-light rounded-full px-3 py-1 self-start" style={{ backgroundColor: '#e5f7f5' }}>
        <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>{exercise.muscle}</Text>
      </View>
    </View>
  );
}

export default function MockPatientDetail() {
  const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const [selectedDay, setSelectedDay] = useState('Lun');

  const patient = { full_name: 'Carlos Mendoza', diagnosis: 'Rehabilitación LCA', treatment_weeks: 12, email: 'carlos@email.com', current_week: 3, adherence_pct: 92, notes: 'Paciente muestra buena evolución en la flexión.', phone: '+54 11 1234-5678', status: 'activo' };
  const mockExercises = [{ id: '1', name: 'Sentadilla Asistida', series: 3, reps: 12, angle: '90° - 180°', muscle: 'Cuádriceps' }];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        
        <View className="px-5 pt-4">
          <View className="flex-row items-center mb-5">
            <Ionicons name="arrow-back" size={18} color="#6B7280" />
            <Text className="text-gray-500 text-sm ml-2">Volver a Pacientes</Text>
          </View>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-navy font-extrabold" style={{ fontSize: 28 }}>{patient.full_name}</Text>
              <Text className="font-semibold mt-1" style={{ color: '#00A896', fontSize: 14 }}>{patient.diagnosis} · {patient.treatment_weeks} semanas</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{patient.email}</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs">Adherencia</Text>
              <Text className="font-extrabold" style={{ fontSize: 32, color: '#16A34A' }}>{patient.adherence_pct}%</Text>
              <Text className="text-gray-400 text-xs">Semana {patient.current_week}/{patient.treatment_weeks}</Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-5 mb-4">
          <View className="bg-white rounded-2xl p-4 mb-3" style={{ borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Notas clínicas</Text>
            <Text className="text-gray-600 text-sm leading-relaxed">{patient.notes}</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between" style={{ borderWidth: 1, borderColor: '#E5E7EB' }}>
            <View>
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Teléfono</Text>
              <Text className="text-navy font-semibold">{patient.phone}</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Estado</Text>
              <View className="flex-row items-center rounded-full px-4 py-1.5" style={{ borderWidth: 1.5, borderColor: '#00A896' }}>
                <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#00A896' }} />
                <Text className="text-xs font-bold uppercase" style={{ color: '#00A896' }}>Activo</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-gray-50 pt-1 pb-3">
          <View className="px-5 mb-3"><Text className="text-navy font-bold text-lg">Rutina Semanal</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {DAYS.map((day) => {
              const active = selectedDay === day;
              return (
                <TouchableOpacity key={day} className="items-center rounded-xl px-3" style={{ height: 56, minWidth: 56, backgroundColor: active ? '#00A896' : '#FFFFFF', borderWidth: 1, borderColor: active ? '#00A896' : '#E5E7EB', justifyContent: 'center' }} onPress={() => setSelectedDay(day)} activeOpacity={1}>
                  <Text className="text-sm font-bold" style={{ color: active ? '#FFFFFF' : '#002B49' }}>{day}</Text>
                  {day === 'Lun' && !active && <View className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: '#00A896' }} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="px-5 pb-10">
          {selectedDay === 'Lun' ? mockExercises.map((ex) => <MockRoutineCard key={ex.id} exercise={ex} />) : (
            <View className="items-center py-10">
              <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 text-sm mt-3">Sin ejercicios para {selectedDay}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}