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
import { useKinesiologoLogin } from '@/hooks/use-kinesiologo-login';

export default function KinesiologoLogin() {
  const { email, setEmail, password, setPassword, loading, handleLogin, goBack, goToRegister } =
    useKinesiologoLogin();

  return (
    <SafeAreaView className="flex-1 bg-navy">
      <StatusBar style="light" />

      {/* Círculos decorativos */}
      <View className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <View
          className="absolute rounded-full bg-turquoise"
          style={{ width: 300, height: 300, right: -80, top: '15%', opacity: 0.06 }}
        />
        <View
          className="absolute rounded-full bg-turquoise"
          style={{ width: 180, height: 180, left: -50, bottom: '20%', opacity: 0.05 }}
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Volver al inicio */}
          <TouchableOpacity
            className="flex-row items-center px-5 pt-2 pb-4"
            onPress={goBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={16} color="white" />
            <Text className="text-white text-sm ml-2">Volver al inicio</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View className="items-center mb-6">
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <View className="w-9 h-9 rounded-full border-2 border-turquoise items-center justify-center">
                <Text className="text-turquoise font-bold">K</Text>
              </View>
              <Text className="text-white text-2xl font-bold">Kinova</Text>
            </View>
            <Text className="text-gray-400 text-sm mt-1">Portal Kinesiólogo</Text>
          </View>

          {/* Card */}
          <View
            className="mx-5 bg-white rounded-3xl p-6"
            style={{
              elevation: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 14,
            }}
          >
            <View className="items-center mb-5">
              <View className="w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center">
                <Ionicons name="lock-closed-outline" size={28} color="#6B7280" />
              </View>
            </View>

            <Text className="text-navy text-2xl font-bold text-center mb-1">Soy Kinesiólogo</Text>
            <Text className="text-gray-400 text-sm text-center mb-6">Portal profesional</Text>

            <View style={{ gap: 12 }}>
              <AuthInput
                iconName="mail-outline"
                placeholder="kinesiologo@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <AuthInput
                iconName="lock-closed-outline"
                placeholder="Contraseña"
                isPassword
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              className="bg-turquoise rounded-xl items-center justify-center mt-6"
              style={{ height: 52 }}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-center mt-4">
              <Text className="text-gray-400 text-sm">¿No tenés cuenta? </Text>
              <TouchableOpacity onPress={goToRegister} activeOpacity={0.7}>
                <Text className="text-turquoise text-sm font-semibold">Registrate</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer seguridad */}
          <View className="items-center mt-8 mb-6 px-8">
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <View className="w-2 h-2 rounded-full bg-turquoise" />
              <Text className="text-white text-xs font-bold tracking-widest">SEGURO Y CONFIABLE</Text>
            </View>
            <Text className="text-gray-400 text-xs mt-1 text-center">
              Tus datos están protegidos con encriptación de nivel médico
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
