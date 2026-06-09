import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type RoutineExercise = {
  id: string;
  name: string;
  series: number;
  reps: number;
  angle?: string;
  muscle: string;
};

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;
type Day = (typeof DAYS)[number];

const DAY_MAP: Record<string, Day> = {
  monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié',
  thursday: 'Jue', friday: 'Vie', saturday: 'Sáb', sunday: 'Dom',
};

// ─── Sub-componente: tarjeta de ejercicio ────────────────────────────────────

function RoutineCard({ exercise }: { exercise: RoutineExercise }) {
  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={{ borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 }}
    >
      <View className="flex-row items-start justify-between mb-1">
        <Text className="text-navy font-bold text-base flex-1 mr-2">{exercise.name}</Text>
      </View>
      <Text className="text-gray-500 text-sm mb-1">
        {exercise.series} series × {exercise.reps} reps
      </Text>
      {exercise.angle && (
        <Text className="text-sm mb-2" style={{ color: '#00A896' }}>
          Ángulo: {exercise.angle}
        </Text>
      )}
      <View className="bg-turquoise-light rounded-full px-3 py-1 self-start">
        <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>{exercise.muscle}</Text>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function PatientDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDay, setSelectedDay] = useState<Day>('Lun');
  const [patient, setPatient] = useState<any>(null);
  const [routine, setRoutine] = useState<Record<Day, RoutineExercise[]>>(
    Object.fromEntries(DAYS.map((d) => [d, []])) as Record<Day, RoutineExercise[]>
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<any>(`/api/v1/patients/${id}`),
      api.get<any>(`/api/v1/routines/patient/${id}`),
    ])
      .then(([patientData, weeklyData]) => {
        setPatient(patientData);
        const mapped = Object.fromEntries(DAYS.map((d) => [d, []])) as Record<Day, RoutineExercise[]>;
        for (const [backendDay, items] of Object.entries(weeklyData) as [string, any[]][]) {
          const day = DAY_MAP[backendDay];
          if (!day) continue;
          mapped[day] = items.map((r: any) => ({
            id: String(r.id),
            name: r.exercise.name,
            series: r.sets,
            reps: r.reps,
            angle: r.angle_min != null && r.angle_max != null ? `${r.angle_min}° - ${r.angle_max}°` : undefined,
            muscle: r.exercise.zone,
          }));
        }
        setRoutine(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#00A896" />
      </SafeAreaView>
    );
  }

  if (!patient) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-400">Paciente no encontrado</Text>
      </SafeAreaView>
    );
  }

  const isActive = patient.status === 'activo';
  const adherence = Math.round(patient.adherence_pct ?? 0);
  const adherenceColor = adherence >= 90 ? '#16A34A' : '#00A896';
  const dayExercises = routine[selectedDay] ?? [];

  const startDate = patient.treatment_start_date
    ? new Date(patient.treatment_start_date).toLocaleDateString('es-AR')
    : '-';
  const endDate = patient.treatment_start_date && patient.treatment_weeks
    ? new Date(new Date(patient.treatment_start_date).getTime() + patient.treatment_weeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')
    : '-';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        {/* ── Encabezado ─────────────────────────────────────────────────── */}
        <View className="px-5 pt-4">
          <TouchableOpacity className="flex-row items-center mb-5" onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={18} color="#6B7280" />
            <Text className="text-gray-500 text-sm ml-2">Volver a Pacientes</Text>
          </TouchableOpacity>

          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-navy font-extrabold" style={{ fontSize: 28 }}>
                {patient.user.full_name}
              </Text>
              <Text className="font-semibold mt-1" style={{ color: '#00A896', fontSize: 14 }}>
                {patient.diagnosis} · {patient.treatment_weeks} semanas
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {startDate} al {endDate}
              </Text>
              <Text className="text-gray-400 text-xs mt-0.5">{patient.user.email}</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs">Adherencia</Text>
              <Text className="font-extrabold" style={{ fontSize: 32, color: adherenceColor }}>
                {adherence}%
              </Text>
              <Text className="text-gray-400 text-xs">Semana {patient.current_week}/{patient.treatment_weeks}</Text>
            </View>
          </View>
        </View>

        {/* ── Notas + estado ──────────────────────────────────────────────── */}
        <View className="px-5 mt-5 mb-4">
          {patient.notes ? (
            <View className="bg-white rounded-2xl p-4 mb-3" style={{ borderWidth: 1, borderColor: '#E5E7EB' }}>
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Notas clínicas</Text>
              <Text className="text-gray-600 text-sm leading-relaxed">{patient.notes}</Text>
            </View>
          ) : null}

          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between" style={{ borderWidth: 1, borderColor: '#E5E7EB' }}>
            <View>
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Teléfono</Text>
              <Text className="text-navy font-semibold">{patient.phone ?? 'No registrado'}</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Estado</Text>
              <View className="flex-row items-center rounded-full px-4 py-1.5" style={{ borderWidth: 1.5, borderColor: isActive ? '#00A896' : '#9CA3AF' }}>
                <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: isActive ? '#00A896' : '#9CA3AF' }} />
                <Text className="text-xs font-bold uppercase" style={{ color: isActive ? '#00A896' : '#9CA3AF' }}>
                  {isActive ? 'Activo' : 'Finalizado'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Selector de días (sticky) ───────────────────────────────────── */}
        <View className="bg-gray-50 pt-1 pb-3">
          <View className="px-5 mb-3">
            <Text className="text-navy font-bold text-lg">Rutina Semanal</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {DAYS.map((day) => {
              const active = selectedDay === day;
              const hasExercises = (routine[day] ?? []).length > 0;
              return (
                <TouchableOpacity
                  key={day}
                  className="items-center rounded-xl px-3"
                  style={{ height: 56, minWidth: 56, backgroundColor: active ? '#00A896' : '#FFFFFF', borderWidth: 1, borderColor: active ? '#00A896' : '#E5E7EB', justifyContent: 'center' }}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text className="text-sm font-bold" style={{ color: active ? '#FFFFFF' : '#002B49' }}>{day}</Text>
                  {hasExercises && !active && (
                    <View className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: '#00A896' }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Ejercicios del día ───────────────────────────────────────────── */}
        <View className="px-5 pb-10">
          {dayExercises.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 text-sm mt-3">Sin ejercicios para {selectedDay}</Text>
            </View>
          ) : (
            dayExercises.map((ex) => <RoutineCard key={ex.id} exercise={ex} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
