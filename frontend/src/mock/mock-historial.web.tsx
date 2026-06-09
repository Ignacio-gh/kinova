import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarPaciente } from '@/components/web/web-sidebar-paciente';

const C = {
  bg: '#F1F5F9',
  white: '#FFFFFF',
  navy: '#002B49',
  turquoise: '#00A896',
  turquoiseBg: '#e5f7f5',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  border: '#E5E7EB',
  green: '#16A34A',
  amber: '#F59E0B',
  red: '#EF4444',
};

type SessionExercise = { name: string; series: number; reps: number; completed: boolean };
type Session = {
  id: string; date: string; durationMin: number; adherence: number; exercises: SessionExercise[];
};

const STATS = { sessions: 5, adherence: 90, totalMin: 115, exercisesCompleted: 9 };

const SESSIONS: Session[] = [
  {
    id: 's1', date: 'lunes, 11 de mayo de 2026', durationMin: 25, adherence: 100,
    exercises: [
      { name: 'Sentadilla Búlgara', series: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', series: 3, reps: 15, completed: true },
    ],
  },
  {
    id: 's2', date: 'domingo, 10 de mayo de 2026', durationMin: 15, adherence: 100,
    exercises: [{ name: 'Elevación de Talón', series: 3, reps: 30, completed: true }],
  },
  {
    id: 's3', date: 'viernes, 8 de mayo de 2026', durationMin: 18, adherence: 50,
    exercises: [
      { name: 'Sentadilla Búlgara', series: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', series: 3, reps: 15, completed: false },
    ],
  },
  {
    id: 's4', date: 'jueves, 7 de mayo de 2026', durationMin: 22, adherence: 100,
    exercises: [
      { name: 'Puente de Glúteo', series: 4, reps: 25, completed: true },
      { name: 'Zancada Frontal', series: 3, reps: 15, completed: true },
    ],
  },
  {
    id: 's5', date: 'martes, 5 de mayo de 2026', durationMin: 35, adherence: 100,
    exercises: [
      { name: 'Sentadilla Búlgara', series: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', series: 3, reps: 15, completed: true },
      { name: 'Elevación de Talón', series: 3, reps: 30, completed: true },
    ],
  },
];

const adherenceColor = (v: number) => v >= 90 ? C.green : v >= 60 ? C.amber : C.red;
const adherenceBg = (v: number) =>
  v >= 90 ? '#F0FDF4' : v >= 60 ? '#FFFBEB' : '#FFF1F2';

export default function HistorialWeb() {
  return (
    <View style={s.root}>
      <WebSidebarPaciente />

      <View style={s.main}>
        {/* Topbar */}
        // En la parte superior del historial (línea 73 aprox):
        <View style={s.topbar}>
          <View nativeID="tutorial-historial-title"> {/* <-- AGREGADO */}
            <Text style={s.pageTitle}>Historial de Sesiones</Text>
            <Text style={s.pageSub}>Revisá tus sesiones completadas y tu progreso</Text>
          </View>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats — 4 cards en fila */}
          <View style={s.statsRow}>
            {[
              { label: 'Total de Sesiones', value: String(STATS.sessions), icon: 'calendar-outline' as const, highlight: false },
              { label: 'Adherencia Promedio', value: `${STATS.adherence}%`, icon: 'trending-up-outline' as const, highlight: true },
              { label: 'Tiempo Total', value: `${STATS.totalMin} min`, icon: 'time-outline' as const, highlight: true },
              { label: 'Ejercicios Completados', value: String(STATS.exercisesCompleted), icon: 'checkmark-circle-outline' as const, highlight: false },
            ].map((stat) => (
              <View key={stat.label} style={s.statCard}>
                <View style={[s.statIcon, stat.highlight && s.statIconHighlight]}>
                  <Ionicons name={stat.icon} size={20} color={stat.highlight ? C.turquoise : C.gray400} />
                </View>
                <Text style={[s.statVal, stat.highlight && s.statValHighlight]}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Tabla de sesiones */}
          <View style={s.tableCard}>
            {/* Head */}
            <View style={s.tableHead}>
              <Text style={[s.th, { flex: 2 }]}>Fecha</Text>
              <Text style={[s.th, { flex: 1 }]}>Duración</Text>
              <Text style={[s.th, { flex: 1 }]}>Adherencia</Text>
              <Text style={[s.th, { flex: 3 }]}>Ejercicios</Text>
            </View>

            {SESSIONS.map((session, i) => {
              const color = adherenceColor(session.adherence);
              const bg = adherenceBg(session.adherence);
              const dateCapitalized = session.date.charAt(0).toUpperCase() + session.date.slice(1);
              return (
                <View key={session.id} style={[s.tableRow, i % 2 === 1 && s.tableRowAlt]}>
                  {/* Fecha */}
                  <View style={[s.td, { flex: 2 }]}>
                    <View style={s.dateCell}>
                      <View style={s.calIcon}>
                        <Ionicons name="calendar-outline" size={16} color={C.turquoise} />
                      </View>
                      <View>
                        <Text style={s.dateText}>{dateCapitalized}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Duración */}
                  <View style={[s.td, { flex: 1 }]}>
                    <View style={s.durationCell}>
                      <Ionicons name="time-outline" size={14} color={C.gray400} />
                      <Text style={s.durationText}>{session.durationMin} min</Text>
                    </View>
                  </View>

                  {/* Adherencia */}
                  <View style={[s.td, { flex: 1 }]}>
                    <View style={[s.adherenceBadge, { backgroundColor: bg }]}>
                      <Text style={[s.adherenceVal, { color }]}>{session.adherence}%</Text>
                    </View>
                  </View>

                  {/* Ejercicios */}
                  <View style={[s.td, { flex: 3 }]}>
                    <View style={s.exList}>
                      {session.exercises.map((ex, j) => (
                        <View key={j} style={s.exChip}>
                          <Ionicons
                            name={ex.completed ? 'checkmark-circle' : 'ellipse-outline'}
                            size={13}
                            color={ex.completed ? C.green : C.gray400}
                          />
                          <Text style={s.exChipText}>{ex.name}</Text>
                          <Text style={s.exChipDetail}>{ex.series}×{ex.reps}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: C.bg },
  main: { flex: 1, flexDirection: 'column', overflow: 'hidden' },
  topbar: {
    paddingHorizontal: 36, paddingTop: 32, paddingBottom: 20,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  pageTitle: { color: C.navy, fontSize: 26, fontWeight: '800' },
  pageSub: { color: C.gray400, fontSize: 13, marginTop: 3 },
  scroll: { flex: 1 },
  scrollContent: { padding: 36, gap: 20 },

  statsRow: { flexDirection: 'row', gap: 16 },
  statCard: {
    flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 20,
    alignItems: 'flex-start', gap: 8,
    borderWidth: 1, borderColor: C.border,
  },
  statIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: C.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  statIconHighlight: { backgroundColor: C.turquoiseBg },
  statVal: { color: C.navy, fontSize: 30, fontWeight: '800' },
  statValHighlight: { color: C.turquoise },
  statLabel: { color: C.gray400, fontSize: 12 },

  tableCard: {
    backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 20,
    backgroundColor: C.bg,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  th: { fontSize: 11, fontWeight: '700', color: C.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 16, paddingHorizontal: 20,
    backgroundColor: C.white,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  tableRowAlt: { backgroundColor: '#FAFAFA' },
  td: { justifyContent: 'flex-start', paddingRight: 12 },

  dateCell: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  calIcon: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: C.turquoiseBg,
    alignItems: 'center', justifyContent: 'center',
  },
  dateText: { color: C.navy, fontSize: 13, fontWeight: '600' },
  durationCell: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  durationText: { color: C.gray500, fontSize: 13 },
  adherenceBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20,
  },
  adherenceVal: { fontSize: 14, fontWeight: '800' },
  exList: { gap: 6 },
  exChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.bg, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  exChipText: { color: C.navy, fontSize: 12, fontWeight: '500' },
  exChipDetail: { color: C.gray400, fontSize: 11 },
});
