import { useState } from 'react';
import { QuestionType } from './QuestionTypesPanel';
import { GripVertical, Trash2, Copy, Settings } from 'lucide-react';

interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

interface QuestionRendererProps {
  question: SurveyQuestion;
  isPreview?: boolean;
  onUpdate?: (question: SurveyQuestion) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (question: SurveyQuestion) => void;
  dragHandleProps?: any;
}

export function QuestionRenderer({
  question,
  isPreview = false,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps
}: QuestionRendererProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localQuestion, setLocalQuestion] = useState(question);

  const handleSave = () => {
    onUpdate?.(localQuestion);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalQuestion(question);
    setIsEditing(false);
  };

  const addOption = () => {
    const newOption: QuestionOption = {
      id: crypto.randomUUID(),
      label: `Opción ${(localQuestion.options?.length || 0) + 1}`,
      value: `option_${(localQuestion.options?.length || 0) + 1}`
    };
    setLocalQuestion({
      ...localQuestion,
      options: [...(localQuestion.options || []), newOption]
    });
  };

  const updateOption = (id: string, label: string) => {
    setLocalQuestion({
      ...localQuestion,
      options: localQuestion.options?.map(opt =>
        opt.id === id ? { ...opt, label, value: label.toLowerCase().replace(/\s+/g, '_') } : opt
      )
    });
  };

  const removeOption = (id: string) => {
    setLocalQuestion({
      ...localQuestion,
      options: localQuestion.options?.filter(opt => opt.id !== id)
    });
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            disabled={!isPreview}
            placeholder={question.placeholder || 'Escribe tu respuesta...'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        );

      case 'textarea':
        return (
          <textarea
            disabled={!isPreview}
            placeholder={question.placeholder || 'Escribe tu respuesta...'}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 resize-none"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            disabled={!isPreview}
            min={question.min}
            max={question.max}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            disabled={!isPreview}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        );

      case 'select':
        return (
          <select
            disabled={!isPreview}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          >
            <option value="">Selecciona una opción...</option>
            {question.options?.map(opt => (
              <option key={opt.id} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={opt.value}
                  disabled={!isPreview}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={opt.value}
                  disabled={!isPreview}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'yesno':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="yes"
                disabled={!isPreview}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Sí</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="no"
                disabled={!isPreview}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        );

      case 'scale':
        const max = question.max || 5;
        return (
          <div className="flex gap-2">
            {Array.from({ length: max }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                type="button"
                disabled={!isPreview}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:border-blue-500 
                           hover:bg-blue-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent
                           transition-colors text-gray-700 font-medium"
              >
                {num}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isPreview) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-900">
            {question.title}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {question.description && (
            <p className="text-sm text-gray-500 mt-1">{question.description}</p>
          )}
        </div>
        {renderInput()}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border-2 transition-all ${
      isEditing ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header con controles */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div {...dragHandleProps} className="cursor-move text-gray-400 hover:text-gray-600">
          <GripVertical className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase">
          {question.type}
        </span>
        <div className="flex-1" />
        <button
          onClick={() => onDuplicate?.(question)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Duplicar"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`p-1.5 rounded transition-colors ${
            isEditing 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title="Editar"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete?.(question.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta
              </label>
              <input
                type="text"
                value={localQuestion.title}
                onChange={(e) => setLocalQuestion({ ...localQuestion, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
                placeholder="Escribe tu pregunta..."
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <input
                type="text"
                value={localQuestion.description || ''}
                onChange={(e) => setLocalQuestion({ ...localQuestion, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
                placeholder="Añade una descripción..."
              />
            </div>

            {/* Placeholder para textos */}
            {(localQuestion.type === 'text' || localQuestion.type === 'textarea') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto de ayuda (placeholder)
                </label>
                <input
                  type="text"
                  value={localQuestion.placeholder || ''}
                  onChange={(e) => setLocalQuestion({ ...localQuestion, placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Escribe tu respuesta aquí..."
                />
              </div>
            )}

            {/* Opciones para select, radio, checkbox */}
            {(localQuestion.type === 'select' || 
              localQuestion.type === 'radio' || 
              localQuestion.type === 'checkbox') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opciones
                </label>
                <div className="space-y-2">
                  {localQuestion.options?.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => updateOption(opt.id, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded 
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeOption(opt.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOption}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Añadir opción
                </button>
              </div>
            )}

            {/* Configuración de escala */}
            {localQuestion.type === 'scale' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escala máxima
                </label>
                <select
                  value={localQuestion.max || 5}
                  onChange={(e) => setLocalQuestion({ ...localQuestion, max: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>1 - 3</option>
                  <option value={5}>1 - 5</option>
                  <option value={7}>1 - 7</option>
                  <option value={10}>1 - 10</option>
                </select>
              </div>
            )}

            {/* Configuración de número */}
            {localQuestion.type === 'number' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mínimo
                  </label>
                  <input
                    type="number"
                    value={localQuestion.min || ''}
                    onChange={(e) => setLocalQuestion({ ...localQuestion, min: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo
                  </label>
                  <input
                    type="number"
                    value={localQuestion.max || ''}
                    onChange={(e) => setLocalQuestion({ ...localQuestion, max: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Requerido */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localQuestion.required}
                onChange={(e) => setLocalQuestion({ ...localQuestion, required: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Pregunta obligatoria</span>
            </label>

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 
                           hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 
                           rounded-lg transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-1">
              {question.title}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h4>
            {question.description && (
              <p className="text-sm text-gray-500 mb-3">{question.description}</p>
            )}
            <div className="opacity-60 pointer-events-none">
              {renderInput()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}