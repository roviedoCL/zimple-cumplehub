import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Building2, 
  Bell, 
  Shield, 
  Users,
  Mail,
  Save
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'team', label: 'Equipo', icon: Users },
  { id: 'integrations', label: 'Integraciones', icon: Mail },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Administra la configuración de tu organización</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <Card className="lg:w-64">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Organización
                    </label>
                    <Input defaultValue="Zimple Consulting SpA" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUT
                    </label>
                    <Input defaultValue="77.123.456-7" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo de Contacto
                    </label>
                    <Input defaultValue="contacto@zimple.cl" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <Input defaultValue="+56 2 2345 6789" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <Input defaultValue="Av. Apoquindo 1234, Las Condes, Santiago" />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Nuevas Denuncias</p>
                      <p className="text-sm text-gray-600">Recibir notificación cuando se registre una nueva denuncia</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Encuestas Completadas</p>
                      <p className="text-sm text-gray-600">Notificar cuando un empleado complete una encuesta</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Reportes Semanales</p>
                      <p className="text-sm text-gray-600">Enviar reporte semanal de métricas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Autenticación de Dos Factores</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">2FA está desactivado</p>
                        <p className="text-sm text-gray-600">Activa la autenticación de dos factores para mayor seguridad</p>
                      </div>
                      <Button variant="outline">Activar 2FA</Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                      </label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <Input type="password" />
                    </div>
                    <Button>Actualizar Contraseña</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Gestión del Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Administra los miembros de tu equipo y sus permisos desde la sección de <a href="/users" className="text-indigo-600 hover:text-indigo-500">Usuarios</a>.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle>Integraciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Microsoft 365</p>
                      <p className="text-sm text-gray-600">Sincronización de usuarios y calendarios</p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Slack</p>
                      <p className="text-sm text-gray-600">Notificaciones en tiempo real</p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}