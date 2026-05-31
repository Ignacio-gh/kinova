import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PatientCard } from '@/components/kinesiologo/patient-card';
import { useMisPacientes, FILTERS, FILTER_LABELS } from '@/hooks/use-mis-pacientes';

export default function MisPacientes() {
  const { search, setSearch, filter, setFilter, filtered, goToPatient } = useMisPacientes();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-start justify-between px-5 pt-4 pb-3">
        <View className="flex-1">
          <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>
            Mis Pacientes
          </Text>
          <Text className="text-gray-400 text-sm mt-0.5">
            Gestiona y monitorea el progreso de tus pacientes
          </Text>
        </View>
        <TouchableOpacity
          className="bg-turquoise rounded-xl px-4 items-center justify-center"
          style={{ height: 40, marginTop: 4 }}
          activeOpacity={0.8}
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
      <View className="flex-row px-5 pb-4" style={{ gap: 8 }}>
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
    </SafeAreaView>
  );
}
