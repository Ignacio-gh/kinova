import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

function MockExerciseCard({ exercise, onAdd }: any) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 flex-row items-center" style={{ borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 }}>
      <View className="flex-1 pr-4">
        <Text className="text-navy font-bold text-base mb-1">{exercise.name}</Text>
        <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>{exercise.description}</Text>
        <View className="bg-turquoise-light rounded-full px-3 py-1 self-start" style={{ backgroundColor: '#e5f7f5' }}>
          <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>{exercise.zone}</Text>
        </View>
      </View>
      <TouchableOpacity className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: '#00A896' }} onPress={onAdd} activeOpacity={1}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default function MockBiblioteca() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const CATEGORY_FILTERS = ['Todos', 'Cuádriceps', 'Isquiotibiales', 'Gemelos'];
  
  const mockExercises = [
    { id: '1', name: 'Sentadilla Asistida', description: 'Flexión de rodillas con apoyo frontal.', zone: 'Cuádriceps' },
    { id: '2', name: 'Elevación de Talones', description: 'Elevación en bipedestación.', zone: 'Gemelos' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <View className="px-5 pt-4 pb-3">
        <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>Biblioteca de Ejercicios</Text>
        <Text className="text-gray-400 text-sm mt-0.5">Catálogo de ejercicios de tren inferior</Text>
      </View>

      <View className="px-5 pb-3">
        <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200" style={{ height: 46 }}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput className="flex-1 text-sm text-navy" placeholder="Buscar por nombre..." placeholderTextColor="#9CA3AF" editable={false} />
        </View>
      </View>

      <View className="pb-4">
        <FlatList
          data={CATEGORY_FILTERS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item, index }) => (
            <View className="rounded-xl px-4 items-center justify-center" style={{ height: 36, backgroundColor: index === 0 ? '#00A896' : '#FFFFFF', borderWidth: 1, borderColor: index === 0 ? '#00A896' : '#E5E7EB' }}>
              <Text className="text-sm font-semibold" style={{ color: index === 0 ? '#FFFFFF' : '#6B7280' }}>{item}</Text>
            </View>
          )}
        />
      </View>

      <FlatList
        data={mockExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }}
        renderItem={({ item }) => <MockExerciseCard exercise={item} onAdd={() => setIsModalOpen(true)} />}
      />

      <Modal visible={isModalOpen} transparent animationType="fade">
        <View className="flex-1 justify-center px-4" style={{ backgroundColor: 'rgba(0, 43, 73, 0.6)' }}>
          <View className="bg-white rounded-3xl overflow-hidden shadow-xl w-full h-2/3">
             <View className="flex-row justify-between items-start px-5 py-4 border-b border-gray-100 bg-gray-50">
              <View className="flex-1 pr-4">
                <Text className="text-xl font-extrabold text-navy">Asignar Ejercicio</Text>
                <Text className="text-sm font-semibold mt-1" style={{ color: '#00A896' }}>Sentadilla Asistida</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
            </View>
            <View className="p-5 items-center justify-center flex-1">
               <Text className="text-gray-400 text-center">Modal de asignación simulado. Aquí el kinesiólogo elige el paciente, día, series y repeticiones.</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}