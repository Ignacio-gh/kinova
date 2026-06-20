import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseCard, type Exercise } from '@/components/kinesiologo/exercise-card';
import { useBiblioteca, CATEGORY_FILTERS } from '@/hooks/use-biblioteca';
import { useMisPacientes } from '@/hooks/use-mis-pacientes';
import { api } from '@/services/api';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_TO_ENGLISH: Record<string, string> = {
  Lunes: 'monday', Martes: 'tuesday', Miércoles: 'wednesday',
  Jueves: 'thursday', Viernes: 'friday', Sábado: 'saturday', Domingo: 'sunday',
};

export default function BibliotecaEjercicios() {
  // --- Hooks y Datos ---
  const { search, setSearch, filter, setFilter, filtered } = useBiblioteca();
  const { filtered: allPatients, loading: patientsLoading } = useMisPacientes();
  const activePatients = allPatients.filter((p) => p.status === 'Activo');

  // --- Estados del Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [assignError, setAssignError] = useState('');
  const [assignSaving, setAssignSaving] = useState(false);

  // --- Estados del Formulario ---
  const [patientId, setPatientId] = useState('');
  const [day, setDay] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('15');
  const [minAngle, setMinAngle] = useState('');
  const [maxAngle, setMaxAngle] = useState('');

  // --- Estados de los Dropdowns Personalizados ---
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);

  // --- Funciones ---
  const handleOpenAssign = (ex: Exercise) => {
    setSelectedExercise(ex);
    // Reiniciamos valores por defecto al abrir
    setPatientId('');
    setDay('');
    setSets('3');
    setReps('15');
    setMinAngle('');
    setMaxAngle('');
    setAssignError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
    setIsPatientDropdownOpen(false);
    setIsDayDropdownOpen(false);
  };

  const handleSave = async () => {
    setAssignError('');
    if (!patientId || !day) {
      setAssignError('Seleccioná un paciente y un día.');
      return;
    }
    setAssignSaving(true);
    try {
      await api.post('/api/v1/routines/', {
        patient_id: Number(patientId),
        exercise_id: Number(selectedExercise!.id),
        day_of_week: DAY_TO_ENGLISH[day],
        sets: Number(sets) || 3,
        reps: Number(reps) || 15,
        angle_min: minAngle ? Number(minAngle) : null,
        angle_max: maxAngle ? Number(maxAngle) : null,
      });
      handleCloseModal();
    } catch (e: any) {
      setAssignError(e.message ?? 'Error al asignar ejercicio.');
    } finally {
      setAssignSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>
          Biblioteca de Ejercicios
        </Text>
        <Text className="text-gray-400 text-sm mt-0.5">
          Catálogo de ejercicios de tren inferior para rehabilitación
        </Text>
      </View>

      {/* Buscador */}
      <View className="px-5 pb-3">
        <View
          className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200"
          style={{ height: 46 }}
        >
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm"
            style={{ color: '#002B49' }}
            placeholder="Buscar por nombre o músculo objetivo..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros de categoría */}
      <View className="pb-4">
        <FlatList
          data={CATEGORY_FILTERS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => {
            const active = filter === item;
            return (
              <TouchableOpacity
                className="rounded-xl px-4 items-center justify-center"
                style={{
                  height: 36,
                  backgroundColor: active ? '#00A896' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: active ? '#00A896' : '#E5E7EB',
                }}
                onPress={() => setFilter(item)}
                activeOpacity={0.7}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: active ? '#FFFFFF' : '#6B7280' }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Lista de ejercicios */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onAdd={() => handleOpenAssign(item)} />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="barbell-outline" size={52} color="#D1D5DB" />
            <Text className="text-gray-400 text-base mt-3 font-medium">
              No se encontraron ejercicios
            </Text>
          </View>
        }
      />

      {/* --- Modal de Asignación --- */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center px-4" style={{ backgroundColor: 'rgba(0, 43, 73, 0.6)' }}>
          <View className="bg-white rounded-3xl overflow-hidden shadow-xl w-full">
            
            {/* Modal Header */}
            <View className="flex-row justify-between items-start px-5 py-4 border-b border-gray-100 bg-gray-50">
              <View className="flex-1 pr-4">
                <Text className="text-xl font-extrabold" style={{ color: '#002B49' }}>Asignar Ejercicio</Text>
                <Text className="text-sm font-semibold mt-1" style={{ color: '#00A896' }}>{selectedExercise?.name}</Text>
              </View>
              <TouchableOpacity onPress={handleCloseModal} hitSlop={10}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <View className="px-5 pt-5 pb-2">
              
              {/* Paciente */}
              <View className="mb-4" style={{ zIndex: 2 }}>
                <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">PACIENTE (ACTIVOS)</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-12"
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsPatientDropdownOpen(!isPatientDropdownOpen);
                    setIsDayDropdownOpen(false);
                  }}
                >
                  <Text className="text-sm" style={{ color: patientId ? '#002B49' : '#9CA3AF' }}>
                    {patientsLoading
                      ? 'Cargando pacientes...'
                      : patientId
                        ? activePatients.find(p => p.id === patientId)?.name
                        : activePatients.length === 0
                          ? 'Sin pacientes activos'
                          : 'Seleccionar paciente...'}
                  </Text>
                  <Ionicons name={isPatientDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
                </TouchableOpacity>

                {isPatientDropdownOpen && !patientsLoading && (
                  <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg" style={{ zIndex: 10 }}>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                      {activePatients.length === 0 ? (
                        <Text className="text-sm text-gray-400 p-4">No hay pacientes activos</Text>
                      ) : activePatients.map(p => (
                        <TouchableOpacity 
                          key={p.id} 
                          className="px-4 py-3 border-b border-gray-100"
                          onPress={() => {
                            setPatientId(p.id);
                            setIsPatientDropdownOpen(false);
                          }}
                        >
                          <Text className="text-sm text-navy">{p.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Día */}
              <View className="mb-4" style={{ zIndex: 1 }}>
                <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">DÍA DE LA SEMANA</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-12"
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsDayDropdownOpen(!isDayDropdownOpen);
                    setIsPatientDropdownOpen(false);
                  }}
                >
                  <Text className="text-sm" style={{ color: day ? '#002B49' : '#9CA3AF' }}>
                    {day || 'Seleccionar día...'}
                  </Text>
                  <Ionicons name={isDayDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
                </TouchableOpacity>

                {isDayDropdownOpen && (
                  <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg" style={{ zIndex: 10 }}>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                      {DAYS.map(d => (
                        <TouchableOpacity 
                          key={d} 
                          className="px-4 py-3 border-b border-gray-100"
                          onPress={() => {
                            setDay(d);
                            setIsDayDropdownOpen(false);
                          }}
                        >
                          <Text className="text-sm text-navy">{d}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Series y Repeticiones */}
              <View className="flex-row mb-4 gap-3">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">SERIES</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-navy"
                    keyboardType="numeric"
                    value={sets}
                    onChangeText={setSets}
                    placeholder="Ej: 3"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">REPETICIONES</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-navy"
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                    placeholder="Ej: 15"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Rango Angular */}
              <View className="flex-row mb-4 gap-3">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">ÁNGULO MIN (°)</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-navy"
                    keyboardType="numeric"
                    value={minAngle}
                    onChangeText={setMinAngle}
                    placeholder="Vacío o '-'"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">ÁNGULO MAX (°)</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-navy"
                    keyboardType="numeric"
                    value={maxAngle}
                    onChangeText={setMaxAngle}
                    placeholder="Vacío o '-'"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
            </View>

            {/* Modal Footer (Errores y Botones) */}
            <View className="px-5 pb-5">
              {!!assignError && (
                <View className="flex-row items-center bg-red-50 border border-red-200 rounded-xl p-3 mb-4 gap-2">
                  <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                  <Text className="text-red-600 text-xs flex-1 font-medium">{assignError}</Text>
                </View>
              )}
              
              <View className="flex-row justify-end gap-3">
                <TouchableOpacity 
                  className="px-5 py-3 rounded-xl border border-gray-200"
                  activeOpacity={0.7} 
                  onPress={handleCloseModal}
                >
                  <Text className="text-gray-500 font-semibold text-sm">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`px-6 py-3 rounded-xl items-center justify-center ${assignSaving ? 'opacity-70' : ''}`}
                  style={{ backgroundColor: '#00A896' }}
                  activeOpacity={0.7} 
                  onPress={handleSave} 
                  disabled={assignSaving}
                >
                  <Text className="text-white font-semibold text-sm">
                    {assignSaving ? 'Guardando...' : 'Asignar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}