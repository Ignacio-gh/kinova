import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const C = {
  navy: '#0A1628',
  turquoise: '#00A896',
  turquoiseDim: 'rgba(0,168,150,0.15)',
  white: '#FFFFFF',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  separator: 'rgba(255,255,255,0.10)',
  cardBg: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.12)',
};

export default function ContactoWeb() {
  const router = useRouter();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [clinica, setClinica] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEnviar = () => {
    if (!nombre || !clinica || !email || !mensaje) {
      alert('Por favor, completá todos los campos para enviar el mensaje.');
      return;
    }
    console.log("Mensaje de Contacto B2B:", { nombre, clinica, email, mensaje });
    alert('¡Mensaje enviado con éxito! Nuestro equipo comercial se contactará pronto.');
    setNombre(''); setClinica(''); setEmail(''); setMensaje('');
  };

  return (
    <View style={s.root}>
      {/* Navbar */}
      <View style={s.navbar}>
        <TouchableOpacity style={s.navLogo} onPress={() => router.push('/')} activeOpacity={0.8}>
          <View style={s.navLogoCircle}>
            <Text style={s.navLogoLetter}>K</Text>
          </View>
          <Text style={s.navLogoText}>Kinova</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.gray400} />
          <Text style={s.backText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={s.container}>
          
          {/* Cabecera */}
          <View style={s.header}>
            <Text style={s.badge}>Contacto Institucional</Text>
            <Text style={s.title}>Llevá tu clínica al siguiente nivel</Text>
            <Text style={s.subtitle}>
              ¿Representás a un centro de salud o equipo de kinesiología? Escribinos para conocer nuestros planes corporativos y transformar la rehabilitación de tus pacientes con IA.
            </Text>
          </View>

          {/* Dos Columnas (Info + Formulario) */}
          <View style={s.contactGrid}>
            
            {/* Columna Izquierda: Información de Contacto */}
            <View style={s.infoCol}>
              <Text style={s.infoTitle}>Hablemos de alianzas</Text>
              <Text style={s.infoDesc}>
                Nuestro equipo de especialistas está listo para diseñar una propuesta a la medida del volumen de pacientes y profesionales de tu institución.
              </Text>
              
              <View style={s.infoList}>
                <View style={s.infoItem}>
                  <View style={s.iconWrap}>
                    <Ionicons name="mail-outline" size={20} color={C.turquoise} />
                  </View>
                  <View>
                    <Text style={s.infoLabel}>Email Comercial</Text>
                    <Text style={s.infoValue}>alianzas@kinova.com.ar</Text>
                  </View>
                </View>
                
                <View style={s.infoItem}>
                  <View style={s.iconWrap}>
                    <Ionicons name="call-outline" size={20} color={C.turquoise} />
                  </View>
                  <View>
                    <Text style={s.infoLabel}>Teléfono / WhatsApp</Text>
                    <Text style={s.infoValue}>+54 9 11 1234-5678</Text>
                  </View>
                </View>

                <View style={s.infoItem}>
                  <View style={s.iconWrap}>
                    <Ionicons name="location-outline" size={20} color={C.turquoise} />
                  </View>
                  <View>
                    <Text style={s.infoLabel}>Oficinas Centrales</Text>
                    <Text style={s.infoValue}>Buenos Aires, Argentina</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Columna Derecha: Formulario */}
            <View style={s.formCol}>
              <View style={s.formCard}>
                
                <View style={s.inputGroup}>
                  <Text style={s.label}>Nombre y Apellido</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Ej. Dr. Roberto Gómez"
                    placeholderTextColor={C.gray400}
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </View>

                <View style={s.inputGroup}>
                  <Text style={s.label}>Nombre de la Clínica / Hospital</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Ej. Centro de Rehabilitación Norte"
                    placeholderTextColor={C.gray400}
                    value={clinica}
                    onChangeText={setClinica}
                  />
                </View>

                <View style={s.inputGroup}>
                  <Text style={s.label}>Correo Institucional</Text>
                  <TextInput
                    style={s.input}
                    placeholder="direccion@tuclinica.com"
                    placeholderTextColor={C.gray400}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={s.inputGroup}>
                  <Text style={s.label}>¿Cómo podemos ayudarlos?</Text>
                  <TextInput
                    style={[s.input, s.textArea]}
                    placeholder="Contanos sobre tu equipo de profesionales y el volumen de pacientes..."
                    placeholderTextColor={C.gray400}
                    multiline
                    numberOfLines={4}
                    value={mensaje}
                    onChangeText={setMensaje}
                  />
                </View>

                <TouchableOpacity style={s.submitBtn} onPress={handleEnviar} activeOpacity={0.8}>
                  <Text style={s.submitBtnText}>Enviar Solicitud</Text>
                  <Ionicons name="paper-plane-outline" size={18} color={C.navy} />
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>© 2026 Kinova · Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.navy, minHeight: '100vh' as any },
  
  // Navbar
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 64, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: C.separator },
  navLogo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  navLogoCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: C.turquoise, alignItems: 'center', justifyContent: 'center' },
  navLogoLetter: { color: C.turquoise, fontWeight: '700', fontSize: 16 },
  navLogoText: { color: C.white, fontSize: 20, fontWeight: '700', letterSpacing: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: C.gray400, fontSize: 14, fontWeight: '600' },

  scrollContainer: { flex: 1 },
  container: { maxWidth: 1100, width: '100%', alignSelf: 'center', paddingHorizontal: 40, paddingBottom: 100 },
  
  // Cabecera
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 60 },
  badge: { color: C.turquoise, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 },
  title: { color: C.white, fontSize: 44, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  subtitle: { color: C.gray400, fontSize: 18, textAlign: 'center', maxWidth: 650, lineHeight: 28 },

  // Grid de Contacto
  contactGrid: { flexDirection: 'row', gap: 60, alignItems: 'flex-start' },

  // Info Column
  infoCol: { flex: 1, paddingTop: 20 },
  infoTitle: { color: C.white, fontSize: 28, fontWeight: '700', marginBottom: 16 },
  infoDesc: { color: C.gray300, fontSize: 16, lineHeight: 26, marginBottom: 40 },
  infoList: { gap: 28 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.cardBorder, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: C.gray400, fontSize: 13, marginBottom: 4 },
  infoValue: { color: C.white, fontSize: 16, fontWeight: '600' },

  // Form Column
  formCol: { flex: 1 },
  formCard: { backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.cardBorder, borderRadius: 24, padding: 40 },
  inputGroup: { marginBottom: 20 },
  label: { color: C.gray300, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 15,
    color: C.white,
    outlineStyle: 'none' as any,
  },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.turquoise, borderRadius: 12, height: 54, marginTop: 10 },
  submitBtnText: { color: C.navy, fontSize: 16, fontWeight: '800' },

  // Footer
  footer: { alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: C.separator },
  footerText: { color: C.gray400, fontSize: 13 },
});