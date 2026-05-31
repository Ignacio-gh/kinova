import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type Patient = {
  id: string;
  name: string;
  diagnosis: string;
  lastSession: string;
  email: string;
  adherence: number;
  status: 'Activo' | 'Finalizado';
  weeklyProgress: number;
  pendingReview: boolean;
};

type Props = {
  patient: Patient;
  onPress: () => void;
};

const adherenceColor = (v: number) =>
  v >= 90 ? '#16A34A' : v >= 70 ? '#00A896' : '#EF4444';

export function PatientCard({ patient, onPress }: Props) {
  const isActive = patient.status === 'Activo';

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3"
      style={{
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      }}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View className="flex-row items-start">
        {/* Avatar */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3 mt-0.5"
          style={{ backgroundColor: isActive ? '#e5f7f5' : '#F3F4F6' }}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={isActive ? '#00A896' : '#9CA3AF'}
          />
        </View>

        {/* Info central */}
        <View className="flex-1">
          {/* Nombre + badge + indicador pendiente */}
          <View className="flex-row items-center flex-wrap" style={{ gap: 6 }}>
            <Text className="text-navy font-bold text-base">{patient.name}</Text>
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: isActive ? '#e5f7f5' : '#F3F4F6' }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: isActive ? '#00A896' : '#6B7280' }}
              >
                {patient.status}
              </Text>
            </View>
            {patient.pendingReview && (
              <View className="flex-row items-center" style={{ gap: 3 }}>
                <View className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <Text className="text-red-400 text-xs font-medium">Revisión pendiente</Text>
              </View>
            )}
          </View>

          <Text className="text-gray-500 text-sm mt-0.5">{patient.diagnosis}</Text>

          {/* Barra de progreso semanal */}
          <View className="mt-2.5">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 text-xs">Progreso semanal</Text>
              <Text className="text-xs font-semibold" style={{ color: '#00A896' }}>
                {patient.weeklyProgress}%
              </Text>
            </View>
            <View className="bg-gray-100 rounded-full" style={{ height: 4 }}>
              <View
                style={{
                  height: 4,
                  width: `${patient.weeklyProgress}%`,
                  backgroundColor: '#00A896',
                  borderRadius: 99,
                }}
              />
            </View>
          </View>

          <Text className="text-gray-400 text-xs mt-2">
            {patient.lastSession} · {patient.email}
          </Text>
        </View>

        {/* Adherencia */}
        <View className="items-end ml-3 mt-1">
          <Text
            className="font-extrabold"
            style={{ fontSize: 22, color: adherenceColor(patient.adherence) }}
          >
            {patient.adherence}%
          </Text>
          <Text className="text-gray-400 text-xs">Adherencia</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
