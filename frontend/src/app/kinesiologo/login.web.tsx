import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useKinesiologoLogin } from '@/hooks/use-kinesiologo-login';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobileLogin from './login.tsx';

const C = {
  navy: '#0A1628',
  navyMid: '#0F2040',
  turquoise: '#00A896',
  turquoiseDim: 'rgba(0,168,150,0.15)',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  navyText: '#002B49',
  separator: 'rgba(255,255,255,0.10)',
  inputBorder: '#E5E7EB',
};

const FEATURES = [
  { icon: 'eye-outline' as const, text: 'Monitoreo de ejercicios con IA en tiempo real' },
  { icon: 'people-outline' as const, text: 'Gestión completa de pacientes' },
  { icon: 'analytics-outline' as const, text: 'Reportes de progreso y adherencia' },
];

export default function KinesiologoLoginWeb() {
  const isMobile = useIsMobileBrowser();
  const { email, setEmail, password, setPassword, loading, error, handleLogin, goBack, goToRegister } =
    useKinesiologoLogin();

  if (isMobile) return <MobileLogin />;

  return (
    <View style={s.root}>
      {/* Lado izquierdo — branding */}
      <View style={s.left}>
        {/* Círculos deco */}
        <View pointerEvents="none" style={s.decoLayer}>
          <View style={[s.circle, { width: 500, height: 500, right: -120, top: -60, opacity: 0.05 }]} />
          <View style={[s.circle, { width: 280, height: 280, left: -60, bottom: 40, opacity: 0.04 }]} />
        </View>

        {/* Logo + back */}
        <View style={s.leftHeader}>
          <TouchableOpacity style={s.backBtn} onPress={goBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={16} color={C.gray400} />
            <Text style={s.backText}>Inicio</Text>
          </TouchableOpacity>
          <View style={s.logoRow}>
            <View style={s.logoCircle}>
              <Text style={s.logoLetter}>K</Text>
            </View>
            <Text style={s.logoText}>Kinova</Text>
          </View>
        </View>

        {/* Hero copy */}
        <View style={s.leftContent}>
          <View style={s.badge}>
            <Text style={s.badgeText}>Portal Profesional</Text>
          </View>
          <Text style={s.heading}>
            Guiá la rehabilitación de tus pacientes con IA
          </Text>
          <Text style={s.description}>
            Monitoreá ejercicios en tiempo real, gestioná tus pacientes y accedé a reportes
            detallados de progreso desde cualquier dispositivo.
          </Text>
          <View style={s.features}>
            {FEATURES.map((f) => (
              <View key={f.text} style={s.featureRow}>
                <View style={s.featureIcon}>
                  <Ionicons name={f.icon} size={16} color={C.turquoise} />
                </View>
                <Text style={s.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer izq */}
        <View style={s.leftFooter}>
          <View style={s.dot} />
          <Text style={s.securityText}>Encriptación de nivel médico · ISO 27001</Text>
        </View>
      </View>

      {/* Lado derecho — formulario */}
      <View style={s.right}>
        <View style={s.card}>
          <View style={s.cardIconWrap}>
            <Ionicons name="lock-closed-outline" size={28} color={C.gray500} />
          </View>

          <Text style={s.cardTitle}>Soy Kinesiólogo</Text>
          <Text style={s.cardSub}>Ingresá a tu portal profesional</Text>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Correo electrónico</Text>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={C.gray400} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="kinesiologo@email.com"
                placeholderTextColor={C.gray400}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Contraseña</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={C.gray400} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={C.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {!!error && (
            <View style={s.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            style={s.btn}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={s.btnText}>{loading ? 'Iniciando...' : 'Iniciar sesión'}</Text>
            {!loading && <Ionicons name="arrow-forward" size={18} color={C.white} />}
          </TouchableOpacity>

          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>o</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.registerRow}>
            <Text style={s.registerLabel}>¿No tenés cuenta?</Text>
            <Link href="/kinesiologo/register" style={{ textDecorationLine: 'none' }}>
              <Text style={s.registerLink}>Registrate aquí</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100vh' as any,
  },
  // Left
  left: {
    flex: 1,
    backgroundColor: C.navy,
    padding: 48,
    justifyContent: 'space-between',
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
  leftHeader: {
    gap: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    color: C.gray400,
    fontSize: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: C.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: C.turquoise,
    fontWeight: '700',
    fontSize: 18,
  },
  logoText: {
    color: C.white,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: C.turquoise,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 20,
  },
  badgeText: {
    color: C.turquoise,
    fontSize: 12,
    fontWeight: '500',
  },
  heading: {
    color: C.white,
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 50,
    marginBottom: 16,
  },
  description: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: C.turquoiseDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    color: '#CBD5E1',
    fontSize: 14,
    flex: 1,
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.turquoise,
  },
  securityText: {
    color: C.gray400,
    fontSize: 12,
  },
  // Right
  right: {
    width: 480,
    backgroundColor: C.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    color: C.navyText,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSub: {
    color: C.gray400,
    fontSize: 14,
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 16,
    gap: 6,
  },
  fieldLabel: {
    color: C.navyText,
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: C.white,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: C.navyText,
    outlineStyle: 'none' as any,
  },
  btn: {
    backgroundColor: C.turquoise,
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  btnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    flex: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.gray200,
  },
  dividerText: {
    color: C.gray400,
    fontSize: 13,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  registerLabel: {
    color: C.gray500,
    fontSize: 14,
  },
  registerLink: {
    color: C.turquoise,
    fontSize: 14,
    fontWeight: '600',
  },
});
