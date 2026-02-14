import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
  Users, 
  ShieldCheck, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

const stats = [
  { title: 'Total Empleados', value: '1,234', icon: Users, change: '+12%' },
  { title: 'Denuncias Activas', value: '23', icon: ShieldCheck, change: '-5%' },
  { title: 'Encuestas Completadas', value: '89%', icon: FileText, change: '+8%' },
  { title: 'Cumplimiento General', value: '94%', icon: TrendingUp, change: '+3%' },
];

const recentComplaints = [
  { id: 'DEN-001', type: 'Acoso', status: 'En Investigación', date: '2026-02-10' },
  { id: 'DEN-002', type: 'Discriminación', status: 'Pendiente', date: '2026-02-09' },
  { id: 'DEN-003', type: 'Fraude', status: 'Resuelto', date: '2026-02-08' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido a CumpleHub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} vs mes anterior
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Denuncias Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      complaint.status === 'Resuelto' ? 'bg-green-100' :
                      complaint.status === 'En Investigación' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {complaint.status === 'Resuelto' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : complaint.status === 'En Investigación' ? (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{complaint.id}</p>
                      <p className="text-sm text-gray-600">{complaint.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{complaint.status}</p>
                    <p className="text-xs text-gray-500">{complaint.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Encuestas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Clima Organizacional 2026</p>
                    <p className="text-sm text-gray-600">Vence: 28 de febrero</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                    En curso
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Evaluación de Líderes</p>
                    <p className="text-sm text-gray-600">Inicia: 1 de marzo</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                    Programada
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}