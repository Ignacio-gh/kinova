import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ContactoMobile() {
  const router = useRouter();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [clinica, setClinica] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEnviar = () => {
    if (!nombre || !clinica || !email || !mensaje) {
      Alert.alert('Campos incompletos', 'Por favor, completá todos los campos para enviar el mensaje.');
      return;
    }
    console.log("Mensaje de Contacto B2B:", { nombre, clinica, email, mensaje });
    Alert.alert(
      '¡Mensaje enviado!', 
      'Nuestro equipo comercial se contactará pronto para armar una propuesta.'
    );
    setNombre(''); setClinica(''); setEmail(''); setMensaje('');
  };

  return (
    // Fondo azul oscuro institucional de Kinova
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0A1628' }}>
      <StatusBar style="light" />

      {/* Navbar Mobile */}
      <View className="flex-row items-center px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full border-2 items-center justify-center" style={{ borderColor: '#00A896' }}>
            <Text className="font-bold text-xs" style={{ color: '#00A896' }}>K</Text>
          </View>
          <Text className="text-white text-lg font-bold tracking-wide">Kinova</Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Cabecera */}
        <View className="items-start pt-8 pb-8">
          <Text className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#00A896' }}>
            Contacto Institucional
          </Text>
          <Text className="text-white text-3xl font-extrabold mb-4 leading-tight">
            Llevá tu clínica al siguiente nivel
          </Text>
          <Text className="text-gray-400 text-base leading-6">
            ¿Representás a un centro de salud o equipo de kinesiología? Escribinos para conocer nuestros planes corporativos y transformar la rehabilitación de tus pacientes con IA.
          </Text>
        </View>

        {/* Información de Contacto */}
        <View className="mb-10">
          <Text className="text-white text-xl font-bold mb-3">Hablemos de alianzas</Text>
          <Text className="text-gray-400 text-sm leading-5 mb-6">
            Nuestro equipo de especialistas está listo para diseñar una propuesta a la medida del volumen de pacientes y profesionales de tu institución.
          </Text>
          
          <View className="gap-5">
            {/* Email */}
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <Ionicons name="mail-outline" size={20} color="#00A896" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs mb-1">Email Comercial</Text>
                <Text className="text-white font-semibold text-sm">alianzas@kinova.com.ar</Text>
              </View>
            </View>
            
            {/* Teléfono */}
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <Ionicons name="call-outline" size={20} color="#00A896" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs mb-1">Teléfono / WhatsApp</Text>
                <Text className="text-white font-semibold text-sm">+54 9 11 1234-5678</Text>
              </View>
            </View>

            {/* Ubicación */}
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <Ionicons name="location-outline" size={20} color="#00A896" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs mb-1">Oficinas Centrales</Text>
                <Text className="text-white font-semibold text-sm">Buenos Aires, Argentina</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Formulario */}
        <View className="rounded-3xl p-6 border mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <Text className="text-white text-lg font-bold mb-6">Dejanos tu consulta</Text>

          <View className="mb-4">
            <Text className="text-gray-300 text-xs font-bold mb-2 ml-1">NOMBRE Y APELLIDO</Text>
            <TextInput
              className="rounded-xl px-4 h-12 text-white border"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="Ej. Dr. Roberto Gómez"
              placeholderTextColor="#9CA3AF"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-300 text-xs font-bold mb-2 ml-1">CLÍNICA O INSTITUCIÓN</Text>
            <TextInput
              className="rounded-xl px-4 h-12 text-white border"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="Ej. Centro de Rehabilitación Norte"
              placeholderTextColor="#9CA3AF"
              value={clinica}
              onChangeText={setClinica}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-300 text-xs font-bold mb-2 ml-1">CORREO INSTITUCIONAL</Text>
            <TextInput
              className="rounded-xl px-4 h-12 text-white border"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="direccion@tuclinica.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-300 text-xs font-bold mb-2 ml-1">¿CÓMO PODEMOS AYUDARLOS?</Text>
            <TextInput
              className="rounded-xl px-4 py-3 text-white border"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', height: 100, textAlignVertical: 'top' }}
              placeholder="Contanos sobre tu equipo y pacientes..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={mensaje}
              onChangeText={setMensaje}
            />
          </View>

          <TouchableOpacity 
            className="flex-row items-center justify-center gap-2 rounded-xl h-14"
            style={{ backgroundColor: '#00A896' }}
            onPress={handleEnviar} 
            activeOpacity={0.8}
          >
            <Text className="font-extrabold text-base" style={{ color: '#0A1628' }}>Enviar Solicitud</Text>
            <Ionicons name="paper-plane-outline" size={18} color="#0A1628" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center py-4">
          <Text className="text-gray-500 text-xs">© 2026 Kinova · Todos los derechos reservados</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}