import { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Plus, 
  Search, 
  Filter,
  ShieldAlert,
  Eye,
  Edit2,
  MoreHorizontal,
  X,
  Upload,
  CheckCircle,
  Trash2,
  FileText,
  AlertTriangle
} from 'lucide-react';


interface Complaint {
  id: string;
  type: string;
  channel: string;
  status: 'Pendiente' | 'En Investigación' | 'Resuelto' | 'Cerrado';
  date: string;
  priority: 'Alta' | 'Media' | 'Baja';
  description?: string;
  reporter?: string;
  attachments?: string[];
  anonymous?: boolean;
}

const initialComplaints: Complaint[] = [
  { 
    id: 'DEN-001', 
    type: 'Acoso Laboral', 
    channel: 'Canal Ético',
    status: 'En Investigación', 
    date: '2026-02-10',
    priority: 'Alta',
    description: 'Denuncia por acoso laboral en el departamento de ventas'
  },
  { 
    id: 'DEN-002', 
    type: 'Discriminación', 
    channel: 'Línea Directa',
    status: 'Pendiente', 
    date: '2026-02-09',
    priority: 'Media',
    description: 'Presunto caso de discriminación en proceso de selección'
  },
  { 
    id: 'DEN-003', 
    type: 'Fraude', 
    channel: 'Correo Electrónico',
    status: 'Resuelto', 
    date: '2026-02-08',
    priority: 'Alta',
    description: 'Reporte de irregularidades en facturación'
  },
  { 
    id: 'DEN-004', 
    type: 'Conflicto de Interés', 
    channel: 'Canal Ético',
    status: 'En Investigación', 
    date: '2026-02-07',
    priority: 'Baja',
    description: 'Posible conflicto de interés en contratación de proveedor'
  },
];

const complaintTypes = [
  'Acoso Laboral',
  'Discriminación',
  'Fraude',
  'Conflicto de Interés',
  'Robo',
  'Violencia',
  'Incumplimiento Normativa',
  'Otro'
];

const channels = [
  'Canal Ético',
  'Línea Directa',
  'Correo Electrónico',
  'Formulario Web',
  'Presencial'
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resuelto':
      return 'bg-green-100 text-green-800';
    case 'En Investigación':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pendiente':
      return 'bg-red-100 text-red-800';
    case 'Cerrado':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return 'text-red-600';
    case 'Media':
      return 'text-yellow-600';
    case 'Baja':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export function CompliancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    type: 'Acoso Laboral',
    channel: 'Canal Ético',
    priority: 'Media' as 'Alta' | 'Media' | 'Baja',
    description: '',
    reporter: '',
    anonymous: false
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    
    const complaint: Complaint = {
      id: `DEN-${String(complaints.length + 1).padStart(3, '0')}`,
      type: newComplaint.type,
      channel: newComplaint.channel,
      status: 'Pendiente',
      date: new Date().toISOString().split('T')[0],
      priority: newComplaint.priority,
      description: newComplaint.description,
      reporter: newComplaint.anonymous ? 'Anónimo' : newComplaint.reporter,
      attachments: attachments.map(f => f.name),
      anonymous: newComplaint.anonymous
    };

    setComplaints([complaint, ...complaints]);
    setIsModalOpen(false);
    setShowSuccess(true);
    setNewComplaint({
      type: 'Acoso Laboral',
      channel: 'Canal Ético',
      priority: 'Media',
      description: '',
      reporter: '',
      anonymous: false
    });
    setAttachments([]);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const filteredComplaints = complaints.filter(c => 
    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in">
          <CheckCircle className="w-5 h-5 mr-2" />
          Denuncia registrada exitosamente
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          <p className="text-gray-600 mt-1">Gestión de denuncias e investigaciones</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Denuncia
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">En Investigación</p>
                <p className="text-xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Resueltas (Mes)</p>
                <p className="text-xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-xl font-bold text-gray-900">12 días</p>
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
                placeholder="Buscar denuncias..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Denuncias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Canal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Prioridad</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{complaint.id}</td>
                    <td className="py-3 px-4 text-gray-700">{complaint.type}</td>
                    <td className="py-3 px-4 text-gray-700">{complaint.channel}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{complaint.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-600 hover:text-indigo-600" title="Ver detalle">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-indigo-600" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-indigo-600" title="Más opciones">
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

      {/* Create Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Nueva Denuncia</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-6 space-y-6">
              {/* Anonymous Toggle */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newComplaint.anonymous}
                    onChange={(e) => setNewComplaint({...newComplaint, anonymous: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Realizar denuncia anónima
                  </span>
                </label>
                <p className="text-xs text-gray-600 mt-1 ml-6">
                  Si seleccionas esta opción, tu identidad no será revelada en la investigación.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Incidente *
                  </label>
                  <select
                    required
                    value={newComplaint.type}
                    onChange={(e) => setNewComplaint({...newComplaint, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {complaintTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad *
                  </label>
                  <select
                    required
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value as 'Alta' | 'Media' | 'Baja'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal de Recepción *
                </label>
                <select
                  required
                  value={newComplaint.channel}
                  onChange={(e) => setNewComplaint({...newComplaint, channel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {channels.map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>

              {!newComplaint.anonymous && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Denunciante
                  </label>
                  <Input
                    value={newComplaint.reporter}
                    onChange={(e) => setNewComplaint({...newComplaint, reporter: e.target.value})}
                    placeholder="Nombre completo (opcional)"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Incidente *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  placeholder="Describe detalladamente lo ocurrido, incluyendo fechas, lugares y personas involucradas..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidencias Adjuntas
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Puedes adjuntar imágenes, documentos, audios o videos
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="complaint-file-upload"
                    accept="image/*,.pdf,.doc,.docx,.mp3,.mp4,.wav"
                  />
                  <label htmlFor="complaint-file-upload">
                    <Button type="button" variant="outline" size="sm">
                      Seleccionar Archivos
                    </Button>
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Todas las denuncias son tratadas con estricta confidencialidad. 
                  El equipo de Compliance investigará el caso y tomará las medidas correspondientes.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Denuncia
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
