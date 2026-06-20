import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TerminosMobileScreen() {
  const router = useRouter();

  const secciones = [
    {
      titulo: "1. Aceptación de los Términos",
      contenido: "Al crear una cuenta y utilizar la plataforma Kinova, aceptás cumplir y estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no deberás acceder ni utilizar nuestros servicios."
    },
    {
      titulo: "2. Descripción del Servicio",
      contenido: "Kinova es una plataforma de asistencia tecnológica para la rehabilitación física que utiliza la cámara del dispositivo e Inteligencia Artificial para el análisis biomecánico. La herramienta está diseñada exclusivamente para coadyuvar al profesional de la salud y no reemplaza el criterio clínico independiente del kinesiólogo."
    },
    {
      titulo: "3. Responsabilidad Profesional",
      contenido: "Como profesional registrado, sos el único responsable de la precisión de las rutinas asignadas, la interpretación de los datos angulares provistos por la IA y el seguimiento personalizado de cada paciente. Kinova no se responsabiliza por diagnósticos erróneos o lesiones derivadas de un mal uso de la guía analítica."
    },
    {
      titulo: "4. Uso de la Cuenta y Seguridad",
      contenido: "Sos responsable de mantener la confidencialidad de tus credenciales de acceso. Cualquier actividad realizada bajo tu cuenta será tu estricta responsabilidad. Notificá inmediatamente a soporte@kinova.com.ar si detectás un uso no autorizado de tu cuenta."
    },
    {
      titulo: "5. Modificaciones del Servicio",
      contenido: "Kinova se reserva el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento, incluyendo funciones del procesamiento de visión artificial, previo aviso a los usuarios dentro de los plazos legales."
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
          Términos de Servicio
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