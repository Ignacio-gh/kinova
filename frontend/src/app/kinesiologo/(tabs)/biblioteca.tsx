import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseCard } from '@/components/kinesiologo/exercise-card';
import { useBiblioteca, CATEGORY_FILTERS } from '@/hooks/use-biblioteca';

export default function BibliotecaEjercicios() {
  const { search, setSearch, filter, setFilter, filtered } = useBiblioteca();

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
          <ExerciseCard exercise={item} onAdd={() => {}} />
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
    </SafeAreaView>
  );
}
