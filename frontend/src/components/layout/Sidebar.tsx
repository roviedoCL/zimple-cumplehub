import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ShieldAlert, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  Sparkles
} from 'lucide-react';

const menuItems: { path: string; icon: React.ElementType; label: string; badge?: string }[] = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/compliance', icon: ShieldAlert, label: 'Compliance' },
  { path: '/surveys', icon: FileText, label: 'Encuestas' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/users', icon: Users, label: 'Usuarios' },
  { path: '/ai-agent', icon: Sparkles, label: 'Agente IA', badge: 'Demo' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">CumpleHub</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
            {'badge' in item && (
              <span className="ml-auto px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}