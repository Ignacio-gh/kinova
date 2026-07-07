import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WebSidebarPaciente } from '@/components/web/web-sidebar-paciente';
import { usePacienteInicio, UPCOMING, type TodayExercise } from '@/mock/mock-use-paciente-inicio';
import { KinovaColors } from '@/constants/colors';

const C = {
  ...KinovaColors,
  turquoiseDim: 'rgba(0,168,150,0.10)',
};

export default function PacienteInicioWeb() {
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

  const startExercise = (ex: TodayExercise) =>
    router.push({
      pathname: '/paciente/ejercicio/[id]',
      params: { id: ex.id, name: ex.name, muscle: ex.muscle, reps: ex.reps, series: ex.series },
    } as never);

  return (
    <View style={s.root}>
      <WebSidebarPaciente />

      <ScrollView style={s.main} showsVerticalScrollIndicator={false}>
        {/* Topbar */}
        <View style={s.topbar}>
          <View nativeID="tutorial-welcome">
            <Text style={s.greeting}>Bienvenido, Carlos</Text>
            <Text style={s.date}>{today}</Text>
          </View>
          <View style={s.progressPill}>
            <Ionicons name="trending-up-outline" size={16} color={C.turquoise} />
            <Text style={s.progressPillText}>
              {completedToday} de {exercises.length} ejercicios completados hoy
            </Text>
          </View>
        </View>

        <View style={s.content}>
          <View style={s.row}>
            {/* Ejercicios de hoy */}
            <View style={[s.card, { flex: 3 }]}>
              <View style={s.cardHeader} nativeID="tutorial-today-exercises">
                <Text style={s.cardTitle}>Ejercicios de Hoy</Text>
                <View style={s.completedBadge}>
                  <Ionicons name="calendar-outline" size={13} color={C.gray400} />
                  <Text style={s.completedText}>
                    {completedToday}/{exercises.length} completados
                  </Text>
                </View>
              </View>
              <View style={s.exerciseGrid}>
                {exercises.map((ex) => (
                  <View
                    key={ex.id}
                    style={[s.exCard, ex.completed && s.exCardDone]}
                    nativeID={ex.name.includes('Sentadilla') ? 'tutorial-exercise-card' : undefined}
                  >
                    <View style={s.exCardTop}>
                      <View style={[s.muscleBadge, ex.completed && s.muscleBadgeDone]}>
                        <Text style={[s.muscleText, ex.completed && s.muscleTextDone]}>
                          {ex.muscle}
                        </Text>
                      </View>
                      {ex.completed && (
                        <Ionicons name="checkmark-circle" size={18} color={C.turquoise} />
                      )}
                    </View>
                    <Text style={s.exName}>{ex.name}</Text>
                    <View style={s.exStats}>
                      <View style={s.exStat}>
                        <Text style={s.exStatVal}>{ex.reps}</Text>
                        <Text style={s.exStatLabel}>reps</Text>
                      </View>
                      <View style={s.exStatDiv} />
                      <View style={s.exStat}>
                        <Text style={s.exStatVal}>{ex.series}</Text>
                        <Text style={s.exStatLabel}>series</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={s.startBtn}
                      onPress={() => startExercise(ex)}
                      activeOpacity={0.85}
                      {...({ nativeID: 'tutorial-camara' } as any)}
                    >
                      <Ionicons name="videocam-outline" size={14} color={C.white} />
                      <Text style={s.startBtnText}>Iniciar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.exBtn, ex.completed && s.exBtnDone]}
                      onPress={() => toggleExercise(ex.id)}
                      activeOpacity={0.75}
                      {...({ nativeID: ex.name.includes('Sentadilla') ? 'tutorial-mark-done' : undefined } as any)}
                    >
                      <Ionicons
                        name={ex.completed ? 'checkmark-circle' : 'ellipse-outline'}
                        size={15}
                        color={ex.completed ? C.turquoise : C.gray400}
                      />
                      <Text style={[s.exBtnText, ex.completed && s.exBtnTextDone]}>
                        {ex.completed ? 'Completado' : 'Marcar listo'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Progreso semanal + Médico */}
            <View style={[s.card, { flex: 2, gap: 20 }]}>
              <Text style={s.cardTitle}>Progreso Semanal</Text>
              <View style={s.weeklyMain}>
                <View style={s.weeklyNumbers}>
                  <Text style={s.weeklyBig}>{completedWeekly}</Text>
                  <Text style={s.weeklyOf}>/ {totalWeekly}</Text>
                </View>
                <Text style={s.weeklyLabel}>ejercicios completados</Text>
              </View>
              <View>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${weeklyPercent}%` as any }]} />
                </View>
                <Text style={s.progressPct}>{weeklyPercent}% del objetivo</Text>
              </View>
              <Text style={s.progressMsg}>
                ¡Excelente trabajo! Estás en camino de completar tu rutina semanal.
              </Text>
              <View style={s.doctorCard} nativeID="tutorial-doctor">
                <View style={s.doctorAvatar}>
                  <Ionicons name="person-outline" size={16} color={C.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.doctorLabel}>Tu kinesiólogo</Text>
                  <Text style={s.doctorName}>Lic. Ignacio Ghiggi</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Próximos ejercicios */}
          <View style={s.card} nativeID="tutorial-upcoming">
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>Próximos Ejercicios</Text>
              <TouchableOpacity
                style={s.calendarBtn}
                onPress={goToCalendar}
                activeOpacity={0.7}
                {...({ nativeID: 'tutorial-ver-rutina' } as any)}
              >
                <Ionicons name="calendar-outline" size={14} color={C.turquoise} />
                <Text style={s.calendarBtnText}>Ver rutina completa</Text>
              </TouchableOpacity>
            </View>
            <View style={s.upcomingGrid}>
              {UPCOMING.map((u) => (
                <View key={u.id} style={s.upcomingCard}>
                  <View style={s.upcomingDay}>
                    <Text style={s.upcomingDayText}>{u.day}</Text>
                  </View>
                  <Text style={s.upcomingName}>{u.name}</Text>
                  <Text style={s.upcomingMuscle}>{u.muscle}</Text>
                  <Text style={s.upcomingDetail}>{u.series} series × {u.reps} reps</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: C.bg },
  main: { flex: 1 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 36, paddingTop: 32, paddingBottom: 20, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  greeting: { color: C.navy, fontSize: 26, fontWeight: '800' },
  date: { color: C.gray400, fontSize: 13, marginTop: 3 },
  progressPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.turquoiseBg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  progressPillText: { color: C.navy, fontSize: 13, fontWeight: '500' },
  content: { padding: 36, gap: 20 },
  row: { flexDirection: 'row', gap: 20 },
  card: { backgroundColor: C.white, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: C.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  cardTitle: { color: C.navy, fontSize: 17, fontWeight: '700' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.bg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  completedText: { color: C.gray400, fontSize: 12 },
  exerciseGrid: { flexDirection: 'row', gap: 14 },
  exCard: { flex: 1, backgroundColor: C.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border, gap: 8 },
  exCardDone: { borderColor: C.turquoise, backgroundColor: '#F0FAF9' },
  exCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  muscleBadge: { backgroundColor: C.turquoiseBg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  muscleBadgeDone: { backgroundColor: C.turquoiseBg },
  muscleText: { color: C.turquoise, fontSize: 11, fontWeight: '600' },
  muscleTextDone: {},
  exName: { color: C.navy, fontSize: 15, fontWeight: '700' },
  exStats: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  exStat: { flex: 1, alignItems: 'center' },
  exStatVal: { color: C.navy, fontSize: 26, fontWeight: '800' },
  exStatLabel: { color: C.gray400, fontSize: 11 },
  exStatDiv: { width: 1, height: 32, backgroundColor: C.border },
  exBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10, paddingVertical: 10, backgroundColor: C.gray100, borderWidth: 1, borderColor: C.border },
  exBtnDone: { backgroundColor: C.turquoiseBg, borderColor: C.turquoise },
  exBtnText: { color: C.gray500, fontSize: 12, fontWeight: '500' },
  exBtnTextDone: { color: C.turquoise },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.turquoise, borderRadius: 10, paddingVertical: 10 },
  startBtnText: { color: C.white, fontSize: 13, fontWeight: '700' },
  weeklyMain: { alignItems: 'center', paddingVertical: 8 },
  weeklyNumbers: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  weeklyBig: { color: C.navy, fontSize: 52, fontWeight: '800', lineHeight: 56 },
  weeklyOf: { color: C.gray200, fontSize: 30, fontWeight: '300', marginBottom: 6 },
  weeklyLabel: { color: C.gray400, fontSize: 13, marginTop: 4 },
  progressBg: { height: 8, backgroundColor: C.gray100, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: C.turquoise, borderRadius: 4 },
  progressPct: { color: C.gray400, fontSize: 12, marginTop: 6 },
  progressMsg: { color: C.gray500, fontSize: 13, lineHeight: 20 },
  doctorCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.turquoiseBg, borderRadius: 12, padding: 14 },
  doctorAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.turquoise, alignItems: 'center', justifyContent: 'center' },
  doctorLabel: { color: C.gray400, fontSize: 11 },
  doctorName: { color: C.navy, fontSize: 13, fontWeight: '700', marginTop: 1 },
  calendarBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: C.turquoise, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  calendarBtnText: { color: C.turquoise, fontSize: 13, fontWeight: '600' },
  upcomingGrid: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  upcomingCard: { backgroundColor: C.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border, minWidth: 180, flex: 1 },
  upcomingDay: { backgroundColor: C.turquoiseBg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8 },
  upcomingDayText: { color: C.turquoise, fontSize: 11, fontWeight: '700' },
  upcomingName: { color: C.navy, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  upcomingMuscle: { color: C.gray400, fontSize: 12, marginBottom: 2 },
  upcomingDetail: { color: C.gray400, fontSize: 12 },
});