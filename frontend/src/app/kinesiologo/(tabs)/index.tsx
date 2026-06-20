import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PatientCard } from '@/components/kinesiologo/patient-card';
import { useMisPacientes, FILTERS, FILTER_LABELS } from '@/hooks/use-mis-pacientes';
import { api } from '@/services/api';
import { router } from 'expo-router';
import { useTutorial } from '@/context/TutorialContext';

const today = new Date().toISOString().split('T')[0];

export default function MisPacientes() {
  // Extraemos "refetch" también para actualizar la lista tras crear un paciente
  const { search, setSearch, filter, setFilter, filtered, goToPatient, refetch } = useMisPacientes();

  // <-- AGREGÁ ESTA LÍNEA AQUÍ -->
  const { startMobileTutorial } = useTutorial(); 

  // --- Estados del Modal y Formulario ---
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [createdPassword, setCreatedPassword] = useState('');
  const [createdEmail, setCreatedEmail] = useState('');
  
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', diagnosis: '',
    treatment_weeks: '12', treatment_start_date: today,
    phone: '', notes: '',
  });

  const setField = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const closeModal = () => {
    setShowModal(false);
    setCreatedPassword('');
    setCreatedEmail('');
    setFormError('');
    setForm({ 
      full_name: '', email: '', password: '', diagnosis: '', 
      treatment_weeks: '12', treatment_start_date: today, phone: '', notes: '' 
    });
  };

  const handleCreate = async () => {
    setFormError('');
    if (!form.full_name.trim() || !form.email.trim() || !form.diagnosis.trim()) {
      setFormError('Nombre, email y diagnóstico son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      const response: any = await api.post('/api/v1/patients', {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim() || undefined,
        diagnosis: form.diagnosis.trim(),
        treatment_weeks: Number(form.treatment_weeks) || 12,
        treatment_start_date: form.treatment_start_date || today,
        phone: form.phone.trim() || null,
        notes: form.notes.trim() || null,
      });
      setCreatedPassword(response.temp_password ?? form.password ?? '');
      setCreatedEmail(form.email.trim().toLowerCase());
      if (refetch) refetch(); // Actualiza la lista de pacientes
    } catch (e: any) {
      setFormError(e.message ?? 'Error al crear paciente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-start justify-between px-5 pt-4 pb-3">
        <View className="flex-1">
          <Text className="text-navy font-extrabold" style={{ fontSize: 26, color: '#002B49' }}>
            Mis Pacientes
          </Text>
          <Text className="text-gray-400 text-sm mt-0.5">
            Gestiona y monitorea el progreso de tus pacientes
          </Text>
        </View>
        <TouchableOpacity
          className="rounded-xl px-4 items-center justify-center"
          style={{ backgroundColor: '#00A896', height: 40, marginTop: 4 }}
          activeOpacity={0.8}
          onPress={() => setShowModal(true)} // <-- AQUÍ abrimos el Modal
        >
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-semibold text-sm">Agregar</Text>
          </View>
        </TouchableOpacity>
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
            placeholder="Buscar por nombre o diagnóstico..."
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

      {/* Filtros */}
      <View className="flex-row px-5 pb-4 gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <TouchableOpacity
              key={f}
              className="rounded-xl px-4 items-center justify-center"
              style={{
                height: 36,
                backgroundColor: active ? '#00A896' : '#FFFFFF',
                borderWidth: 1,
                borderColor: active ? '#00A896' : '#E5E7EB',
              }}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: active ? '#FFFFFF' : '#6B7280' }}
              >
                {FILTER_LABELS[f]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de pacientes */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }}
        renderItem={({ item }) => (
          <PatientCard patient={item} onPress={() => goToPatient(item.id)} />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="people-outline" size={52} color="#D1D5DB" />
            <Text className="text-gray-400 text-base mt-3 font-medium">
              No se encontraron pacientes
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* --- BOTÓN DEL TUTORIAL ACÁ (Fuera del Modal, en la pantalla principal) --- */}
      <TouchableOpacity 
        className="flex-row items-center justify-center mt-2 mb-8 mx-5 py-4 rounded-xl border border-dashed border-turquoise bg-white"
        onPress={() => {
          startMobileTutorial('kine_inicio'); 
          router.push('/tutorialkine/mock-index-mobile-kine' as never); 
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="school-outline" size={20} color="#00A896" style={{ marginRight: 8 }} />
        <Text className="text-turquoise font-semibold text-sm">
          ¿Primera vez? Mirá el tutorial para Kinesiólogos
        </Text>
      </TouchableOpacity>

      {/* --- Modal Crear Paciente --- */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 43, 73, 0.6)' }}>
          <View className="bg-white rounded-t-3xl overflow-hidden shadow-xl w-full" style={{ maxHeight: '90%' }}>
            
            {/* Modal Header */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50">
              <Text className="text-xl font-extrabold" style={{ color: '#002B49' }}>
                {createdPassword ? 'Paciente creado' : 'Nuevo paciente'}
              </Text>
              <TouchableOpacity onPress={closeModal} hitSlop={10}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
              {createdPassword ? (
                /* --- PANTALLA DE ÉXITO --- */
                <View className="items-center py-4">
                  <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
                    <Ionicons name="checkmark-circle" size={36} color="#16A34A" />
                  </View>
                  <Text className="text-gray-500 text-sm text-center mb-6">
                    Compartí estos datos con el paciente para que pueda ingresar a la app.
                  </Text>
                  
                  <View className="bg-gray-50 rounded-xl p-4 w-full mb-3 border border-gray-100 items-center">
                    <Text className="text-gray-400 text-xs font-bold tracking-wider mb-1">EMAIL DE ACCESO</Text>
                    <Text className="text-navy font-bold text-base" style={{ color: '#002B49' }}>{createdEmail}</Text>
                  </View>
                  
                  <View className="bg-gray-50 rounded-xl p-4 w-full mb-8 border border-gray-100 items-center">
                    <Text className="text-gray-400 text-xs font-bold tracking-wider mb-1">CONTRASEÑA DE ACCESO</Text>
                    <Text className="font-extrabold text-2xl tracking-widest" style={{ color: '#002B49' }}>{createdPassword}</Text>
                  </View>

                  <TouchableOpacity 
                    className="w-full py-4 rounded-xl items-center justify-center"
                    style={{ backgroundColor: '#00A896' }}
                    onPress={closeModal}
                  >
                    <Text className="text-white font-bold text-base">Entendido</Text>
                  </TouchableOpacity>
                </View>

              ) : (
                /* --- FORMULARIO --- */
                <View>
                  {/* Nombre y Email */}
                  <View className="mb-4">
                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">NOMBRE COMPLETO *</Text>
                    <TextInput
                      className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                      style={{ color: '#002B49' }}
                      placeholder="Juan Pérez"
                      placeholderTextColor="#9CA3AF"
                      value={form.full_name}
                      onChangeText={setField('full_name')}
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">EMAIL *</Text>
                    <TextInput
                      className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                      style={{ color: '#002B49' }}
                      placeholder="paciente@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={form.email}
                      onChangeText={setField('email')}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>

                  {/* Contraseña */}
                  <View className="mb-4">
                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">CONTRASEÑA (OPCIONAL)</Text>
                    <TextInput
                      className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                      style={{ color: '#002B49' }}
                      placeholder="Dejar vacío para generar automática"
                      placeholderTextColor="#9CA3AF"
                      value={form.password}
                      onChangeText={setField('password')}
                      secureTextEntry
                    />
                  </View>

                  {/* Diagnóstico */}
                  <View className="mb-4">
                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">DIAGNÓSTICO *</Text>
                    <TextInput
                      className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                      style={{ color: '#002B49' }}
                      placeholder="Lesión de rodilla..."
                      placeholderTextColor="#9CA3AF"
                      value={form.diagnosis}
                      onChangeText={setField('diagnosis')}
                    />
                  </View>

                  {/* Semanas y Fecha de inicio */}
                  <View className="flex-row mb-4 gap-3">
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">SEMANAS</Text>
                      <TextInput
                        className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                        style={{ color: '#002B49' }}
                        placeholder="12"
                        placeholderTextColor="#9CA3AF"
                        value={form.treatment_weeks}
                        onChangeText={setField('treatment_weeks')}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">INICIO</Text>
                      <TextInput
                        className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                        style={{ color: '#002B49' }}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9CA3AF"
                        value={form.treatment_start_date}
                        onChangeText={setField('treatment_start_date')}
                      />
                    </View>
                  </View>

                  {/* Teléfono y Notas */}
                  <View className="mb-4">
                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">TELÉFONO (OPCIONAL)</Text>
                    <TextInput
                      className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                      style={{ color: '#002B49' }}
                      placeholder="+54 11 1234-5678"
                      placeholderTextColor="#9CA3AF"
                      value={form.phone}
                      onChangeText={setField('phone')}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View className="mb-6">
                    <Text className="text-xs font-bold text-gray-500 tracking-wider mb-1.5">NOTAS (OPCIONAL)</Text>
                    <TextInput
                      className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
                      style={{ color: '#002B49' }}
                      placeholder="Antecedentes médicos..."
                      placeholderTextColor="#9CA3AF"
                      value={form.notes}
                      onChangeText={setField('notes')}
                    />
                  </View>

                  {/* Errores y Botones */}
                  {!!formError && (
                    <View className="flex-row items-center bg-red-50 border border-red-200 rounded-xl p-3 mb-4 gap-2">
                      <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                      <Text className="text-red-600 text-xs flex-1 font-medium">{formError}</Text>
                    </View>
                  )}
                  
                  <View className="flex-row justify-end gap-3 mt-2 pb-6">
                    <TouchableOpacity 
                      className="px-5 py-3.5 rounded-xl border border-gray-200 flex-1 items-center"
                      activeOpacity={0.7} 
                      onPress={closeModal}
                    >
                      <Text className="text-gray-500 font-semibold text-sm">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className={`px-6 py-3.5 rounded-xl flex-1 items-center justify-center ${saving ? 'opacity-70' : ''}`}
                      style={{ backgroundColor: '#00A896' }}
                      activeOpacity={0.7} 
                      onPress={handleCreate} 
                      disabled={saving}
                    >
                      <Text className="text-white font-semibold text-sm">
                        {saving ? 'Guardando...' : 'Crear paciente'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}