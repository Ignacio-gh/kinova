import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <-- 1. Importamos el router
import { usePerfilKine, PERFIL_AJUSTES } from '@/hooks/use-perfil-kine';

type SettingRowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

function SettingRow({ icon, label, value, onPress, danger = false }: SettingRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2"
      style={{ borderWidth: 1, borderColor: '#F3F4F6' }}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: danger ? '#FFF1F2' : '#e5f7f5' }}
      >
        <Ionicons name={icon} size={18} color={danger ? '#EF4444' : '#00A896'} />
      </View>
      <Text
        className="flex-1 text-sm font-medium"
        style={{ color: danger ? '#EF4444' : '#002B49' }}
      >
        {label}
      </Text>
      {value ? (
        <Text className="text-gray-400 text-sm">{value}</Text>
      ) : onPress && !danger ? (
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      ) : null}
    </TouchableOpacity>
  );
}

export default function MiPerfil() {
  const { handleLogout, perfilInfo, user } = usePerfilKine();
  const router = useRouter(); // <-- 2. Instanciamos el router

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>
            Mi Perfil
          </Text>
        </View>

        {/* Avatar + info */}
      <View className="items-center pb-8 px-5">
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: '#e5f7f5' }}
        >
          <Text className="font-extrabold" style={{ fontSize: 32, color: '#00A896' }}>
            {user?.full_name?.substring(0, 2).toUpperCase() ?? 'DR'}
          </Text>
        </View>
          <Text className="text-navy font-bold text-xl">
          {user?.full_name ?? 'Cargando...'}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          {user?.email ?? '...'}
        </Text>
          <View
            className="flex-row items-center rounded-full px-3 py-1 mt-3"
            style={{ backgroundColor: '#e5f7f5' }}
          >
            <View className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#00A896' }} />
            <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>
              Portal Profesional
            </Text>
          </View>
        </View>

        {/* Sección info */}
        <View className="px-5 mb-2">
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
            Información
          </Text>
          {(perfilInfo ?? []).map((item) => (
            <SettingRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </View>

        {/* Sección ajustes */}
        <View className="px-5 mb-2 mt-4">
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
            Ajustes
          </Text>
          {PERFIL_AJUSTES.map((item) => (
            <SettingRow 
              key={item.label} 
              icon={item.icon} 
              label={item.label} 
              onPress={() => {
                // Redirección al nuevo archivo ayuda.mobile
                if (item.label === 'Ayuda y soporte') {
                  router.push('/ayuda.mobile'); 
                }
              }} 
            />
          ))}
        </View>

        {/* Cerrar sesión */}
        <View className="px-5 mt-4">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl py-4"
            style={{ backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3' }}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="text-red-500 font-semibold text-base">Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}