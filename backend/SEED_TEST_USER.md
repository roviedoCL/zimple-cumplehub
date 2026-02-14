# Usuario de Prueba

## Credenciales de Acceso

El sistema crea automáticamente un usuario de prueba al iniciar en modo desarrollo:

- **Email:** `test@zimple.com`
- **Password:** `TestPassword123!`
- **Rol:** `tenant_admin`

## Cómo usar

### 1. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@zimple.com",
    "password": "TestPassword123!",
    "tenantId": "00000000-0000-0000-0000-000000000001"
  }'
```

### 2. Registro de nuevo usuario (público)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Nuevo",
    "lastName": "Usuario",
    "email": "nuevo@zimple.com",
    "password": "Password123!"
  }'
```

## Notas

- El usuario de prueba se crea automáticamente solo en modo `development`
- El tenant por defecto es: `00000000-0000-0000-0000-000000000001`
- El usuario tiene rol de `tenant_admin` con todos los permisos
