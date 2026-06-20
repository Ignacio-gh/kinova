import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTutorial } from '@/context/TutorialContext';

export default function AyudaSoporteMobileScreen() {
  const router = useRouter();
const { startMobileTutorial } = useTutorial();

  const faqs = [
    { q: "¿Cómo corrijo la calibración de la cámara?", a: "Asegurate de que la cámara esté a la altura de tus ojos y con buena iluminación. Podés reiniciar la calibración en el menú de ajustes." },
    { q: "¿Puedo exportar los reportes de mis pacientes?", a: "Sí, en el perfil de cada paciente encontrarás el botón 'Exportar PDF' en la esquina superior derecha." },
    { q: "¿Qué hago si el paciente no tiene conexión?", a: "La app guardará los datos localmente y sincronizará automáticamente cuando recupere la conexión a internet." },
    { q: "¿Cómo agrego un nuevo paciente?", a: "Desde la pantalla de 'Pacientes', presioná el botón '+ Nuevo' para completar la ficha con los datos." },
    { q: "¿Es necesario usar algún sensor especial?", a: "No, Kinova utiliza únicamente la cámara de tu dispositivo para realizar el análisis biomecánico mediante Inteligencia Artificial." },
    { q: "¿Están seguros los datos clínicos?", a: "Sí, todos los datos y reportes se encriptan de extremo a extremo cumpliendo con los estándares de privacidad en salud." },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header Mobile */}
      <View className="flex-row items-center px-5 pt-4 pb-4">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 bg-white border border-gray-200 rounded-xl items-center justify-center mr-4"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#002B49" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold" style={{ color: '#002B49' }}>
          Ayuda y Soporte
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-5" 
        contentContainerStyle={{ paddingBottom: 40 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de Contacto */}
        <View className="p-6 rounded-3xl mb-6 mt-2" style={{ backgroundColor: '#002B49' }}>
          <Text className="text-white text-xl font-bold mb-2">¿Necesitas asistencia técnica?</Text>
          <Text className="text-gray-300 text-sm mb-5 leading-5">Estamos aquí para ayudarte. Contacta a nuestro equipo.</Text>
          <TouchableOpacity 
            className="self-start px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#00A896' }}
            onPress={() => router.push('/contacto.mobile')}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-sm">Contacto</Text>
          </TouchableOpacity>
        </View>

        {/* Banner Informativo */}
        <TouchableOpacity 
          className="bg-white p-5 rounded-3xl mb-8 border border-gray-200"
          activeOpacity={0.7}
          onPress={() => {
           
            startMobileTutorial('inicio');
            router.push('/tutorialkine/mock-index-mobile-kine' as never);
          }}
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: '#e5f7f5' }}>
              <Ionicons name="school-outline" size={24} color="#00A896" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold" style={{ color: '#002B49' }}>¿Primera vez en Kinova?</Text>
              <Text className="text-gray-500 text-sm mt-0.5">Explorá las guías y secciones para comenzar a trabajar.</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* FAQ Section */}
        <Text className="text-xs font-bold text-gray-400 tracking-wider mb-3 ml-1">PREGUNTAS FRECUENTES</Text>
        {faqs.map((item, index) => (
          <View key={index} className="bg-white p-5 rounded-2xl mb-3 border border-gray-200">
            <Text className="font-bold text-sm mb-2" style={{ color: '#002B49' }}>{item.q}</Text>
            <Text className="text-gray-500 text-sm leading-5">{item.a}</Text>
          </View>
        ))}

        {/* Contacto Alternativo */}
        <Text className="text-xs font-bold text-gray-400 tracking-wider mb-3 mt-5 ml-1">OTROS CANALES</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-white p-5 rounded-2xl border border-gray-200"
          activeOpacity={0.7}
        >
          <Ionicons name="mail-outline" size={20} color="#00A896" style={{ marginRight: 12 }} />
          <Text className="font-semibold text-sm" style={{ color: '#002B49' }}>soporte@kinova.com.ar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}