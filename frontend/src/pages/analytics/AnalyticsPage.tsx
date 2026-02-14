import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
  TrendingUp, 
  Users, 
  Smile, 
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const kpis = [
  { 
    title: 'NPS (Net Promoter Score)', 
    value: '+42', 
    change: '+5',
    icon: Smile,
    description: 'Promedio último trimestre'
  },
  { 
    title: 'E-NPS (Employee NPS)', 
    value: '+38', 
    change: '+3',
    icon: Users,
    description: 'Satisfacción de empleados'
  },
  { 
    title: 'Clima Laboral', 
    value: '4.2/5', 
    change: '+0.3',
    icon: TrendingUp,
    description: 'Escala 1-5'
  },
  { 
    title: 'Riesgo de Fuga', 
    value: '12%', 
    change: '-2%',
    icon: AlertTriangle,
    description: 'Empleados en riesgo alto'
  },
];

const departmentScores = [
  { name: 'Tecnología', score: 4.5, employees: 45 },
  { name: 'Ventas', score: 4.1, employees: 32 },
  { name: 'Marketing', score: 4.3, employees: 18 },
  { name: 'RRHH', score: 4.6, employees: 12 },
  { name: 'Operaciones', score: 3.9, employees: 67 },
  { name: 'Finanzas', score: 4.0, employees: 23 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Métricas e indicadores de clima organizacional</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs trimestre anterior</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <kpi.icon className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Clima por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentScores.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{dept.employees} emp.</span>
                      <span className="text-sm font-semibold text-gray-900">{dept.score}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        dept.score >= 4.5 ? 'bg-green-500' :
                        dept.score >= 4.0 ? 'bg-indigo-500' :
                        dept.score >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(dept.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Análisis de Sentimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-48 h-48">
                {/* Simple pie chart representation */}
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray="125.6 251.2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray="75.36 251.2"
                    strokeDashoffset="-125.6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeDasharray="50.24 251.2"
                    strokeDashoffset="-200.96"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Positivo</span>
                </div>
                <p className="text-xl font-bold text-gray-900">50%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Neutral</span>
                </div>
                <p className="text-xl font-bold text-gray-900">30%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Negativo</span>
                </div>
                <p className="text-xl font-bold text-gray-900">20%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Encuesta de Clima completada</p>
                <p className="text-xs text-gray-500">Hace 2 horas • 234 respuestas nuevas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Reporte mensual generado</p>
                <p className="text-xs text-gray-500">Hace 5 horas • Analytics</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Alerta de riesgo detectada</p>
                <p className="text-xs text-gray-500">Hace 1 día • Departamento de Ventas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nueva meta de NPS establecida</p>
                <p className="text-xs text-gray-500">Hace 2 días • Objetivo: +45</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}