# 🚀 Quickstart: Deploy en Render

## ⚡ Deploy en 5 minutos

### 1️⃣ Preparar el código

```bash
# Dar permisos a los scripts
chmod +x render-deploy-prepare.sh render-verify.sh

# Ejecutar script de preparación
./render-deploy-prepare.sh
```

El script te guiará para:
- ✅ Hacer commit de cambios
- ✅ Push a GitHub
- ✅ Verificar archivos críticos

---

### 2️⃣ Crear servicios en Render

#### Opción A: Blueprint (RECOMENDADO - Automático)

1. Ve a **https://render.com**
2. Click en **"New"** → **"Blueprint"**
3. Selecciona tu repositorio
4. Render detectará `render.yaml` automáticamente
5. Click en **"Apply"**
6. ¡Listo! ☕ Espera 10-15 minutos

#### Opción B: Manual

1. **Crear PostgreSQL:**
   - New → PostgreSQL
   - Name: `zimple-cumplehub-db`
   - Plan: Free
   - Create Database

2. **Crear Web Service:**
   - New → Web Service
   - Runtime: **Docker**
   - Name: `zimple-cumplehub-app`
   - Plan: Free

3. **Variables de entorno:**
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<copiar de PostgreSQL>
   JWT_SECRET=<generar aleatorio>
   ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
   ```

---

### 3️⃣ Verificar el deploy

Cuando termine:

```bash
# Verificar que todo funciona
./render-verify.sh https://zimple-cumplehub-app.onrender.com
```

Deberías ver:
```
✅ Health check OK (200)
✅ Frontend OK (200)
✅ API docs OK
```

---

## 🔗 URLs después del deploy

- **App:** `https://zimple-cumplehub-app.onrender.com`
- **Health:** `https://zimple-cumplehub-app.onrender.com/api/health`
- **API Docs:** `https://zimple-cumplehub-app.onrender.com/api`

---

## 🐛 Si algo falla

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio
3. Click en **"Logs"**
4. Busca errores de:
   - ❌ Database connection
   - ❌ Build failed
   - ❌ Port binding

---

## 📖 Documentación completa

Para más detalles:
```bash
cat DEPLOY_RENDER_COMPLETO.md
```

---

**¡Eso es todo! 🎉**
