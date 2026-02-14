-- Script para crear usuario de prueba
-- La contraseña es: TestPassword123!
-- Hash generado con bcrypt (10 rounds)

INSERT INTO shared.users (
    id,
    tenant_id,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    status,
    email_verified,
    rut,
    job_title,
    department,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Usuario',
    'Prueba',
    'test@zimple.com',
    '$2b$10$YourHashedPasswordHere',  -- Reemplazar con hash real de 'TestPassword123!'
    '+56912345678',
    'active',
    true,
    '12.345.678-9',
    'Administrador',
    'Sistemas',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Crear rol de admin si no existe
INSERT INTO shared.roles (id, tenant_id, name, description, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000001',
    'tenant_admin',
    'Administrador del tenant',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- Asignar rol al usuario
INSERT INTO shared.user_roles (user_id, role_id)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT DO NOTHING;
