import { View, Text, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type SessionExercise = {
  name: string;
  series: number;
  reps: number;
  completed: boolean;
};

type Session = {
  id: string;
  date: string;
  durationMin: number;
  adherence: number;
  exercises: SessionExercise[];
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS = {
  sessions: 5,
  adherence: 90,
  totalMin: 115,
  exercisesCompleted: 9,
};

const SESSIONS: Session[] = [
  {
    id: 's1',
    date: 'lunes, 11 de mayo de 2026',
    durationMin: 25,
    adherence: 100,
    exercises: [
      { name: 'Sentadilla Búlgara', series: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', series: 3, reps: 15, completed: true },
    ],
  },
  {
    id: 's2',
    date: 'domingo, 10 de mayo de 2026',
    durationMin: 15,
    adherence: 100,
    exercises: [
      { name: 'Elevación de Talón', series: 3, reps: 30, completed: true },
    ],
  },
  {
    id: 's3',
    date: 'viernes, 8 de mayo de 2026',
    durationMin: 18,
    adherence: 50,
    exercises: [
      { name: 'Sentadilla Búlgara', series: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', series: 3, reps: 15, completed: false },
    ],
  },
  {
    id: 's4',
    date: 'jueves, 7 de mayo de 2026',
    durationMin: 22,
    adherence: 100,
    exercises: [
      { name: 'Puente de Glúteo', series: 4, reps: 25, completed: true },
      { name: 'Zancada Frontal', series: 3, reps: 15, completed: true },
    ],
  },
  {
    id: 's5',
    date: 'martes, 5 de mayo de 2026',
    durationMin: 35,
    adherence: 100,
    exercises: [
      { name: 'Sentadilla Búlgara', series: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', series: 3, reps: 15, completed: true },
      { name: 'Elevación de Talón', series: 3, reps: 30, completed: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const adherenceColor = (v: number) =>
  v >= 90 ? '#16A34A' : v >= 60 ? '#F59E0B' : '#EF4444';

// ─── Sub-componente: tarjeta de estadística ───────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function StatCard({ label, value, highlight = false }: StatCardProps) {
  return (
    <View
      className="flex-1 bg-white rounded-2xl p-4 items-center justify-center"
      style={{
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        minHeight: 90,
      }}
    >
      <Text className="text-gray-400 text-xs text-center mb-1">{label}</Text>
      <Text
        className="font-extrabold text-center"
        style={{ fontSize: 28, color: highlight ? '#00A896' : '#002B49' }}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Sub-componente: tarjeta de sesión ────────────────────────────────────────

function SessionCard({ session }: { session: Session }) {
  const color = adherenceColor(session.adherence);
  const dateCapitalized =
    session.date.charAt(0).toUpperCase() + session.date.slice(1);

  return (
    <View
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      }}
    >
      {/* Header de sesión */}
      <View
        className="flex-row items-center px-4 py-3"
        style={{ borderBottomWidth: 1, borderBottomColor: '#F9FAFB' }}
      >
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: '#e5f7f5' }}
        >
          <Ionicons name="calendar-outline" size={20} color="#00A896" />
        </View>

        <View className="flex-1">
          <Text className="text-navy font-bold text-sm">{dateCapitalized}</Text>
          <View className="flex-row items-center mt-0.5" style={{ gap: 8 }}>
            <View className="flex-row items-center" style={{ gap: 3 }}>
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs">{session.durationMin} minutos</Text>
            </View>
            <Text className="text-gray-300 text-xs">·</Text>
            <Text className="text-gray-400 text-xs">
              {session.exercises.length} ejercicio{session.exercises.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-gray-400 text-xs mb-0.5">Adherencia</Text>
          <Text className="font-extrabold text-xl" style={{ color }}>
            {session.adherence}%
          </Text>
        </View>
      </View>

      {/* Grid de ejercicios */}
      <View className="px-4 py-3 flex-row flex-wrap" style={{ gap: 8 }}>
        {session.exercises.map((ex, i) => (
          <View
            key={i}
            className="rounded-xl p-3"
            style={{
              flex: 1,
              minWidth: '45%',
              backgroundColor: '#F9FAFB',
              borderWidth: 1,
              borderColor: '#F3F4F6',
            }}
          >
            <View className="flex-row items-start justify-between mb-1">
              <Text className="text-navy font-semibold text-sm flex-1 mr-2" numberOfLines={2}>
                {ex.name}
              </Text>
              <Ionicons
                name={ex.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={ex.completed ? '#16A34A' : '#D1D5DB'}
              />
            </View>
            <Text className="text-gray-400 text-xs">
              {ex.series} series × {ex.reps} reps
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function HistorialSesiones() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <FlatList
        data={SESSIONS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListHeaderComponent={
          <>
            {/* Título */}
            <View className="px-5 pt-4 pb-4">
              <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>
                Historial de Sesiones
              </Text>
              <Text className="text-gray-400 text-sm mt-0.5">
                Revisa tus sesiones completadas y tu progreso
              </Text>
            </View>

            {/* Estadísticas — grid 2×2 */}
            <View className="px-5 pb-5" style={{ gap: 10 }}>
              <View className="flex-row" style={{ gap: 10 }}>
                <StatCard label="Total de Sesiones" value={String(STATS.sessions)} />
                <StatCard
                  label="Adherencia Promedio"
                  value={`${STATS.adherence}%`}
                  highlight
                />
              </View>
              <View className="flex-row" style={{ gap: 10 }}>
                <StatCard
                  label="Tiempo Total"
                  value={`${STATS.totalMin} min`}
                  highlight
                />
                <StatCard
                  label="Ejercicios Completados"
                  value={String(STATS.exercisesCompleted)}
                />
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <SessionCard session={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
