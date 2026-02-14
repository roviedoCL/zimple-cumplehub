import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Plus, 
  Search, 
  Users,
  UserCheck,
  UserX,
  Mail,
  MoreHorizontal,
  Edit2,
  Trash2
} from 'lucide-react';

const users = [
  { 
    id: 'USR-001', 
    name: 'María González', 
    email: 'maria.gonzalez@empresa.com',
    role: 'Administrador',
    department: 'RRHH',
    status: 'Activo',
    lastLogin: '2026-02-14 09:30'
  },
  { 
    id: 'USR-002', 
    name: 'Juan Pérez', 
    email: 'juan.perez@empresa.com',
    role: 'Manager',
    department: 'Ventas',
    status: 'Activo',
    lastLogin: '2026-02-14 08:15'
  },
  { 
    id: 'USR-003', 
    name: 'Ana Martínez', 
    email: 'ana.martinez@empresa.com',
    role: 'Usuario',
    department: 'Marketing',
    status: 'Inactivo',
    lastLogin: '2026-02-10 14:20'
  },
  { 
    id: 'USR-004', 
    name: 'Carlos Rodríguez', 
    email: 'carlos.rodriguez@empresa.com',
    role: 'Analista',
    department: 'Tecnología',
    status: 'Activo',
    lastLogin: '2026-02-13 16:45'
  },
  { 
    id: 'USR-005', 
    name: 'Laura Sánchez', 
    email: 'laura.sanchez@empresa.com',
    role: 'Usuario',
    department: 'Operaciones',
    status: 'Activo',
    lastLogin: '2026-02-14 07:50'
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Activo':
      return 'bg-green-100 text-green-800';
    case 'Inactivo':
      return 'bg-gray-100 text-gray-800';
    case 'Suspendido':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Administrador':
      return 'bg-purple-100 text-purple-800';
    case 'Manager':
      return 'bg-blue-100 text-blue-800';
    case 'Analista':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Gestión de usuarios y permisos</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-xl font-bold text-gray-900">1,156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <UserX className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Inactivos</p>
                <p className="text-xl font-bold text-gray-900">78</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Nuevos (Mes)</p>
                <p className="text-xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Todos</Button>
            <Button variant="outline">Activos</Button>
            <Button variant="outline">Inactivos</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Usuario</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Rol</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Departamento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Último Acceso</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{user.department}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 hover:text-indigo-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-indigo-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}