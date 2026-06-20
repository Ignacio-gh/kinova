import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const adherenceColor = (v: number) => (v >= 90 ? '#16A34A' : v >= 60 ? '#F59E0B' : '#EF4444');

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View
      className="flex-1 bg-white rounded-2xl p-4 items-center justify-center"
      style={{ borderWidth: 1, borderColor: '#F3F4F6', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, minHeight: 90 }}
    >
      <Text className="text-gray-400 text-xs text-center mb-1">{label}</Text>
      <Text className="font-extrabold text-center" style={{ fontSize: 28, color: highlight ? '#00A896' : '#002B49' }}>{value}</Text>
    </View>
  );
}

function MockSessionCard({ session }: { session: any }) {
  const adherence = session.adherence_pct;
  const color = adherenceColor(adherence);

  return (
    <View
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{ borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
    >
      <View className="flex-row items-center px-4 py-3" style={{ borderBottomWidth: 1, borderBottomColor: '#F9FAFB' }}>
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: '#e5f7f5' }}>
          <Ionicons name="calendar-outline" size={20} color="#00A896" />
        </View>
        <View className="flex-1">
          <Text className="text-navy font-bold text-sm">{session.date}</Text>
          <View className="flex-row items-center mt-0.5" style={{ gap: 8 }}>
            <View className="flex-row items-center" style={{ gap: 3 }}>
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs">{session.duration_minutes} minutos</Text>
            </View>
            <Text className="text-gray-300 text-xs">·</Text>
            <Text className="text-gray-400 text-xs">{session.exercises.length} ejercicios</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 text-xs mb-0.5">Adherencia</Text>
          <Text className="font-extrabold text-xl" style={{ color }}>{adherence}%</Text>
        </View>
      </View>

      <View className="px-4 py-3 flex-row flex-wrap" style={{ gap: 8 }}>
        {session.exercises.map((ex: any, i: number) => (
          <View key={i} className="rounded-xl p-3" style={{ flex: 1, minWidth: '45%', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6' }}>
            <View className="flex-row items-start justify-between mb-1">
              <Text className="text-navy font-semibold text-sm flex-1 mr-2" numberOfLines={2}>{ex.name}</Text>
              <Ionicons name={ex.completed ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={ex.completed ? '#16A34A' : '#D1D5DB'} />
            </View>
            <Text className="text-gray-400 text-xs">{ex.sets} series × {ex.reps} reps</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function MockHistorialSesiones() {
  // --- Datos Estáticos ---
  const stats = { total_sessions: 12, avg_adherence: 95, total_minutes: 320, exercises_completed: 48 };
  const mockSessions = [
    {
      id: 1, date: 'Miércoles, 17 de junio', duration_minutes: 25, adherence_pct: 100,
      exercises: [{ name: 'Sentadilla Asistida', sets: 3, reps: 12, completed: true }, { name: 'Estocadas', sets: 3, reps: 10, completed: true }]
    },
    {
      id: 2, date: 'Lunes, 15 de junio', duration_minutes: 30, adherence_pct: 85,
      exercises: [{ name: 'Elevación de Talones', sets: 3, reps: 15, completed: true }, { name: 'Flexión de Rodilla', sets: 3, reps: 10, completed: false }]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <FlatList
        data={mockSessions}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListHeaderComponent={
          <>
            <View className="px-5 pt-4 pb-4">
              <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>Historial de Sesiones</Text>
              <Text className="text-gray-400 text-sm mt-0.5">Revisa tus sesiones completadas y tu progreso</Text>
            </View>
            <View className="px-5 pb-5" style={{ gap: 10 }}>
              <View className="flex-row" style={{ gap: 10 }}>
                <StatCard label="Total de Sesiones" value={String(stats.total_sessions)} />
                <StatCard label="Adherencia Promedio" value={`${stats.avg_adherence}%`} highlight />
              </View>
              <View className="flex-row" style={{ gap: 10 }}>
                <StatCard label="Tiempo Total" value={`${stats.total_minutes} min`} highlight />
                <StatCard label="Ejercicios Completados" value={String(stats.exercises_completed)} />
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <MockSessionCard session={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}