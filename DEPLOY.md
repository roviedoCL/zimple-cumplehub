# Guía de Deploy - Zimple CumpleHub

## 🚀 Opciones Recomendadas

### 1. Railway (Más Fácil) - RECOMENDADO

**Ventajas:**
- Soporte nativo para Docker Compose
- Base de datos PostgreSQL incluida
- Deploy automático desde GitHub
- $5 de crédito mensual gratuito

**Pasos:**

1. Crear cuenta en [railway.app](https://railway.app)
2. Conectar tu repositorio de GitHub
3. Railway detectará automáticamente el `docker-compose.yml`
4. Configurar variables de entorno en el dashboard
5. Deploy automático ✅

**Variables de entorno necesarias:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=tu_secreto_jwt
ENCRYPTION_KEY=tu_clave_de_encriptacion
NODE_ENV=production
```

---

### 2. Render (Gratuito)

**Ventajas:**
- Web service gratuito
- PostgreSQL gratuita
- Muy fácil de configurar

**Limitaciones:**
- El servicio se "duerme" después de 15 min de inactividad
- Tarda en despertarse (~30 segundos)

**Pasos:**

1. Crear cuenta en [render.com](https://render.com)
2. Crear un Blueprint desde `render.yaml`
3. Conectar repositorio de GitHub

---

### 3. Fly.io (Buen Rendimiento)

**Ventajas:**
- Excelente rendimiento
- CLI muy potente
- $5 de crédito mensual

**Pasos:**

```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Configurar base de datos
fly postgres create

# Deploy
fly deploy
```

---

## 📁 Estructura de Archivos para Deploy

```
Zimple CumpleHub/
├── docker-compose.yml          # Desarrollo
├── docker-compose.prod.yml     # Producción
├── Dockerfile                   # Build unificado (opcional)
├── railway.json                 # Config Railway
├── render.yaml                  # Config Render
├── fly.toml                     # Config Fly.io
├── frontend/
│   ├── Dockerfile                 # Frontend con Nginx
│   └── nginx.conf                 # Config Nginx
├── backend/
│   └── Dockerfile                 # Backend Node.js
└── DEPLOY.md                    # Esta guía
```

---

## 🔧 Configuración Backend para Producción

Asegúrate de tener estas variables en `backend/src/config/`:

```typescript
// database.config.ts
export default () => ({
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
  },
});
```

---

## 🌐 URLs Después del Deploy

### Railway:
- Frontend: `https://tu-app-frontend.railway.app`
- Backend: `https://tu-app-backend.railway.app`
- API Docs: `https://tu-app-backend.railway.app/api`

### Render:
- Frontend: `https://tu-app.onrender.com`
- Backend: `https://tu-app-api.onrender.com`

### Fly.io:
- Frontend: `https://tu-app.fly.dev`
- Backend: `https://tu-app-api.fly.dev`

---

## ⚠️ Consideraciones Importantes

### Seguridad:
1. **Nunca** subas el archivo `.env` a GitHub
2. Usa variables de entorno en la plataforma de deploy
3. Genera claves JWT y de encriptación fuertes
4. Habilita HTTPS siempre

### Base de Datos:
1. Railway/Render/Fly proporcionan PostgreSQL gratuito
2. Para producción real, considera un plan pagado
3. Configura backups automáticos

### Seeds:
El usuario de prueba se crea automáticamente:
- Email: `test@zimple.com`
- Password: `TestPassword123!`
- Rol: `tenant_admin`

---

## 📱 Comandos Útiles

### Local (desarrollo):
```bash
docker-compose up -d
```

### Producción (con docker-compose.prod.yml):
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Ver logs:
```bash
docker-compose logs -f
```

### Reiniciar servicios:
```bash
docker-compose restart
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `docker-compose logs`
2. Verifica variables de entorno
3. Asegúrate de que los puertos no estén ocupados
4. Comprueba la conexión a la base de datos

---

## ✅ Checklist Pre-Deploy

- [ ] Todas las variables de entorno configuradas
- [ ] Base de datos migrada y lista
- [ ] Seeds ejecutados (si es necesario)
- [ ] Frontend build exitoso
- [ ] Backend compila sin errores
- [ ] Tests pasando (si los hay)
- [ ] Documentación actualizada
- [ ] README con instrucciones de uso

---

**¡Listo para deployar! 🚀**