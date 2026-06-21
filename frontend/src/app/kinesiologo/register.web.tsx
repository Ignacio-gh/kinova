import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKinesiologoRegister } from '@/hooks/use-kinesiologo-register';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobileRegister from './register.tsx';

const C = {
  navy: '#0A1628',
  turquoise: '#00A896',
  turquoiseDim: 'rgba(0,168,150,0.12)',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  navyText: '#002B49',
  inputBorder: '#E5E7EB',
};

const BENEFITS = [
  'Monitoreo de ejercicios con cámara e IA',
  'Reportes automáticos de adherencia',
  'Biblioteca de ejercicios especializados',
  'Comunicación directa con pacientes',
];

export default function KinesiologoRegisterWeb() {
  const isMobile = useIsMobileBrowser();
  const {
    name, setName,
    email, setEmail,
    matricula, setMatricula,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading, error,
    handleRegister,
    goBack,
    goToLogin,
  } = useKinesiologoRegister();

  if (isMobile) return <MobileRegister />;

  return (
    <View style={s.root}>
      {/* Lado izquierdo */}
      <View style={s.left}>
        <View pointerEvents="none" style={s.decoLayer}>
          <View style={[s.circle, { width: 450, height: 450, right: -100, top: -40, opacity: 0.05 }]} />
          <View style={[s.circle, { width: 260, height: 260, left: -50, bottom: 60, opacity: 0.04 }]} />
        </View>

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

        <View style={s.leftContent}>
          <View style={s.badge}>
            <Text style={s.badgeText}>Nuevo en Kinova</Text>
          </View>
          <Text style={s.heading}>Sumáte a la red de kinesiólogos de vanguardia</Text>
          <Text style={s.description}>
            Creá tu cuenta gratuita y comenzá a gestionar la rehabilitación de tus pacientes
            con el apoyo de la inteligencia artificial.
          </Text>
          <View style={s.benefits}>
            {BENEFITS.map((b) => (
              <View key={b} style={s.benefitRow}>
                <View style={s.checkWrap}>
                  <Ionicons name="checkmark" size={14} color={C.turquoise} />
                </View>
                <Text style={s.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.leftFooter}>
          <View style={s.dot} />
          <Text style={s.securityText}>Encriptación de nivel médico · ISO 27001</Text>
        </View>
      </View>

      {/* Lado derecho — formulario */}
      <View style={s.right}>
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.card}>
            <Text style={s.cardTitle}>Crear cuenta</Text>
            <Text style={s.cardSub}>Completá tus datos para comenzar</Text>

            {/* Nombre */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Nombre completo</Text>
              <View style={s.inputWrap}>
                <Ionicons name="person-outline" size={18} color={C.gray400} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Dr. Juan Pérez"
                  placeholderTextColor={C.gray400}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Correo electrónico</Text>
              <View style={s.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={C.gray400} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="tu@email.com"
                  placeholderTextColor={C.gray400}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Matrícula */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Matrícula profesional</Text>
              <View style={s.inputWrap}>
                <Ionicons name="id-card-outline" size={18} color={C.gray400} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="MN-12345"
                  placeholderTextColor={C.gray400}
                  value={matricula}
                  onChangeText={setMatricula}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Row: contraseñas en 2 columnas */}
            <View style={s.row2}>
              <View style={[s.fieldGroup, { flex: 1 }]}>
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
              <View style={[s.fieldGroup, { flex: 1 }]}>
                <Text style={s.fieldLabel}>Confirmar contraseña</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={18} color={C.gray400} style={s.inputIcon} />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor={C.gray400}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            {!!error && (
              <View style={s.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={s.btn}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={s.btnText}>{loading ? 'Registrando...' : 'Crear cuenta gratuita'}</Text>
              {!loading && <Ionicons name="arrow-forward" size={18} color={C.white} />}
            </TouchableOpacity>

            <Text style={s.terms}>
              Al registrarte, aceptás nuestros{' '}
              <Text style={s.termLink}>Términos de Servicio</Text>
              {' '}y{' '}
              <Text style={s.termLink}>Política de Privacidad</Text>
            </Text>

            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>¿Ya tenés cuenta?</Text>
              <View style={s.dividerLine} />
            </View>

            <TouchableOpacity style={s.loginBtn} onPress={goToLogin} activeOpacity={0.7}>
              <Text style={s.loginBtnText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any },
  left: { flex: 1, backgroundColor: C.navy, padding: 48, justifyContent: 'space-between' },
  decoLayer: { position: 'absolute', inset: 0, overflow: 'hidden' },
  circle: { position: 'absolute', borderRadius: 9999, backgroundColor: C.turquoise },
  leftHeader: { gap: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  backText: { color: C.gray400, fontSize: 14 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: {
    width: 38, height: 38, borderRadius: 19,
    borderWidth: 2, borderColor: C.turquoise,
    alignItems: 'center', justifyContent: 'center',
  },
  logoLetter: { color: C.turquoise, fontWeight: '700', fontSize: 18 },
  logoText: { color: C.white, fontSize: 22, fontWeight: '700' },
  leftContent: { flex: 1, justifyContent: 'center', paddingVertical: 40 },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1, borderColor: C.turquoise,
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 20,
  },
  badgeText: { color: C.turquoise, fontSize: 12, fontWeight: '500' },
  heading: { color: C.white, fontSize: 38, fontWeight: '800', lineHeight: 48, marginBottom: 16 },
  description: { color: '#94A3B8', fontSize: 15, lineHeight: 24, marginBottom: 28 },
  benefits: { gap: 12 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkWrap: {
    width: 26, height: 26, borderRadius: 6,
    backgroundColor: C.turquoiseDim,
    alignItems: 'center', justifyContent: 'center',
  },
  benefitText: { color: '#CBD5E1', fontSize: 14 },
  leftFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.turquoise },
  securityText: { color: C.gray400, fontSize: 12 },
  right: { width: 520, backgroundColor: C.gray100, justifyContent: 'center' },
  scrollContent: { padding: 48, alignItems: 'center' },
  card: {
    width: '100%', maxWidth: 420,
    backgroundColor: C.white, borderRadius: 24, padding: 36,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 24,
  },
  cardTitle: { color: C.navyText, fontSize: 26, fontWeight: '800', marginBottom: 4 },
  cardSub: { color: C.gray400, fontSize: 14, marginBottom: 24 },
  row2: { flexDirection: 'row', gap: 12 },
  fieldGroup: { marginBottom: 14, gap: 6 },
  fieldLabel: { color: C.navyText, fontSize: 13, fontWeight: '600' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: C.inputBorder,
    borderRadius: 12, height: 48, paddingHorizontal: 14,
    backgroundColor: C.white,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: C.navyText, outlineStyle: 'none' as any },
  btn: {
    backgroundColor: C.turquoise, borderRadius: 12, height: 50,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 8,
  },
  btnText: { color: C.white, fontSize: 15, fontWeight: '700' },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
    borderRadius: 10, padding: 12, marginBottom: 12,
  },
  errorText: { color: '#DC2626', fontSize: 13, flex: 1 },
  terms: { color: C.gray400, fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 20 },
  termLink: { color: C.turquoise, fontWeight: '500' },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.gray200 },
  dividerText: { color: C.gray400, fontSize: 13 },
  loginBtn: {
    borderWidth: 1.5, borderColor: C.turquoise,
    borderRadius: 12, height: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  loginBtnText: { color: C.turquoise, fontSize: 15, fontWeight: '600' },
});
