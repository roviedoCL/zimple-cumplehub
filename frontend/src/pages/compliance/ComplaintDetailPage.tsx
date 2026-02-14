import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft, 
  User, 
  FileText,
  MessageSquare
} from 'lucide-react';

export function ComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const complaint = {
    id: id || 'DEN-001',
    type: 'Acoso Laboral',
    status: 'En Investigación',
    priority: 'Alta',
    channel: 'Canal Ético',
    createdAt: '2026-02-10',
    description: 'El denunciante reporta comportamiento inapropiado por parte de su supervisor directo durante las últimas 3 semanas.',
    complainant: 'Anónimo',
    involved: ['Carlos M. (Supervisor)', 'Equipo de Ventas'],
    assignedTo: 'María González',
    timeline: [
      { date: '2026-02-10 09:30', action: 'Denuncia recibida', user: 'Sistema' },
      { date: '2026-02-10 10:15', action: 'Asignada a investigador', user: 'Admin' },
      { date: '2026-02-11 14:20', action: 'Primera entrevista realizada', user: 'María González' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/compliance')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{complaint.id}</h1>
          <p className="text-gray-600">Detalle de la denuncia</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium text-gray-900">{complaint.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Canal</p>
                  <p className="font-medium text-gray-900">{complaint.channel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    {complaint.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prioridad</p>
                  <span className="font-medium text-red-600">{complaint.priority}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Descripción</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Línea de Tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaint.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">{event.action}</p>
                      <p className="text-sm text-gray-600">{event.user} • {event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asignación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{complaint.assignedTo}</p>
                  <p className="text-sm text-gray-600">Investigador</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Reasignar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partes Involucradas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {complaint.involved.map((person, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {person}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Agregar Nota
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Adjuntar Documento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}