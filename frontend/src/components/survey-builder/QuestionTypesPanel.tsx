import { 
  Type, 
  List, 
  CheckSquare, 
  AlignLeft, 
  Calendar, 
  ToggleLeft,
  Star,
  Hash
} from 'lucide-react';

export type QuestionType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'multiselect' 
  | 'radio' 
  | 'checkbox' 
  | 'scale' 
  | 'date' 
  | 'number' 
  | 'yesno';

interface QuestionTypeConfig {
  type: QuestionType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const questionTypes: QuestionTypeConfig[] = [
  {
    type: 'text',
    label: 'Texto corto',
    description: 'Respuesta en una línea',
    icon: <Type className="w-5 h-5" />
  },
  {
    type: 'textarea',
    label: 'Texto largo',
    description: 'Respuesta en párrafo',
    icon: <AlignLeft className="w-5 h-5" />
  },
  {
    type: 'select',
    label: 'Lista desplegable',
    description: 'Selecciona una opción',
    icon: <List className="w-5 h-5" />
  },
  {
    type: 'radio',
    label: 'Opción única',
    description: 'Selecciona solo una',
    icon: <CheckSquare className="w-5 h-5" />
  },
  {
    type: 'checkbox',
    label: 'Selección múltiple',
    description: 'Selecciona varias',
    icon: <CheckSquare className="w-5 h-5" />
  },
  {
    type: 'yesno',
    label: 'Sí / No',
    description: 'Respuesta binaria',
    icon: <ToggleLeft className="w-5 h-5" />
  },
  {
    type: 'scale',
    label: 'Escala',
    description: 'Calificación 1-5 o 1-10',
    icon: <Star className="w-5 h-5" />
  },
  {
    type: 'number',
    label: 'Número',
    description: 'Valor numérico',
    icon: <Hash className="w-5 h-5" />
  },
  {
    type: 'date',
    label: 'Fecha',
    description: 'Selector de fecha',
    icon: <Calendar className="w-5 h-5" />
  }
];

interface QuestionTypesPanelProps {
  onDragStart: (type: QuestionType) => void;
}

export function QuestionTypesPanel({ onDragStart }: QuestionTypesPanelProps) {
  const handleDragStart = (e: React.DragEvent, type: QuestionType) => {
    e.dataTransfer.setData('questionType', type);
    onDragStart(type);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        Tipos de Preguntas
      </h3>
      <div className="space-y-2">
        {questionTypes.map((qt) => (
          <div
            key={qt.type}
            draggable
            onDragStart={(e) => handleDragStart(e, qt.type)}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 
                       hover:border-blue-400 hover:bg-blue-50 cursor-move transition-all
                       group"
          >
            <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
              {qt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{qt.label}</p>
              <p className="text-xs text-gray-500">{qt.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700">
          💡 Arrastra los tipos de preguntas al área de trabajo
        </p>
      </div>
    </div>
  );
}

export { questionTypes };
export type { QuestionTypeConfig };