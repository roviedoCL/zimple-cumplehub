# 🚀 Deploy Completo en Render - Zimple CumpleHub

## ✅ Todo incluido: Frontend + Backend + Base de Datos PostgreSQL

---

## 📋 Pasos para Deploy

### 1️⃣ Preparar Repositorio en GitHub

Asegúrate de que tu código está en GitHub y actualizado:

```bash
git add .
git commit -m "Ready for Render deploy"
git push origin main
```

---

### 2️⃣ Crear cuenta en Render

1. Ve a **https://render.com**
2. Click en **"Get Started"**
3. Regístrate con tu cuenta de **GitHub**
4. Autoriza a Render para acceder a tu repositorio

---

### 3️⃣ Deploy usando Blueprint (Opción Recomendada)

**Ventaja:** Render creará automáticamente la base de datos y la aplicación con un solo click.

#### Pasos:

1. En el dashboard de Render, click en **"New"** → **"Blueprint"**
2. Selecciona tu repositorio: **"Zimple CumpleHub"**
3. Render detectará automáticamente el archivo `render.yaml`
4. Revisa la configuración:
   - ✅ **Web Service:** `zimple-cumplehub-app` (Docker)
   - ✅ **Database:** `zimple-cumplehub-db` (PostgreSQL Free)
5. Click en **"Apply"**

Render creará:
- 🗄️ Base de datos PostgreSQL (1GB gratis)
- 🐳 Aplicación Dockerizada (Frontend + Backend)
- 🔗 Variables de entorno automáticas

**Tiempo estimado:** 10-15 minutos

---

### 4️⃣ Deploy Manual (Alternativa)

Si prefieres crear los servicios uno por uno:

#### 4.1. Crear Base de Datos PostgreSQL

1. Click en **"New"** → **"PostgreSQL"**
2. Configuración:
   - **Name:** `zimple-cumplehub-db`
   - **Database:** `cumplehub`
   - **User:** `zimple`
   - **Region:** Oregon (US West) o el más cercano a ti
   - **Plan:** Free
3. Click en **"Create Database"**
4. Espera 2-3 minutos hasta que esté "Available"
5. **Copia el "Internal Connection String"** (lo necesitarás después)

#### 4.2. Crear Web Service con Docker

1. Click en **"New"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name:** `zimple-cumplehub-app`
   - **Region:** Oregon (US West) - **IMPORTANTE:** La misma región que la BD
   - **Branch:** `main`
   - **Runtime:** **Docker**
   - **Dockerfile Path:** `./Dockerfile`
   - **Docker Build Context Directory:** `.` (raíz del proyecto)
   - **Plan:** Free

#### 4.3. Variables de Entorno

En la sección **"Environment"**, agrega estas variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<pegar el Internal Connection String de la BD>
JWT_SECRET=<generar un string aleatorio largo>
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

**Para generar JWT_SECRET seguro:**
```bash
openssl rand -base64 32
```

#### 4.4. Deploy

1. Click en **"Create Web Service"**
2. Render comenzará a construir tu Docker image
3. Puedes ver los logs en tiempo real

**Tiempo estimado:** 10-15 minutos para el primer deploy

---

## 🔍 Verificar el Deploy

### Cuando termine el deploy:

1. **URL de tu app:** `https://zimple-cumplehub-app.onrender.com`
2. **Verificar health check:** `https://zimple-cumplehub-app.onrender.com/api/health`
   - Deberías ver: `{"status":"ok","timestamp":"..."}`
3. **API Docs:** `https://zimple-cumplehub-app.onrender.com/api`
4. **Frontend:** `https://zimple-cumplehub-app.onrender.com/`

---

## 🐛 Troubleshooting

### Problema: "Application failed to respond"

**Causa:** La aplicación no está escuchando correctamente.

**Solución:**
1. Ve a **"Logs"** en el dashboard de Render
2. Busca errores de conexión a la base de datos
3. Verifica que `DATABASE_URL` esté correcta
4. Asegúrate de que la base de datos esté en "Available"

### Problema: "Database connection refused"

**Causa:** Variables de entorno incorrectas o BD no lista.

**Solución:**
1. Ve a tu PostgreSQL database en Render
2. Copia el **"Internal Connection String"**
3. En el Web Service, ve a **"Environment"**
4. Actualiza `DATABASE_URL` con el string correcto
5. Render redesplegará automáticamente

### Problema: "Build failed"

**Causa:** Error en el Dockerfile o dependencias faltantes.

**Solución:**
1. Revisa los logs de build
2. Asegúrate de que `package.json` en frontend y backend estén correctos
3. Si hay errores de TypeScript, revisa `tsconfig.json`

### Problema: El servicio se duerme (plan Free)

**Comportamiento normal del plan gratuito:**
- El servicio se duerme después de 15 minutos de inactividad
- Tarda ~30 segundos en despertar
- Para evitarlo: Upgrade a plan pagado ($7/mes)

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

```bash
# Opción 1: Desde el dashboard de Render
Dashboard → Tu Web Service → Logs

# Opción 2: Render CLI (opcional)
npm install -g @render/cli
render logs -f zimple-cumplehub-app
```

### Ver Estado de la Base de Datos

```bash
Dashboard → PostgreSQL → zimple-cumplehub-db → Connections
```

---

## 🔄 Redespliegue

### Redesplegar después de cambios en el código:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Render detectará el push y redesplegará automáticamente (si tienes auto-deploy habilitado).

### Redesplegar manualmente:

1. Ve al dashboard de Render
2. Selecciona tu Web Service
3. Click en **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Costos

### Plan Gratuito (Free):
- ✅ 750 horas/mes de web service
- ✅ 1GB de PostgreSQL
- ✅ SSL gratuito
- ⚠️ Servicio se duerme después de 15 min
- ⚠️ Build limitado a 90 segundos

### Plan Pagado (Starter - $7/mes por servicio):
- ✅ Sin límite de horas
- ✅ No se duerme
- ✅ Mejor performance
- ✅ Build sin límite de tiempo
- ✅ Soporte prioritario

**PostgreSQL Pagado ($7/mes):**
- ✅ 1GB storage + $1 por GB adicional
- ✅ Backups automáticos
- ✅ Alta disponibilidad

---

## 🔐 Seguridad

### Buenas Prácticas:

1. ✅ **Nunca** subas archivos `.env` a GitHub
2. ✅ Usa variables de entorno en Render
3. ✅ Genera un `JWT_SECRET` único y fuerte
4. ✅ Cambia el `ENCRYPTION_KEY` por defecto
5. ✅ Habilita "Auto-Deploy" solo en la rama `main`
6. ✅ Usa "Preview Environments" para branches de desarrollo

---

## 🎉 Deploy Exitoso

Si todo salió bien, deberías ver:

```
✅ Build completed successfully
✅ Starting service...
✅ Server running on http://0.0.0.0:3000
✅ Database connection established
✅ Health check passed
✅ Service is live at https://zimple-cumplehub-app.onrender.com
```

---

## 📞 Soporte

- **Documentación oficial:** https://render.com/docs
- **Community Forum:** https://community.render.com
- **Status:** https://status.render.com

---

## 🔗 URLs Útiles

Después del deploy, guarda estas URLs:

- **Aplicación:** `https://zimple-cumplehub-app.onrender.com`
- **API Health:** `https://zimple-cumplehub-app.onrender.com/api/health`
- **API Docs:** `https://zimple-cumplehub-app.onrender.com/api`
- **Dashboard:** https://dashboard.render.com

---

**¡Tu aplicación está en producción! 🚀**
