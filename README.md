# Sistema de Autenticación con JWT - Películas Backend

## Descripción
Este backend implementa un sistema de autenticación JWT con roles de usuario para una aplicación de gestión de películas.

## Roles de Usuario

### Admin
- **Permisos completos**: Puede crear, leer, actualizar y eliminar en todos los módulos
- **Gestión de usuarios**: Puede registrar nuevos usuarios y gestionar sus permisos
- **Acceso a todos los endpoints**

### Docente
- **Permisos de lectura**: Solo puede listar información de los módulos
- **Restricción especial en Media**: Solo puede listar medias, no puede crear/editar
- **No puede gestionar usuarios**

## Endpoints de Autenticación

### POST /api/auth/login
Iniciar sesión con email y contraseña
```json
{
    "email": "admin@admin.com",
    "password": "admin123"
}
```

**Respuesta:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
        "id": "...",
        "nombre": "Administrador",
        "email": "admin@admin.com",
        "role": "Admin"
    }
}
```

### POST /api/auth/register (Solo Admin)
Registrar un nuevo usuario (requiere token de Admin)
```json
{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "role": "Docente"
}
```

### GET /api/auth/profile
Obtener perfil del usuario autenticado (requiere token)

### GET /api/auth/usuarios (Solo Admin)
Listar todos los usuarios

### PUT /api/auth/usuarios/:id (Solo Admin)
Actualizar un usuario específico

## Uso de Autenticación

### Headers requeridos
Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

### Endpoints protegidos por módulo

#### Directores (/api/directores)
- **GET /**: Admin y Docente pueden listar
- **POST /**: Solo Admin puede crear
- **PUT /:id**: Solo Admin puede editar

#### Géneros (/api/generos)
- **GET /**: Admin y Docente pueden listar
- **POST /**: Solo Admin puede crear
- **PUT /:id**: Solo Admin puede editar

#### Tipos (/api/tipos)
- **GET /**: Admin y Docente pueden listar
- **POST /**: Solo Admin puede crear
- **PUT /:id**: Solo Admin puede editar

#### Productoras (/api/productoras)
- **GET /**: Admin y Docente pueden listar
- **POST /**: Solo Admin puede crear
- **PUT /:id**: Solo Admin puede editar

#### Medias (/api/medias)
- **GET /**: Admin y Docente pueden listar
- **POST /**: Solo Admin puede crear
- **PUT /:id**: Solo Admin puede editar

## Usuario Administrador por Defecto

Al ejecutar `npm run setup-admin`, se crea un usuario administrador:
- **Email**: admin@admin.com
- **Password**: admin123
- **Role**: Admin

## Variables de Entorno

Asegúrate de tener las siguientes variables en tu archivo `.env`:
```
MONGO_CNN=tu_connection_string_mongodb
JWT_SECRET=tu_secret_key_para_jwt
FRONTEND_URL=url_de_tu_frontend
PORT=4000
```

## Instalación y Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Crear usuario administrador:
```bash
npm run setup-admin
```

3. Iniciar servidor:
```bash
npm start
```

## Ejemplos de Uso

### Iniciar sesión
```javascript
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'admin@admin.com',
        password: 'admin123'
    })
});
const data = await response.json();
const token = data.token;
```

### Hacer peticiones autenticadas
```javascript
const response = await fetch('/api/directores', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

### Crear un nuevo director (Solo Admin)
```javascript
const response = await fetch('/api/directores', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: 'Steven Spielberg',
        estado: 'Activo'
    })
});
```

## Códigos de Error

- **401 Unauthorized**: Token inválido o faltante
- **403 Forbidden**: Usuario sin permisos para la acción
- **404 Not Found**: Recurso no encontrado
- **400 Bad Request**: Datos de entrada inválidos
- **500 Internal Server Error**: Error del servidor

## Seguridad

- Las contraseñas se encriptan usando bcryptjs
- Los tokens JWT incluyen información del usuario y rol
- Middleware de autenticación valida tokens en cada petición
- Control de acceso basado en roles (RBAC)
- CORS configurado para orígenes específicos