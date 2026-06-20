import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// --- Sub-componente Simulado ---
function MockPatientCard({ patient }: { patient: any }) {
  const adherenceColor = patient.adherence >= 90 ? '#16A34A' : '#00A896';
  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between"
      style={{ borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 }}
      activeOpacity={1}
    >
      <View className="flex-1">
        <Text className="text-navy font-bold text-base mb-0.5">{patient.name}</Text>
        <Text className="text-gray-500 text-sm mb-2">{patient.diagnosis}</Text>
        <View className="bg-gray-100 rounded-full px-2.5 py-1 self-start">
          <Text className="text-xs font-semibold text-gray-500">{patient.status}</Text>
        </View>
      </View>
      <View className="items-end pl-2">
        <Text className="text-gray-400 text-xs mb-0.5">Adherencia</Text>
        <Text className="font-extrabold text-xl" style={{ color: adherenceColor }}>{patient.adherence}%</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MockKineIndex() {
  const [showModal, setShowModal] = useState(false);
  const FILTERS = ['Todos', 'Activos', 'Finalizados'];
  
  // Datos Falsos
  const mockPatients = [
    { id: '1', name: 'Carlos Mendoza', diagnosis: 'Rehabilitación LCA', status: 'Activo', adherence: 92 },
    { id: '2', name: 'María Silva', diagnosis: 'Esguince de Tobillo', status: 'Activo', adherence: 65 }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="flex-row items-start justify-between px-5 pt-4 pb-3">
        <View className="flex-1">
          <Text className="text-navy font-extrabold" style={{ fontSize: 26, color: '#002B49' }}>Mis Pacientes</Text>
          <Text className="text-gray-400 text-sm mt-0.5">Gestiona y monitorea el progreso de tus pacientes</Text>
        </View>
        <TouchableOpacity
          className="rounded-xl px-4 items-center justify-center"
          style={{ backgroundColor: '#00A896', height: 40, marginTop: 4 }}
          activeOpacity={1}
          onPress={() => setShowModal(true)} 
        >
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-semibold text-sm">Agregar</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="px-5 pb-3">
        <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200" style={{ height: 46 }}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput className="flex-1 text-sm text-navy" placeholder="Buscar por nombre o diagnóstico..." placeholderTextColor="#9CA3AF" editable={false} />
        </View>
      </View>

      <View className="flex-row px-5 pb-4 gap-2">
        {FILTERS.map((f, i) => (
          <View key={f} className="rounded-xl px-4 items-center justify-center" style={{ height: 36, backgroundColor: i === 0 ? '#00A896' : '#FFFFFF', borderWidth: 1, borderColor: i === 0 ? '#00A896' : '#E5E7EB' }}>
            <Text className="text-sm font-semibold" style={{ color: i === 0 ? '#FFFFFF' : '#6B7280' }}>{f}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={mockPatients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }}
        renderItem={({ item }) => <MockPatientCard patient={item} />}
      />

      {/* Modal Falso */}
      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 43, 73, 0.6)' }}>
          <View className="bg-white rounded-t-3xl overflow-hidden shadow-xl w-full h-3/4">
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50">
              <Text className="text-xl font-extrabold text-navy">Nuevo paciente</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
            </View>
            <View className="p-5 items-center justify-center flex-1">
               <Text className="text-gray-400">Formulario de creación simulado</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}