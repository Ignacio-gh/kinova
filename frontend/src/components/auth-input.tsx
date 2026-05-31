import { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = TextInputProps & {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  isPassword?: boolean;
};

export function AuthInput({ iconName, isPassword = false, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      className="flex-row items-center border border-gray-200 rounded-xl px-4 bg-gray-50"
      style={{ height: 52 }}
    >
      <Ionicons name={iconName} size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
      <TextInput
        className="flex-1 text-base"
        style={{ color: '#002B49' }}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={isPassword && !showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
