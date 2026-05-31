import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '@/components/auth-input';
import { useKinesiologoRegister } from '@/hooks/use-kinesiologo-register';

export default function KinesiologoRegister() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading,
    handleRegister,
    goBack,
    goToLogin,
  } = useKinesiologoRegister();

  return (
    <SafeAreaView className="flex-1 bg-navy">
      <StatusBar style="light" />

      <View className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <View
          className="absolute rounded-full bg-turquoise"
          style={{ width: 280, height: 280, right: -70, top: '8%', opacity: 0.06 }}
        />
        <View
          className="absolute rounded-full bg-turquoise"
          style={{ width: 200, height: 200, left: -60, bottom: '10%', opacity: 0.05 }}
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="bg-white rounded-3xl p-6"
            style={{
              elevation: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 14,
            }}
          >
            <TouchableOpacity
              className="flex-row items-center mb-5"
              onPress={goBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={16} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-2">Volver al inicio</Text>
            </TouchableOpacity>

            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full border-2 border-turquoise items-center justify-center">
                <Text className="text-turquoise font-bold text-2xl">K</Text>
              </View>
            </View>

            <Text className="text-navy text-3xl font-extrabold text-center mb-1">Crear Cuenta</Text>
            <Text className="text-gray-400 text-sm text-center mb-6">
              Comienza tu rehabilitación hoy
            </Text>

            <View style={{ gap: 16 }}>
              <View style={{ gap: 6 }}>
                <Text className="text-navy text-sm font-semibold">Nombre Completo</Text>
                <AuthInput
                  iconName="person-outline"
                  placeholder="Juan Pérez"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={{ gap: 6 }}>
                <Text className="text-navy text-sm font-semibold">Correo Electrónico</Text>
                <AuthInput
                  iconName="mail-outline"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={{ gap: 6 }}>
                <Text className="text-navy text-sm font-semibold">Contraseña</Text>
                <AuthInput
                  iconName="lock-closed-outline"
                  placeholder="••••••••"
                  isPassword
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <View style={{ gap: 6 }}>
                <Text className="text-navy text-sm font-semibold">Confirmar Contraseña</Text>
                <AuthInput
                  iconName="lock-closed-outline"
                  placeholder="••••••••"
                  isPassword
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <TouchableOpacity
              className="bg-turquoise rounded-xl items-center justify-center mt-6"
              style={{ height: 52 }}
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? 'Registrando...' : 'Registrarse'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-5" style={{ gap: 10 }}>
              <View className="flex-1 bg-gray-200" style={{ height: 1 }} />
              <Text className="text-gray-400 text-sm">o</Text>
              <View className="flex-1 bg-gray-200" style={{ height: 1 }} />
            </View>

            <View className="flex-row items-center justify-center">
              <Text className="text-gray-400 text-sm">¿Ya tenés una cuenta? </Text>
              <TouchableOpacity onPress={goToLogin} activeOpacity={0.7}>
                <Text className="text-turquoise text-sm font-semibold">Iniciar sesión</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-gray-400 text-xs text-center mt-5 leading-5">
              Al registrarte, aceptás nuestros{' '}
              <Text className="text-turquoise font-medium">Términos de Servicio</Text>
              {' '}y{' '}
              <Text className="text-turquoise font-medium">Política de Privacidad</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
