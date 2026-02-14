# Zimple CumpleHub

Plataforma SaaS integral para gestión de cumplimiento normativo, clima organizacional y bienestar empresarial.

## 🎯 Descripción del Proyecto

**Zimple CumpleHub** es una plataforma empresarial diseñada para ayudar a organizaciones a cumplir con regulaciones laborales (especialmente la Ley Karin en Chile), gestionar el clima organizacional, y promover la equidad, diversidad e inclusión.

### Características Principales

- **Cumplimiento Ley Karin (Chile)**: Gestión completa de protocolos, canal de denuncias confidencial, investigaciones con perspectiva de género
- **Sistema de Encuestas Inteligente**: Constructor drag & drop, multicanal (web, móvil, WhatsApp, IVR), modo offline
- **Analytics Avanzado**: Dashboards ejecutivos, KPIs configurables, análisis con IA/ML
- **Multi-tenant**: Arquitectura escalable con aislamiento de datos por empresa
- **API REST Completa**: Integraciones con HRIS (SAP, Workday, BUK, Talana)

## 🚀 Tecnologías

### Backend
- **Node.js** + **NestJS** - Framework escalable y modular
- **TypeScript** - Tipado estático para código más robusto
- **PostgreSQL** - Base de datos relacional principal
- **Redis** - Caché y sesiones
- **TypeORM** - ORM para manejo de base de datos
- **BullMQ** - Colas de procesamiento
- **JWT** - Autenticación segura

### Frontend
- **React** + **TypeScript**
- **Vite** - Build tool moderno
- **Zustand** + **React Query** - Gestión de estado
- **Tailwind CSS** + **shadcn/ui** - UI components
- **Vitest** - Testing

### Infraestructura
- **Docker** + **Docker Compose**
- **AWS/GCP** - Cloud hosting
- **GitHub Actions** - CI/CD

## 📁 Estructura del Proyecto

```
zimple-cumplehub/
├── backend/                 # API REST (NestJS)
│   ├── src/
│   │   ├── core/              # Núcleo (filtros, interceptores)
│   │   ├── infrastructure/  # Infraestructura (DB, logger, encryption)
│   │   ├── modules/         # Módulos de dominio
│   │   │   ├── identity/      # Autenticación y usuarios
│   │   │   ├── tenant/        # Gestión de tenants
│   │   │   ├── compliance/    # Cumplimiento normativo
│   │   │   ├── survey/        # Sistema de encuestas
│   │   │   └── analytics/     # Análisis y reportes
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/                # Aplicación web (React)
├── docker-compose.yml       # Orquestación de servicios
├── .env.example            # Variables de entorno
└── README.md               # Este archivo
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 20+
- Docker y Docker Compose
- PostgreSQL 15+
- Redis 7+

### Configuración Rápida con Docker

```bash
# Clonar el repositorio
git clone https://github.com/zimple/cumplehub.git
cd cumplehub

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
# Especialmente: JWT_SECRET, ENCRYPTION_KEY, DB_PASSWORD

# Iniciar servicios
docker-compose up -d

# La API estará disponible en http://localhost:3000
# Documentación Swagger en http://localhost:3000/api/docs
```

### Instalación Manual (Desarrollo)

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `cumplehub` |
| `DB_USERNAME` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `secretpassword` |
| `REDIS_HOST` | Host de Redis | `localhost` |
| `REDIS_PORT` | Puerto de Redis | `6379` |
| `JWT_SECRET` | Clave secreta para JWT | `your-secret-key` |
| `ENCRYPTION_KEY` | Clave de encriptación (64 hex chars) | `abc123...` |

## 📚 Módulos Principales

### 1. Cumplimiento Ley Karin
- Canal de denuncias confidencial (anónimo o identificado)
- Gestión de investigaciones con perspectiva de género
- Atención psicológica temprana
- Reportería regulatoria automática

### 2. Sistema de Encuestas
- Constructor visual drag & drop
- Múltiples tipos de preguntas
- Distribución multicanal
- Análisis de sentimiento con IA

### 3. Analytics y KPIs
- Dashboard ejecutivo configurable
- Benchmarking por industria
- Predicción de rotación con ML
- Alertas tempranas

## 🔐 Seguridad

- **Autenticación**: JWT con refresh tokens
- **Autorización**: RBAC con permisos granulares
- **Encriptación**: AES-256-GCM para datos sensibles
- **Headers de seguridad**: Helmet
- **Rate limiting**: Protección contra abuso
- **Audit trail**: Registro completo de operaciones

## 📈 Escalabilidad

- Arquitectura multi-tenant con aislamiento de datos
- Caché multinivel (in-memory, Redis, CDN)
- Procesamiento asíncrono con colas
- Base de datos con particionamiento
- Soporte para clustering

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📝 Licencia

Este proyecto es propiedad de Zimple Consulting SpA. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@zimple.cl
- Web: https://zimple.cl

---

**Desarrollado con ❤️ por Zimple Consulting**