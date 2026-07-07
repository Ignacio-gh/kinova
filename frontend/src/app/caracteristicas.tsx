import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KinovaColors } from '@/constants/colors';

const C = {
  ...KinovaColors,
  navy: '#0A1628',
  turquoiseDim: 'rgba(0,168,150,0.15)',
  separator: 'rgba(255,255,255,0.10)',
  cardBg: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.12)',
};

const FEATURES = [
  {
    id: 1,
    title: 'Visión por Computadora (IA)',
    description: 'Kinova utiliza la cámara del dispositivo del paciente para trackear en tiempo real puntos articulares clave. Calcula ángulos de flexión, repeticiones completadas y postura, brindando correcciones al instante sin necesidad de hardware adicional.',
    icon: 'scan-outline',
  },
  {
    id: 2,
    title: 'Panel Kinesiólogo Centralizado',
    description: 'Gestioná todos tus pacientes desde un solo lugar. Asigná rutinas semanales, revisá notas médicas, controlá el estado de los tratamientos y medí el porcentaje de adherencia con gráficos claros y precisos.',
    icon: 'people-outline',
  },
  {
    id: 3,
    title: 'Biblioteca de Ejercicios Inteligente',
    description: 'Accedé a un catálogo completo de ejercicios de rehabilitación ordenados por grupo muscular. Asignalos con un clic configurando series, repeticiones y rangos articulares mínimos y máximos esperados.',
    icon: 'library-outline',
  },
];

export default function CaracteristicasWeb() {
  const router = useRouter();

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
        {/* Cabecera */}
        <View style={s.header}>
          <Text style={s.badge}>Descubrí el futuro</Text>
          <Text style={s.title}>Rehabilitación potenciada por IA</Text>
          <Text style={s.subtitle}>
            Conocé todas las herramientas que hacen de Kinova la plataforma definitiva para el seguimiento kinesiológico remoto.
          </Text>
        </View>

        {/* Lista de Características en Zig-Zag */}
        <View style={s.featuresContainer}>
          {FEATURES.map((feat, index) => {
            const isReverse = index % 2 !== 0;
            return (
              <View key={feat.id} style={[s.featureRow, isReverse && s.featureRowReverse]}>
                
                {/* Texto */}
                <View style={s.featureTextContainer}>
                  <View style={s.iconWrapper}>
                    <Ionicons name={feat.icon as any} size={28} color={C.turquoise} />
                  </View>
                  <Text style={s.featureTitle}>{feat.title}</Text>
                  <Text style={s.featureDescription}>{feat.description}</Text>
                </View>

                {/* "Imagen" / Gráfico */}
                <View style={s.featureImageContainer}>
                  <View style={s.mockImage}>
                    <Ionicons name={feat.icon as any} size={80} color="rgba(255,255,255,0.05)" />
                    <View style={s.mockBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={C.turquoise} />
                      <Text style={s.mockBadgeText}>Sistema Activo</Text>
                    </View>
                  </View>
                </View>

              </View>
            );
          })}
        </View>

        {/* Call to Action Final */}
        <View style={s.ctaSection}>
          <Text style={s.ctaTitle}>¿Listo para empezar?</Text>
          {/* ACÁ ESTÁ LA CORRECCIÓN DE LA RUTA */}
          <TouchableOpacity style={s.ctaBtn} onPress={() => router.push('/kinesiologo/login')} activeOpacity={0.8}>
            <Text style={s.ctaBtnText}>Unite a Kinova</Text>
            <Ionicons name="arrow-forward" size={18} color={C.navy} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerText}>© 2026 Kinova · Todos los derechos reservados</Text>
      </View>
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
  
  // Cabecera
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 60, paddingHorizontal: 40 },
  badge: { color: C.turquoise, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 },
  title: { color: C.white, fontSize: 48, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  subtitle: { color: C.gray400, fontSize: 18, textAlign: 'center', maxWidth: 600, lineHeight: 28 },

  // Features (Zig-Zag)
  featuresContainer: { maxWidth: 1100, width: '100%', alignSelf: 'center', paddingHorizontal: 40, gap: 100, paddingBottom: 100 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 60 },
  featureRowReverse: { flexDirection: 'row-reverse' },
  
  featureTextContainer: { flex: 1 },
  iconWrapper: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.turquoiseDim, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  featureTitle: { color: C.white, fontSize: 32, fontWeight: '700', marginBottom: 16 },
  featureDescription: { color: C.gray300, fontSize: 16, lineHeight: 26 },

  featureImageContainer: { flex: 1 },
  mockImage: { backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.cardBorder, borderRadius: 24, height: 320, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mockBadge: { position: 'absolute', bottom: 24, right: 24, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99 },
  mockBadgeText: { color: C.white, fontSize: 13, fontWeight: '600' },

  // Call to Action
  ctaSection: { alignItems: 'center', paddingVertical: 80, backgroundColor: C.cardBg, borderTopWidth: 1, borderTopColor: C.cardBorder },
  ctaTitle: { color: C.white, fontSize: 32, fontWeight: '800', marginBottom: 32 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.turquoise, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 99 },
  ctaBtnText: { color: C.navy, fontSize: 16, fontWeight: '800' },

  // Footer
  footer: { alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: C.separator },
  footerText: { color: C.gray400, fontSize: 13 },
});