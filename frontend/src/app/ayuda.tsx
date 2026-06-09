import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const C = {
  navy: '#0A1628',
  turquoise: '#00A896',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  border: '#E5E7EB',
};

export default function AyudaSoporteScreen() {
  const router = useRouter();

  const openTutorial = () => {
    // El tutorial existe solo en la app web (usa eventos del DOM)
    if (Platform.OS === 'web') {
      window.dispatchEvent(new Event('open-tutorial'));
    }
  };

  const faqs = [
    { q: "¿Cómo corrijo la calibración de la cámara?", a: "Asegurate de que la cámara esté a la altura de tus ojos y con buena iluminación. Podés reiniciar la calibración en el menú de ajustes." },
    { q: "¿Puedo exportar los reportes de mis pacientes?", a: "Sí, en el perfil de cada paciente encontrarás el botón 'Exportar PDF' en la esquina superior derecha." },
    { q: "¿Qué hago si el paciente no tiene conexión?", a: "La app guardará los datos localmente y sincronizará automáticamente cuando recupere la conexión a internet." },
    { q: "¿Cómo agrego un nuevo paciente?", a: "Desde la pantalla de 'Pacientes', presioná el botón '+ Nuevo' para completar la ficha con los datos." },
    { q: "¿Es necesario usar algún sensor especial?", a: "No, Kinova utiliza únicamente la cámara de tu dispositivo para realizar el análisis biomecánico mediante Inteligencia Artificial." },
    { q: "¿Están seguros los datos clínicos?", a: "Sí, todos los datos y reportes se encriptan de extremo a extremo cumpliendo con los estándares de privacidad en salud." },
  ];

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.title}>Ayuda y Soporte</Text>
      </View>

      <View style={s.content}>
        {/* Banner de Contacto */}
        <View style={s.banner}>
          <Text style={s.bannerTitle}>¿Necesitas asistencia técnica?</Text>
          <Text style={s.bannerDesc}>Estamos aquí para ayudarte. Contacta a nuestro equipo.</Text>
          {/* Redirige a la pantalla de contacto (asume que la ruta es '/contacto') */}
          <TouchableOpacity style={s.btn} onPress={() => router.push('/contacto')}>
            <Text style={s.btnText}>Contacto</Text>
          </TouchableOpacity>
        </View>

        {/* Banner de Tutorial */}
        <View style={s.tutorialBanner}>
          <View style={s.tutorialInfo}>
            <View style={s.tutorialIconWrap}>
              <Ionicons name="school-outline" size={24} color={C.turquoise} />
            </View>
            <View style={s.tutorialTextWrap}>
              <Text style={s.tutorialTitle}>¿Primera vez en Kinova?</Text>
              <Text style={s.tutorialDesc}>Aprende a usar la plataforma en minutos.</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={s.tutorialBtn} 
            onPress={openTutorial} // 2. Actualizá el evento onPress acá
          >
            <Text style={s.tutorialBtnText}>Iniciar Tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={s.sectionTitle}>PREGUNTAS FRECUENTES</Text>
        {faqs.map((item, index) => (
          <View key={index} style={s.faqItem}>
            <Text style={s.faqQuestion}>{item.q}</Text>
            <Text style={s.faqAnswer}>{item.a}</Text>
          </View>
        ))}

        {/* Contacto Alternativo */}
        <Text style={s.sectionTitle}>OTROS CANALES</Text>
        <TouchableOpacity style={s.supportOption}>
          <Ionicons name="mail-outline" size={20} color={C.turquoise} />
          <Text style={s.supportText}>soporte@kinova.com.ar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 16, backgroundColor: C.white },
  backBtn: { padding: 8, backgroundColor: C.gray100, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: '800', color: C.navy },
  content: { padding: 24, maxWidth: 800, alignSelf: 'center', width: '100%' },
  
  /* Banner Contacto */
  banner: { backgroundColor: C.navy, padding: 32, borderRadius: 24, marginBottom: 24 },
  bannerTitle: { color: C.white, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  bannerDesc: { color: C.gray400, fontSize: 14, marginBottom: 20 },
  btn: { backgroundColor: C.turquoise, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, alignSelf: 'flex-start' },
  btnText: { color: C.white, fontWeight: '700' },

  /* Banner Tutorial */
  tutorialBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: C.white, 
    padding: 24, 
    borderRadius: 24, 
    marginBottom: 32, 
    borderWidth: 1, 
    borderColor: C.border,
    flexWrap: 'wrap', 
    gap: 16 
  },
  tutorialInfo: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1, minWidth: 250 },
  tutorialIconWrap: { width: 48, height: 48, backgroundColor: 'rgba(0,168,150,0.1)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tutorialTextWrap: { flex: 1 },
  tutorialTitle: { color: C.navy, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  tutorialDesc: { color: C.gray500, fontSize: 14 },
  tutorialBtn: { backgroundColor: C.gray100, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  tutorialBtnText: { color: C.navy, fontWeight: '700' },

  /* FAQ & Secciones */
  sectionTitle: { fontSize: 12, fontWeight: '800', color: C.gray400, letterSpacing: 1, marginBottom: 16 },
  faqItem: { backgroundColor: C.white, padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  faqQuestion: { fontWeight: '700', color: C.navy, marginBottom: 4 },
  faqAnswer: { color: C.gray500, fontSize: 14, lineHeight: 20 },
  supportOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  supportText: { color: C.navy, fontWeight: '600' },
});