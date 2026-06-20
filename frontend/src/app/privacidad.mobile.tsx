import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacidadMobileScreen() {
  const router = useRouter();

  const secciones = [
    {
      titulo: "1. Datos que Recolectamos",
      contenido: "Recopilamos información necesaria para la gestión profesional y clínica: nombre completo, correo electrónico, matrícula profesional, diagnósticos de pacientes, semanas de tratamiento y estadísticas de adherencia a los ejercicios de rehabilitación."
    },
    {
      titulo: "2. Uso de la Cámara y Procesamiento de Video",
      contenido: "Kinova utiliza la cámara del dispositivo móvil únicamente para detectar los puntos clave del cuerpo y calcular los rangos de movimiento (ángulos mínimos y máximos). El procesamiento de imagen se realiza de forma segura y automatizada para devolver métricas de ejercicio. No se almacenan transmisiones de video continuo sin consentimiento explícito y bajo encriptación médica."
    },
    {
      titulo: "3. Almacenamiento y Seguridad de los Datos",
      contenido: "Todos los datos clínicos y perfiles de pacientes se encriptan tanto en tránsito como en reposo utilizando estándares de la industria de la salud. Implementamos medidas técnicas y organizativas para evitar el acceso no autorizado, alteración o pérdida de la información."
    },
    {
      titulo: "4. Compartición de Información",
      contenido: "No vendemos, alquilamos ni comercializamos datos personales o clínicos con terceros bajo ninguna circunstancia. La información del paciente solo es accesible por el kinesiólogo asignado que creó dicha ficha o aquel autorizado explícitamente en el sistema corporativo."
    },
    {
      titulo: "5. Derechos del Usuario (ARCO)",
      contenido: "Tenés derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales. Para ejercer estos derechos o dar de baja una matrícula del sistema, podés enviar una solicitud formal por correo electrónico a soporte@kinova.com.ar."
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl items-center justify-center mr-4"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#002B49" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold" style={{ color: '#002B49' }}>
          Política de Privacidad
        </Text>
      </View>

      {/* Contenido Legal */}
      <ScrollView 
        className="flex-1 px-5" 
        contentContainerStyle={{ paddingVertical: 24, paddingBottom: 50 }} 
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-6">
          ÚLTIMA ACTUALIZACIÓN: JUNIO 2026
        </Text>

        {secciones.map((sec, index) => (
          <View key={index} className="mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <Text className="font-bold text-base mb-2.5" style={{ color: '#002B49' }}>
              {sec.titulo}
            </Text>
            <Text className="text-gray-500 text-sm leading-6 text-justify">
              {sec.contenido}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}