# 🔐 Guía de Configuración de Google OAuth 2.0

Esta guía te ayudará a configurar Google OAuth 2.0 para CubitoChat.

## 📋 Prerequisitos

- Una cuenta de Google
- Acceso a [Google Cloud Console](https://console.cloud.google.com/)

## 🚀 Paso 1: Crear un Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos en la parte superior
3. Haz clic en **"Nuevo Proyecto"**
4. Asigna un nombre a tu proyecto (ej: "CubitoChat")
5. Haz clic en **"Crear"**

## 🔑 Paso 2: Habilitar la API de Google+

1. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca **"Google+ API"** o **"People API"**
3. Haz clic en la API y luego en **"Habilitar"**

## 🎫 Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"Crear credenciales"** > **"ID de cliente de OAuth"**
3. Si es tu primera vez, deberás configurar la **"Pantalla de consentimiento de OAuth"**:

### Configurar Pantalla de Consentimiento

1. Selecciona **"Externo"** (para pruebas) o **"Interno"** (si es para tu organización)
2. Completa los campos requeridos:
   - **Nombre de la aplicación**: CubitoChat
   - **Correo de asistencia al usuario**: Tu email
   - **Logotipo de la aplicación**: (Opcional)
   - **Dominios autorizados**: `localhost` (para desarrollo)
   - **Correo de contacto del desarrollador**: Tu email

3. En **"Permisos"**, agrega los scopes necesarios:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`

4. Haz clic en **"Guardar y continuar"**

### Crear ID de Cliente

1. Vuelve a **"Credenciales"** > **"Crear credenciales"** > **"ID de cliente de OAuth"**
2. Selecciona **"Aplicación web"** como tipo de aplicación
3. Asigna un nombre (ej: "CubitoChat Web Client")
4. Configura los **URIs de redireccionamiento autorizados**:
   ```
   http://localhost:4000/auth/google/callback
   ```
   
5. Configura los **Orígenes de JavaScript autorizados**:
   ```
   http://localhost:4000
   http://localhost:5173
   ```

6. Haz clic en **"Crear"**

## 📝 Paso 4: Guardar las Credenciales

Después de crear el ID de cliente, verás un modal con:
- **ID de cliente**: `934430844476-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`
- **Secreto del cliente**: `GOCSPX-xxxxxxxxxxxxxxxx`

**⚠️ IMPORTANTE**: Guarda estas credenciales de forma segura.

## ⚙️ Paso 5: Configurar el Backend

Edita el archivo `.env` en la carpeta `backend/`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_id_de_cliente_aqui
GOOGLE_CLIENT_SECRET=tu_secreto_de_cliente_aqui
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Otros valores necesarios
FRONTEND_URL=http://localhost:5173
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
```

## 🧪 Paso 6: Probar la Autenticación

1. Inicia el backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Inicia el frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Ve a `http://localhost:5173`

4. Haz clic en **"Iniciar sesión con Google"**

5. Deberías ser redirigido a la pantalla de Google para autorizar

6. Después de autorizar, deberías volver a la aplicación autenticado

## 🔄 Flujo de Autenticación

```
Usuario → Frontend → Backend → Google OAuth
                                    ↓
Usuario ← Frontend ← Backend ← Google (token)
```

1. **Usuario hace clic en "Login con Google"**
   - Frontend redirige a: `http://localhost:4000/auth/google`

2. **Backend redirige a Google**
   - Google muestra pantalla de consentimiento

3. **Usuario autoriza la aplicación**
   - Google redirige a: `http://localhost:4000/auth/google/callback?code=xxx`

4. **Backend procesa el callback**
   - Verifica el código con Google
   - Obtiene perfil del usuario
   - Busca o crea usuario en MongoDB
   - Genera JWT
   - Redirige al frontend: `http://localhost:5173/oauth-success?token=xxx`

5. **Frontend guarda el token**
   - Extrae token de la URL
   - Guarda en localStorage
   - Redirige al chat

## 🛡️ Seguridad para Producción

Cuando despliegues a producción:

1. **Actualiza las URLs en Google Cloud Console**:
   - URIs de redireccionamiento: `https://tudominio.com/auth/google/callback`
   - Orígenes autorizados: `https://tudominio.com`

2. **Actualiza el `.env` de producción**:
   ```env
   GOOGLE_CALLBACK_URL=https://tudominio.com/auth/google/callback
   FRONTEND_URL=https://tudominio.com
   ```

3. **Usa HTTPS** obligatoriamente

4. **Configura dominios autorizados** en la pantalla de consentimiento

5. **Publica tu app** (sal del modo de prueba en Google Cloud Console)

## ❓ Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que el `GOOGLE_CALLBACK_URL` en `.env` coincida exactamente con el URI registrado en Google Cloud Console

### Error: "invalid_client"
- Verifica que el `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos

### Error: "access_denied"
- El usuario canceló la autenticación o no tiene permisos

### No redirige después del login
- Verifica que `FRONTEND_URL` esté configurado correctamente
- Revisa los logs del backend

## 📚 Referencias

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google OAuth Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)

## 🎉 ¡Listo!

Ahora tu aplicación CubitoChat tiene autenticación completa con Google OAuth 2.0.

---

**Nota**: Para desarrollo, puedes usar el botón "Entrar como invitado" para probar sin configurar OAuth.

