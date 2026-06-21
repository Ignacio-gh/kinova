import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePacientePerfil } from '@/hooks/use-paciente-perfil';

type RowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

function Row({ icon, label, value, onPress, danger = false }: RowProps) {
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
      <Text className="flex-1 text-sm font-medium" style={{ color: danger ? '#EF4444' : '#002B49' }}>
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

export default function MiPerfilPaciente() {
  const { profile, handleLogout } = usePacientePerfil();
  const router = useRouter();

  const initials = profile?.full_name
    ?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'PA';

  const statusLabel = profile?.status === 'active' ? 'Tratamiento Activo' : 'Tratamiento Finalizado';
  const statusColor = profile?.status === 'active' ? '#00A896' : '#9CA3AF';
  const statusBg = profile?.status === 'active' ? '#e5f7f5' : '#F3F4F6';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-navy font-extrabold" style={{ fontSize: 26 }}>Mi Perfil</Text>
        </View>

        {/* Avatar */}
        <View className="items-center pb-8 px-5">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: '#e5f7f5' }}
          >
            <Text className="font-extrabold" style={{ fontSize: 32, color: '#00A896' }}>
              {initials}
            </Text>
          </View>
          <Text className="text-navy font-bold text-xl">
            {profile?.full_name ?? 'Cargando...'}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {profile?.email ?? '...'}
          </Text>
          <View
            className="flex-row items-center rounded-full px-3 py-1 mt-3"
            style={{ backgroundColor: statusBg }}
          >
            <View className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: statusColor }} />
            <Text className="text-xs font-semibold" style={{ color: statusColor }}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Información personal */}
        <View className="px-5 mb-2">
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
            Información personal
          </Text>
          <Row icon="person-outline" label="Nombre completo" value={profile?.full_name ?? '...'} />
          <Row icon="mail-outline" label="Correo" value={profile?.email ?? '...'} />
        </View>

        {/* Tratamiento */}
        <View className="px-5 mb-2 mt-4">
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
            Mi tratamiento
          </Text>
          <Row icon="medical-outline" label="Diagnóstico" value={profile?.diagnosis ?? '...'} />
          <Row icon="person-circle-outline" label="Kinesiólogo" value={profile?.kinesiologo_name ?? '...'} />
          <Row icon="calendar-outline" label="Duración" value={profile?.treatment_weeks ? `${profile.treatment_weeks} semanas` : '...'} />
          <Row icon="trending-up-outline" label="Semana actual" value={profile?.current_week ? `Semana ${profile.current_week}` : '...'} />
        </View>

        {/* Ajustes */}
        <View className="px-5 mb-2 mt-4">
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
            Ajustes
          </Text>
          <Row
            icon="help-circle-outline"
            label="Ayuda y soporte"
            onPress={() => router.push('/ayuda.mobile')}
          />
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
