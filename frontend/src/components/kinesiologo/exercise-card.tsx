import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type Exercise = {
  id: string;
  name: string;
  category: 'Cadera' | 'Rodilla' | 'Muslo' | 'Tobillo';
  muscles: string[];
  description: string;
  benefits: string[];
};

type Props = {
  exercise: Exercise;
  onAdd?: () => void;
};

const CATEGORY_STYLE: Record<string, { bg: string; text: string }> = {
  Muslo:   { bg: '#e5f7f5', text: '#00A896' },
  Rodilla: { bg: '#EFF6FF', text: '#3B82F6' },
  Cadera:  { bg: '#FFF7ED', text: '#EA580C' },
  Tobillo: { bg: '#F3E8FF', text: '#9333EA' },
};

export function ExerciseCard({ exercise, onAdd }: Props) {
  const style = CATEGORY_STYLE[exercise.category] ?? CATEGORY_STYLE.Muslo;

  return (
    <View
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      }}
    >
      {/* Video placeholder */}
      <View
        className="items-center justify-center"
        style={{ height: 148, backgroundColor: '#e5f7f5' }}
      >
        <Ionicons name="barbell-outline" size={42} color="#00A896" />
        <Text className="text-xs mt-2" style={{ color: '#00A896' }}>
          Aca se ponen los videos
        </Text>
      </View>

      <View className="p-4">
        {/* Título + categoría */}
        <View className="flex-row items-start justify-between mb-3">
          <Text className="text-navy font-bold text-lg flex-1 mr-3">{exercise.name}</Text>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: style.bg }}>
            <Text className="text-xs font-semibold" style={{ color: style.text }}>
              {exercise.category}
            </Text>
          </View>
        </View>

        {/* Músculos objetivo */}
        <Text className="text-gray-500 text-xs font-semibold mb-2">Músculos Objetivo:</Text>
        <View className="flex-row flex-wrap mb-3" style={{ gap: 6 }}>
          {exercise.muscles.map((m) => (
            <View key={m} className="bg-gray-100 rounded-full px-2.5 py-1">
              <Text className="text-gray-600 text-xs">{m}</Text>
            </View>
          ))}
        </View>

        {/* Descripción */}
        <Text className="text-gray-500 text-sm leading-relaxed mb-3">
          {exercise.description}
        </Text>

        {/* Beneficios */}
        <Text className="text-gray-500 text-xs font-semibold mb-2">Beneficios:</Text>
        {exercise.benefits.map((b) => (
          <View key={b} className="flex-row items-start mb-1" style={{ gap: 6 }}>
            <Text style={{ color: '#00A896', fontSize: 12, marginTop: 2 }}>•</Text>
            <Text className="text-gray-500 text-sm flex-1">{b}</Text>
          </View>
        ))}

        {onAdd && (
          <TouchableOpacity
            className="bg-turquoise rounded-xl items-center justify-center mt-4"
            style={{ height: 46 }}
            onPress={onAdd}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white font-semibold text-sm">Agregar al plan</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
