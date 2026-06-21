import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWelcome } from '@/hooks/use-welcome';
import { Link, useRouter } from 'expo-router';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobileIndex from './index.tsx';

// Tokens de diseño — consistentes con la paleta de la ap
const C = {
  navy: '#0A1628',
  navyLight: '#0F2040',
  turquoise: '#00A896',
  turquoiseDim: 'rgba(0,168,150,0.15)',
  white: '#FFFFFF',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  separator: 'rgba(255,255,255,0.10)',
  cardBg: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.12)',
};

export default function IndexWeb() {
  const isMobile = useIsMobileBrowser();
  if (isMobile) return <MobileIndex />;

  const { goToPatient, goToKinesiologo, stats } = useWelcome();
  const router = useRouter();

  return (
    <View style={s.root}>
      {/* Círculos decorativos — posicionados para escritorio */}
      <View style={s.decoLayer} pointerEvents="none">
        <View style={[s.circle, { width: 600, height: 600, right: -120, top: -80, opacity: 0.05 }]} />
        <View style={[s.circle, { width: 350, height: 350, left: -80, bottom: -60, opacity: 0.04 }]} />
        <View style={[s.circle, { width: 200, height: 200, left: '40%', top: '30%', opacity: 0.03 }]} />
      </View>

      {/* Navbar */}
      <View style={s.navbar}>
        <View style={s.navLogo}>
          <View style={s.navLogoCircle}>
            <Text style={s.navLogoLetter}>K</Text>
          </View>
          <Text style={s.navLogoText}>Kinova</Text>
        </View>
        <View style={s.navLinks}>
          <Text style={s.navLink}>Inicio</Text>
          
          {/* NUEVO: Convertimos el texto en un botón */}
          <TouchableOpacity onPress={() => router.push('/caracteristicas')} activeOpacity={0.7}>
            <Text style={s.navLink}>Características</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/contacto')} activeOpacity={0.7}>
            <Text style={s.navLink}>Contacto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal — 2 columnas */}
      <View style={s.main}>
        {/* Columna izquierda: Hero */}
        <View style={s.hero}>
          <View style={s.badge}>
            <Text style={s.badgeText}>Rehabilitación con Inteligencia Artificial</Text>
          </View>

          <Text style={s.heading}>
            Tu kinesiólogo virtual que guía tu rehabilitación con IA
          </Text>

          <Text style={s.description}>
            Kinova utiliza visión por computadora e inteligencia artificial para monitorear tus
            ejercicios de rehabilitación en tiempo real, asegurando que cada movimiento sea
            correcto y efectivo.
          </Text>

          {/* Stats en fila */}
          <View style={s.statsRow}>
            {stats.map((stat, i) => (
              <View key={stat.value} style={s.statItem}>
                {i > 0 && <View style={s.statSeparator} />}
                <View style={s.statContent}>
                  <Text style={s.statValue}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Columna derecha: Cards de acción */}
        <View style={s.cards}>
          <Text style={s.cardsTitle}>¿Cómo querés ingresar?</Text>

          {/* Paciente */}
          <Link href="/paciente/login" style={{ textDecorationLine: 'none', display: 'flex' as any }}>
            <View style={s.cardPatient}>
              <View style={[s.cardIcon, { backgroundColor: C.turquoiseDim }]}>
                <Text style={s.cardEmoji}>🧑‍🦽</Text>
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardTitle}>Soy Paciente</Text>
                <Text style={s.cardSubtitle}>Accedé a tu plan de rehabilitación personalizado</Text>
              </View>
              <Text style={[s.cardArrow, { color: C.turquoise }]}>›</Text>
            </View>
          </Link>

          {/* Kinesiólogo */}
          <Link href="/kinesiologo/login" style={{ textDecorationLine: 'none', display: 'flex' as any }}>
            <View style={s.cardKine}>
              <View style={[s.cardIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Text style={s.cardEmoji}>👨‍⚕️</Text>
              </View>
              <View style={s.cardBody}>
                <Text style={[s.cardTitle, { color: C.white }]}>Soy Kinesiólogo</Text>
                <Text style={[s.cardSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>
                  Gestioná tus pacientes y sesiones
                </Text>
              </View>
              <Text style={[s.cardArrow, { color: C.white }]}>›</Text>
            </View>
          </Link>

          {/* Footer de seguridad */}
          <View style={s.securityNote}>
            <Text style={s.securityIcon}>🔒</Text>
            <Text style={s.securityText}>
              Tus datos están protegidos con encriptación de nivel médico
            </Text>
          </View>
        </View>
      </View>

      {/* Footer del sitio */}
      <View style={s.footer}>
        <Text style={s.footerText}>© 2026 Kinova · Todos los derechos reservados</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100vh' as any,
    backgroundColor: C.navy,
  },
  decoLayer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: C.turquoise,
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 64,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.separator,
  },
  navLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLogoLetter: {
    color: C.turquoise,
    fontWeight: '700',
    fontSize: 16,
  },
  navLogoText: {
    color: C.white,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 36,
  },
  navLink: {
    color: C.gray400,
    fontSize: 14,
    fontWeight: '500',
    cursor: 'pointer' as any,
  },

  // Main layout
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 64,
    paddingVertical: 60,
    gap: 80,
  },

  // Hero (columna izquierda)
  hero: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: C.turquoise,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  badgeText: {
    color: C.turquoise,
    fontSize: 12,
    fontWeight: '500',
  },
  heading: {
    color: C.white,
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 58,
    marginBottom: 20,
  },
  description: {
    color: C.gray300,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statSeparator: {
    width: 1,
    height: 52,
    backgroundColor: C.separator,
    marginHorizontal: 28,
  },
  statContent: {},
  statValue: {
    color: C.turquoise,
    fontSize: 36,
    fontWeight: '800',
  },
  statLabel: {
    color: C.gray400,
    fontSize: 12,
    marginTop: 4,
  },

  // Cards (columna derecha)
  cards: {
    width: 400,
    gap: 16,
  },
  cardsTitle: {
    color: C.gray300,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  cardPatient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    cursor: 'pointer' as any,
    width: '100%' as any,
    minHeight: 88,
  },
  cardKine: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.turquoise,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    cursor: 'pointer' as any,
    width: '100%' as any,
    minHeight: 88,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: C.white,
    fontSize: 17,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: C.gray400,
    fontSize: 13,
    marginTop: 3,
  },
  cardArrow: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '300',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  securityIcon: {
    fontSize: 14,
  },
  securityText: {
    color: C.gray400,
    fontSize: 12,
    flex: 1,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: C.separator,
  },
  footerText: {
    color: C.gray400,
    fontSize: 13,
  },
});
