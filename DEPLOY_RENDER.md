# Deploy en Render

## Opción 1: Usando Docker (Recomendado)

### Paso 1: Crear cuenta en Render
1. Ve a https://render.com
2. Regístrate con GitHub
3. Conecta tu repositorio

### Paso 2: Crear Blueprint
1. En el dashboard de Render, click en "Blueprints"
2. Click en "New Blueprint Instance"
3. Selecciona tu repositorio de GitHub
4. Render detectará automáticamente el archivo `render.yaml`

### Paso 3: Configurar Variables de Entorno
Render generará automáticamente:
- `DATABASE_URL` (desde PostgreSQL)
- `REDIS_URL` (desde Redis)
- `JWT_SECRET` (generado)

Pero necesitas configurar manualmente:
- `ENCRYPTION_KEY`: `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`

### Paso 4: Deploy
1. Click en "Apply"
2. Render creará:
   - Base de datos PostgreSQL
   - Instancia Redis
   - Web service con tu aplicación

## Opción 2: Manual (Sin Blueprint)

### Paso 1: Crear PostgreSQL
1. En el dashboard, click "New" → "PostgreSQL"
2. Nombre: `zimple-cumplehub-db`
3. Plan: Free
4. Guardar

### Paso 2: Crear Web Service
1. Click "New" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: `zimple-cumplehub-app`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free

### Paso 3: Variables de Entorno
Agrega estas variables:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=<copiar desde PostgreSQL>
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
JWT_SECRET=<generar valor aleatorio>
```

### Paso 4: Deploy
Click en "Create Web Service"

## URLs después del deploy

- **Aplicación**: `https://zimple-cumplehub-app.onrender.com`
- **API Docs**: `https://zimple-cumplehub-app.onrender.com/api/docs`
- **API**: `https://zimple-cumplehub-app.onrender.com/api/v1`

## Notas

- El plan gratuito de Render tiene:
  - Web services: Se duermen después de 15 min de inactividad
  - PostgreSQL: 1 GB de almacenamiento
  - Redis: 25 MB
- El primer deploy puede tardar 5-10 minutos
- Los builds subsiguientes son más rápidos