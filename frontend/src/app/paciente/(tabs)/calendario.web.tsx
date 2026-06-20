import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarPaciente } from '@/components/web/web-sidebar-paciente';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobileCalendario from './calendario.tsx';
import { useMiCalendario, DAYS } from '@/hooks/use-mi-calendario';
import { useTutorial } from '@/context/TutorialContext';
import MockCalendario from '@/mock/mock-calendario.web';

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
};

export default function MiCalendarioWeb() {
  const isMobile = useIsMobileBrowser();
  if (isMobile) return <MobileCalendario />;
  const { isTutorialActive } = useTutorial();
  if (isTutorialActive) {
    return <MockCalendario />;
  }

  const { selectedDay, setSelectedDay, completedIds, dayExercises, routine, toggleComplete } =
    useMiCalendario();

  return (
    <View style={s.root}>
      <WebSidebarPaciente />

      <View style={s.main}>
        {/* Topbar */}
        <View style={s.topbar}>
          <View>
            <Text style={s.pageTitle}>Mi Calendario Semanal</Text>
            <Text style={s.pageSub}>Visualizá y completá tus ejercicios asignados</Text>
          </View>
          {/* Médico asignado */}
          <View style={s.doctorBanner}>
            <View style={s.doctorAvatar}>
              <Ionicons name="person-outline" size={14} color={C.white} />
            </View>
            <Text style={s.doctorText}>Supervisado por tu <Text style={s.doctorName}>kinesiólogo</Text></Text>
          </View>
        </View>

        <View style={s.body}>
          {/* Selector de días — columna lateral */}
          <View style={s.daySelector}>
            <Text style={s.daySelectorTitle}>Semana actual</Text>
            {DAYS.map((day) => {
              const active = selectedDay === day;
              const hasEx = (routine[day] ?? []).length > 0;
              const allDone = hasEx && (routine[day] ?? []).every((e) => completedIds.has(e.id));
              return (
                <TouchableOpacity
                  key={day}
                  style={[s.dayBtn, active && s.dayBtnActive]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.dayLabel, active && s.dayLabelActive]}>{day}</Text>
                  {hasEx && (
                    <View
                      style={[
                        s.dayDot,
                        { backgroundColor: allDone ? C.green : C.turquoise },
                        active && { opacity: 0 },
                      ]}
                    />
                  )}
                  {!hasEx && (
                    <Text style={s.dayRest}>Descanso</Text>
                  )}
                  {hasEx && (
                    <Text style={[s.dayCount, active && s.dayCountActive]}>
                      {(routine[day] ?? []).length} ej.
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Ejercicios del día */}
          <ScrollView
            style={s.exercisesCol}
            contentContainerStyle={s.exercisesContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.dayHeading}>
              {selectedDay} — {dayExercises.length === 0 ? 'Día de descanso' : `${dayExercises.length} ejercicio${dayExercises.length !== 1 ? 's' : ''}`}
            </Text>

            {dayExercises.length === 0 ? (
              <View style={s.rest}>
                <Ionicons name="moon-outline" size={48} color={C.gray200} />
                <Text style={s.restTitle}>¡Día de descanso!</Text>
                <Text style={s.restSub}>Aprovechá para recuperarte. La constancia también incluye el descanso.</Text>
              </View>
            ) : (
              <View style={s.exGrid}>
                {dayExercises.map((ex) => {
                  const done = completedIds.has(ex.id);
                  return (
                    <View key={ex.id} style={[s.exCard, done && s.exCardDone]}>
                      {/* Badge músculo */}
                      <View style={s.exCardTop}>
                        <View style={s.muscleBadge}>
                          <Text style={s.muscleText}>{ex.muscle}</Text>
                        </View>
                        {done && <Ionicons name="checkmark-circle" size={20} color={C.turquoise} />}
                      </View>

                      <Text style={s.exName}>{ex.name}</Text>

                      {/* Series/reps/ángulo */}
                      <View style={s.exDetails}>
                        <View style={s.exDetail}>
                          <Text style={s.exDetailVal}>{ex.series}</Text>
                          <Text style={s.exDetailLabel}>series</Text>
                        </View>
                        <View style={s.exDetailDiv} />
                        <View style={s.exDetail}>
                          <Text style={s.exDetailVal}>{ex.reps}</Text>
                          <Text style={s.exDetailLabel}>reps</Text>
                        </View>
                        {ex.angle && (
                          <>
                            <View style={s.exDetailDiv} />
                            <View style={s.exDetail}>
                              <Text style={[s.exDetailVal, { fontSize: 15 }]}>{ex.angle}</Text>
                              <Text style={s.exDetailLabel}>ángulo</Text>
                            </View>
                          </>
                        )}
                      </View>

                      {/* Acciones */}
                      <View style={s.exActions}>
                        <TouchableOpacity style={s.videoBtn} activeOpacity={0.7}>
                          <Ionicons name="play-circle-outline" size={16} color={C.turquoise} />
                          <Text style={s.videoBtnText}>Video Demo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[s.doneBtn, done && s.doneBtnActive]}
                          onPress={() => toggleComplete(ex.id)}
                          activeOpacity={0.75}
                        >
                          <Ionicons
                            name={done ? 'checkmark-circle' : 'ellipse-outline'}
                            size={16}
                            color={done ? C.turquoise : C.gray400}
                          />
                          <Text style={[s.doneBtnText, done && s.doneBtnTextActive]}>
                            {done ? 'Completado' : 'Marcar Listo'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: C.bg },
  main: { flex: 1, flexDirection: 'column', overflow: 'hidden' },
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 36, paddingTop: 32, paddingBottom: 20,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  pageTitle: { color: C.navy, fontSize: 26, fontWeight: '800' },
  pageSub: { color: C.gray400, fontSize: 13, marginTop: 3 },
  doctorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.turquoiseBg, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  doctorAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.turquoise,
    alignItems: 'center', justifyContent: 'center',
  },
  doctorText: { color: C.gray500, fontSize: 13 },
  doctorName: { color: C.turquoise, fontWeight: '700' },

  body: { flex: 1, flexDirection: 'row' },

  daySelector: {
    width: 180, backgroundColor: C.white,
    borderRightWidth: 1, borderRightColor: C.border,
    padding: 20, gap: 4,
  },
  daySelectorTitle: {
    color: C.gray400, fontSize: 10, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
  },
  dayBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 10, gap: 8,
  },
  dayBtnActive: { backgroundColor: C.turquoise },
  dayLabel: { color: C.navy, fontSize: 14, fontWeight: '600', flex: 1 },
  dayLabelActive: { color: C.white },
  dayDot: { width: 7, height: 7, borderRadius: 4 },
  dayCount: { color: C.gray400, fontSize: 11 },
  dayCountActive: { color: 'rgba(255,255,255,0.7)' },
  dayRest: { color: C.gray400, fontSize: 11 },

  exercisesCol: { flex: 1 },
  exercisesContent: { padding: 28 },
  dayHeading: { color: C.navy, fontSize: 20, fontWeight: '700', marginBottom: 20 },
  rest: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  restTitle: { color: C.navy, fontSize: 18, fontWeight: '700' },
  restSub: { color: C.gray400, fontSize: 14, textAlign: 'center', maxWidth: 320, lineHeight: 22 },

  exGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  exCard: {
    backgroundColor: C.white, borderRadius: 16, padding: 20,
    minWidth: 260, flex: 1,
    borderWidth: 1, borderColor: C.border,
    gap: 12,
  },
  exCardDone: { borderColor: C.turquoise, backgroundColor: '#F0FAF9' },
  exCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  muscleBadge: {
    backgroundColor: C.turquoiseBg, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  muscleText: { color: C.turquoise, fontSize: 11, fontWeight: '600' },
  exName: { color: C.navy, fontSize: 17, fontWeight: '700' },
  exDetails: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 10, padding: 12 },
  exDetail: { flex: 1, alignItems: 'center' },
  exDetailVal: { color: C.navy, fontSize: 22, fontWeight: '800' },
  exDetailLabel: { color: C.gray400, fontSize: 11, marginTop: 2 },
  exDetailDiv: { width: 1, height: 28, backgroundColor: C.border },
  exActions: { flexDirection: 'row', gap: 10 },
  videoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: C.turquoise,
    borderRadius: 10, paddingVertical: 10,
  },
  videoBtnText: { color: C.turquoise, fontSize: 13, fontWeight: '600' },
  doneBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: C.gray100, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingVertical: 10,
  },
  doneBtnActive: { backgroundColor: C.turquoiseBg, borderColor: C.turquoise },
  doneBtnText: { color: C.gray500, fontSize: 13, fontWeight: '500' },
  doneBtnTextActive: { color: C.turquoise },
});
