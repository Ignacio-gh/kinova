# Cómo correr Kinova en el celu (red local)

Guía para probar la app en un dispositivo físico durante desarrollo.
Tanto el celu como la PC tienen que estar en la **misma WiFi**.

---

## 🔧 Preparación (solo la primera vez)

### 1. Instalar Expo Go en el celu

- **Android**: [Play Store → Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iPhone**: [App Store → Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### 2. Permitir Python en el firewall de Windows

Cuando levantes el backend por primera vez, Windows va a preguntar:

> "¿Permitir que Python acepte conexiones entrantes?"

Hay que marcar **"Redes privadas"** y darle **"Permitir acceso"**.

Si no apareció el popup o le dieron a "Cancelar", se puede arreglar después
desde `Panel de Control → Sistema y Seguridad → Firewall de Windows Defender
→ Permitir una aplicación a través del firewall`.

---

## ▶️ Cada vez que vayan a probar

### Terminal 1 — Backend

```powershell
cd backend
scripts\run_dev.bat
```

Esto levanta FastAPI en `0.0.0.0:8000`. El log debe mostrar:

```
Uvicorn running on http://0.0.0.0:8000
```

Si dice `127.0.0.1` en vez de `0.0.0.0`, el celu **NO** va a poder conectarse.

### Terminal 2 — Frontend (Expo)

```powershell
cd frontend
npx expo start
```

Esto abre una pantalla con un QR code grande y muestra una línea como:

```
Metro waiting on exp://192.168.1.XX:8081
```

Esa IP (`192.168.1.XX`) es la de la PC en la WiFi. La app la usa
automáticamente para conectarse al backend (ver `services/api.ts` y
`hooks/use-pose-websocket.ts` — ambos extraen el host de Expo Constants).

### Celu

1. Abrir **Expo Go**
2. Escanear el QR de la terminal
3. Esperar a que se descargue el bundle (la primera vez tarda 1-2 min)
4. La app abre directamente en la pantalla de login

---

## 🔍 Cómo verificar que funciona

### Test rápido del backend desde el celu

Abrir el **navegador del celu** y entrar a:

```
http://192.168.1.XX:8000/health
```

(reemplazar `XX` con la IP de la PC — la que apareció en el log de Expo)

Si ves `{"status":"ok"}`, el backend es alcanzable. ✅
Si tira "no se pudo conectar", revisar:

1. ¿Misma WiFi? (no datos móviles, no WiFi del vecino)
2. ¿El backend dice `0.0.0.0:8000`?
3. ¿Firewall de Windows permitió Python?

### Logs útiles

- **Backend**: la terminal donde corrés `run_dev.bat` muestra cada request HTTP y WebSocket
- **Frontend móvil**: en la terminal de `expo start` aparecen los `console.log` de la app, incluido `[PoseWS] conectando a ws://192.168.1.XX:8000/...`

---

## ⚠️ Cosas que pueden fallar

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| El QR no se escanea | Expo Go versión vieja | Actualizar desde Play/App Store |
| App carga pero login no funciona | Backend en `127.0.0.1` | Usar `run_dev.bat` (escucha en `0.0.0.0`) |
| Login OK pero `[PoseWS] error` | Firewall bloqueando WebSocket | Permitir Python en firewall, reintentar |
| Cámara funciona pero no detecta postura | Backend caído / WS no conectó | Mirar el badge: "Sin análisis" → WS muerto |
| Tarda mucho en cargar bundle | Primera vez, normal | Esperar; las próximas son cacheadas |

---

## 🌐 Próximo paso: producción

Cuando salgamos de la red local (sprint de la semana próxima):

- Deploy del backend en Railway o Render
- Dominio con HTTPS (Cloudflare DNS gratis)
- WebSockets sobre `wss://` (seguros)
- Build distribuible con EAS Build (APK / IPA)
- La variable `EXPO_PUBLIC_API_URL` en `.env` apunta al dominio en lugar de la IP local

Está todo preparado en el código — solo hay que cambiar la URL.
