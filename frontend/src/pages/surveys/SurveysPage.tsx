import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Plus, 
  Search, 
  FileText,
  BarChart3,
  Calendar,
  MoreHorizontal,
  Play,
  Pause,
  X,
  Upload,
  CheckCircle,
  Trash2,
  Wand2
} from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  type: string;
  status: 'Activa' | 'Programada' | 'Cerrada' | 'Pausada';
  responses: number;
  total: number;
  endDate: string;
  description?: string;
  attachments?: string[];
}

const initialSurveys: Survey[] = [
  { 
    id: 'ENC-001', 
    title: 'Clima Organizacional 2026', 
    type: 'Clima Laboral',
    status: 'Activa', 
    responses: 856,
    total: 1200,
    endDate: '2026-02-28',
    description: 'Encuesta anual para medir el clima laboral de la organización'
  },
  { 
    id: 'ENC-002', 
    title: 'Evaluación de Líderes', 
    type: 'Evaluación 360°',
    status: 'Programada', 
    responses: 0,
    total: 150,
    endDate: '2026-03-15',
    description: 'Evaluación de desempeño de líderes y managers'
  },
  { 
    id: 'ENC-003', 
    title: 'Encuesta de Salida Q4 2025', 
    type: 'Retención',
    status: 'Cerrada', 
    responses: 45,
    total: 48,
    endDate: '2025-12-31',
    description: 'Encuesta para empleados que dejan la empresa'
  },
  { 
    id: 'ENC-004', 
    title: 'Bienestar y Salud Mental', 
    type: 'Bienestar',
    status: 'Activa', 
    responses: 423,
    total: 1200,
    endDate: '2026-03-10',
    description: 'Encuesta sobre programas de bienestar y salud mental'
  },
];

const surveyTypes = [
  'Clima Laboral',
  'Evaluación 360°',
  'Retención',
  'Bienestar',
  'Engagement',
  'Personalizada'
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Activa':
      return 'bg-green-100 text-green-800';
    case 'Programada':
      return 'bg-blue-100 text-blue-800';
    case 'Cerrada':
      return 'bg-gray-100 text-gray-800';
    case 'Pausada':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function SurveysPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    type: 'Clima Laboral',
    description: '',
    endDate: '',
    total: 100
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    
    const survey: Survey = {
      id: `ENC-${String(surveys.length + 1).padStart(3, '0')}`,
      title: newSurvey.title,
      type: newSurvey.type,
      status: 'Programada',
      responses: 0,
      total: newSurvey.total,
      endDate: newSurvey.endDate,
      description: newSurvey.description,
      attachments: attachments.map(f => f.name)
    };

    setSurveys([survey, ...surveys]);
    setIsModalOpen(false);
    setShowSuccess(true);
    setNewSurvey({ title: '', type: 'Clima Laboral', description: '', endDate: '', total: 100 });
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

  const filteredSurveys = surveys.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in">
          <CheckCircle className="w-5 h-5 mr-2" />
          Encuesta creada exitosamente
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Encuestas</h1>
          <p className="text-gray-600 mt-1">Gestión de encuestas de clima y bienestar</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/surveys/builder')}
            className="hidden sm:flex"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Diseñador Visual
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Encuesta
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Programadas</p>
                <p className="text-xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Encuestas</p>
                <p className="text-xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Tasa de Respuesta</p>
                <p className="text-xl font-bold text-gray-900">78%</p>
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
                placeholder="Buscar encuestas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Todas</Button>
            <Button variant="outline">Activas</Button>
            <Button variant="outline">Cerradas</Button>
          </div>
        </CardContent>
      </Card>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSurveys.map((survey) => (
          <Card key={survey.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                      {survey.status}
                    </span>
                    <span className="text-sm text-gray-500">{survey.type}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">{survey.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">ID: {survey.id}</p>
                  {survey.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{survey.description}</p>
                  )}
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso</span>
                  <span>{Math.round((survey.responses / survey.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all" 
                    style={{ width: `${(survey.responses / survey.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {survey.responses} de {survey.total} respuestas
                </p>
              </div>

              {survey.attachments && survey.attachments.length > 0 && (
                <div className="mt-3 flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-1" />
                  {survey.attachments.length} archivo(s) adjunto(s)
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  Vence: {survey.endDate}
                </div>
                <div className="flex items-center space-x-2">
                  {survey.status === 'Activa' && (
                    <Button variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-1" />
                      Pausar
                    </Button>
                  )}
                  <Button size="sm">Ver Resultados</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Survey Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Nueva Encuesta</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSurvey} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Encuesta *
                </label>
                <Input
                  required
                  value={newSurvey.title}
                  onChange={(e) => setNewSurvey({...newSurvey, title: e.target.value})}
                  placeholder="Ej: Clima Organizacional 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Encuesta *
                  </label>
                  <select
                    required
                    value={newSurvey.type}
                    onChange={(e) => setNewSurvey({...newSurvey, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {surveyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Cierre *
                  </label>
                  <Input
                    type="date"
                    required
                    value={newSurvey.endDate}
                    onChange={(e) => setNewSurvey({...newSurvey, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Participantes
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newSurvey.total}
                  onChange={(e) => setNewSurvey({...newSurvey, total: parseInt(e.target.value) || 100})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={newSurvey.description}
                  onChange={(e) => setNewSurvey({...newSurvey, description: e.target.value})}
                  placeholder="Descripción breve del objetivo de la encuesta..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos Adjuntos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
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

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Encuesta
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}