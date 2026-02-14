import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
          <AlertTriangle className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Página no encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Volver atrás
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}