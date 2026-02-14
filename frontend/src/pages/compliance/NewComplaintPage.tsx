import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Send } from 'lucide-react';

export function NewComplaintPage() {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    navigate('/compliance');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/compliance')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Denuncia</h1>
          <p className="text-gray-600">Registrar una nueva denuncia o reporte</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Denuncia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Denuncia *
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="harassment">Acoso Laboral</option>
                      <option value="discrimination">Discriminación</option>
                      <option value="fraud">Fraude</option>
                      <option value="conflict">Conflicto de Interés</option>
                      <option value="violence">Violencia</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canal de Recepción *
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="ethics">Canal Ético</option>
                      <option value="hotline">Línea Directa</option>
                      <option value="email">Correo Electrónico</option>
                      <option value="web">Formulario Web</option>
                      <option value="inperson">Presencial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Incidente
                  </label>
                  <Input type="date" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Detallada *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Describa los hechos de manera detallada..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personas Involucradas
                  </label>
                  <Input placeholder="Nombres o cargos de las personas involucradas" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testigos (si aplica)
                  </label>
                  <Input placeholder="Nombres de testigos" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Denunciante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
                    Denuncia anónima
                  </label>
                </div>

                {!isAnonymous && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <Input placeholder="Nombre completo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <Input type="email" placeholder="correo@ejemplo.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <Input placeholder="+56 9 1234 5678" />
                    </div>
                  </>
                )}

                {isAnonymous && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Ha seleccionado denuncia anónima. No podremos contactarlo para solicitar información adicional.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prioridad</CardTitle>
              </CardHeader>
              <CardContent>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high" selected>Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Registrar Denuncia
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/compliance')}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}