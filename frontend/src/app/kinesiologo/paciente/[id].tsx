import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type RoutineExercise = {
  id: string;
  name: string;
  series: number;
  reps: number;
  angle?: string;
  muscle: string;
  completed: boolean;
};

type Patient = {
  id: string;
  name: string;
  diagnosis: string;
  period: string;
  adherence: number;
  status: 'Activo' | 'Finalizado';
  medicalNotes: string;
  durationWeeks: number;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PATIENTS: Record<string, Patient> = {
  '1': {
    id: '1',
    name: 'Carlos Rodríguez',
    diagnosis: 'Lesión de rodilla izquierda',
    period: '11/5/2026 al 31/5/2026',
    adherence: 85,
    status: 'Activo',
    medicalNotes:
      'El paciente refiere molestia leve en la cara lateral externa al realizar flexión profunda. Monitorear rangos anulares en sentadillas.',
    durationWeeks: 3,
  },
  '2': {
    id: '2',
    name: 'María González',
    diagnosis: 'Rehabilitación de tobillo',
    period: '10/5/2026 al 7/6/2026',
    adherence: 92,
    status: 'Activo',
    medicalNotes: 'Sin observaciones adicionales.',
    durationWeeks: 4,
  },
  '3': {
    id: '3',
    name: 'Juan Pérez',
    diagnosis: 'Fortalecimiento de cuádriceps',
    period: '1/4/2026 al 27/4/2026',
    adherence: 100,
    status: 'Finalizado',
    medicalNotes: 'Tratamiento completado exitosamente.',
    durationWeeks: 4,
  },
};

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;
type Day = (typeof DAYS)[number];

const MOCK_ROUTINE: Record<Day, RoutineExercise[]> = {
  Lun: [
    { id: 'e1', name: 'Sentadilla Búlgara', series: 3, reps: 20, angle: '60° - 90°', muscle: 'Muslo', completed: true },
    { id: 'e2', name: 'Extensión de Rodilla', series: 3, reps: 15, angle: '0° - 60°', muscle: 'Muslo', completed: true },
  ],
  Mar: [
    { id: 'e3', name: 'Elevación de Talón', series: 3, reps: 30, angle: '-', muscle: 'Tobillo', completed: false },
  ],
  Mié: [
    { id: 'e4', name: 'Puente de Glúteo', series: 4, reps: 25, angle: '-', muscle: 'Glúteo', completed: false },
  ],
  Jue: [],
  Vie: [
    { id: 'e5', name: 'Zancada Frontal', series: 3, reps: 15, angle: '70° - 110°', muscle: 'Muslo', completed: false },
  ],
  Sáb: [],
  Dom: [],
};

// ─── Sub-componente: tarjeta de ejercicio en la rutina ────────────────────────

function RoutineCard({ exercise }: { exercise: RoutineExercise }) {
  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={{
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      }}
    >
      {/* Título + estado */}
      <View className="flex-row items-start justify-between mb-1">
        <Text className="text-navy font-bold text-base flex-1 mr-2">{exercise.name}</Text>
        <Ionicons
          name={exercise.completed ? 'checkmark-circle' : 'close-circle-outline'}
          size={20}
          color={exercise.completed ? '#16A34A' : '#9CA3AF'}
        />
      </View>

      {/* Series × Reps */}
      <Text className="text-gray-500 text-sm mb-1">
        {exercise.series} series × {exercise.reps} reps
      </Text>

      {/* Ángulo */}
      {exercise.angle && exercise.angle !== '-' && (
        <Text className="text-sm mb-2" style={{ color: '#00A896' }}>
          Ángulo: {exercise.angle}
        </Text>
      )}

      {/* Muscle tag + acciones */}
      <View className="flex-row items-center justify-between mt-1">
        <View className="bg-turquoise-light rounded-full px-3 py-1">
          <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>
            {exercise.muscle}
          </Text>
        </View>
        <View className="flex-row" style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              // TODO: abrir modal de edición
            }}
            hitSlop={8}
          >
            <Ionicons name="pencil-outline" size={18} color="#00A896" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // TODO: confirmar y eliminar ejercicio del día
            }}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function PatientDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDay, setSelectedDay] = useState<Day>('Lun');

  const patient = MOCK_PATIENTS[id ?? '1'];
  const dayExercises = MOCK_ROUTINE[selectedDay] ?? [];

  if (!patient) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-400">Paciente no encontrado</Text>
      </SafeAreaView>
    );
  }

  const isActive = patient.status === 'Activo';
  const adherenceColor = patient.adherence >= 90 ? '#16A34A' : '#00A896';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        {/* ── Encabezado ─────────────────────────────────────────────────── */}
        <View className="px-5 pt-4">
          {/* Volver */}
          <TouchableOpacity
            className="flex-row items-center mb-5"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#6B7280" />
            <Text className="text-gray-500 text-sm ml-2">Volver a Pacientes</Text>
          </TouchableOpacity>

          {/* Nombre + adherencia */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-navy font-extrabold" style={{ fontSize: 28 }}>
                {patient.name}
              </Text>
              <Text className="font-semibold mt-1" style={{ color: '#00A896', fontSize: 14 }}>
                {patient.diagnosis} • Post-operatorio, {patient.durationWeeks} semanas de duración
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Período de vigencia: {patient.period}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs">Adherencia al Tratamiento</Text>
              <Text
                className="font-extrabold"
                style={{ fontSize: 32, color: adherenceColor }}
              >
                {patient.adherence}%
              </Text>
            </View>
          </View>
        </View>

        {/* ── Notas médicas + controles ────────────────────────────────────── */}
        <View className="px-5 mt-5 mb-4">
          <View
            className="bg-white rounded-2xl p-4 mb-3"
            style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
          >
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Notas médicas / Observations:
            </Text>
            <Text className="text-gray-600 text-sm leading-relaxed">
              {patient.medicalNotes}
            </Text>
          </View>

          {/* Duración + Estado */}
          <View
            className="bg-white rounded-2xl p-4 flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
          >
            <View>
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Duración
              </Text>
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <TouchableOpacity
                  className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                  onPress={() => {}}
                >
                  <Text className="text-gray-600 font-bold">−</Text>
                </TouchableOpacity>
                <Text className="text-navy font-bold text-base">
                  {patient.durationWeeks} Sem.
                </Text>
                <TouchableOpacity
                  className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                  onPress={() => {}}
                >
                  <Text className="text-gray-600 font-bold">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="items-end">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Estado
              </Text>
              <View
                className="flex-row items-center rounded-full px-4 py-1.5"
                style={{
                  borderWidth: 1.5,
                  borderColor: isActive ? '#00A896' : '#9CA3AF',
                }}
              >
                <View
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: isActive ? '#00A896' : '#9CA3AF' }}
                />
                <Text
                  className="text-xs font-bold uppercase"
                  style={{ color: isActive ? '#00A896' : '#9CA3AF' }}
                >
                  {patient.status}
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            {DAYS.map((day) => {
              const active = selectedDay === day;
              const hasExercises = (MOCK_ROUTINE[day] ?? []).length > 0;
              return (
                <TouchableOpacity
                  key={day}
                  className="items-center rounded-xl px-3"
                  style={{
                    height: 56,
                    minWidth: 56,
                    backgroundColor: active ? '#00A896' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: active ? '#00A896' : '#E5E7EB',
                    justifyContent: 'center',
                  }}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-bold"
                    style={{ color: active ? '#FFFFFF' : '#002B49' }}
                  >
                    {day}
                  </Text>
                  {hasExercises && !active && (
                    <View
                      className="w-1.5 h-1.5 rounded-full mt-1"
                      style={{ backgroundColor: '#00A896' }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Ejercicios del día seleccionado ────────────────────────────── */}
        <View className="px-5 pb-10">
          {/* Botón asignar */}
          <TouchableOpacity
            className="rounded-xl items-center justify-center mb-4"
            style={{
              height: 44,
              borderWidth: 1.5,
              borderColor: '#00A896',
              borderStyle: 'dashed',
            }}
            onPress={() => {
              // TODO: abrir modal de asignación de ejercicio para selectedDay
            }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Ionicons name="add" size={18} color="#00A896" />
              <Text className="font-semibold text-sm" style={{ color: '#00A896' }}>
                Asignar ejercicio — {selectedDay}
              </Text>
            </View>
          </TouchableOpacity>

          {dayExercises.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 text-sm mt-3">
                Sin ejercicios asignados para {selectedDay}
              </Text>
            </View>
          ) : (
            dayExercises.map((ex) => <RoutineCard key={ex.id} exercise={ex} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
