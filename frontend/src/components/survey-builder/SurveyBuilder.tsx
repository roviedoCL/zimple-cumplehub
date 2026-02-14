import { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QuestionTypesPanel, QuestionType } from './QuestionTypesPanel';
import { QuestionRenderer, SurveyQuestion } from './QuestionRenderer';
import { Eye, Save, Play, ArrowLeft, Plus } from 'lucide-react';

interface SurveyBuilderProps {
  initialSurvey?: {
    id?: string;
    title: string;
    description?: string;
    questions: SurveyQuestion[];
  };
  onSave?: (survey: any) => void;
  onPublish?: (survey: any) => void;
  onCancel?: () => void;
}

function SortableQuestion({ 
  question, 
  onUpdate, 
  onDelete, 
  onDuplicate 
}: { 
  question: SurveyQuestion; 
  onUpdate: (q: SurveyQuestion) => void;
  onDelete: (id: string) => void;
  onDuplicate: (q: SurveyQuestion) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <QuestionRenderer
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function SurveyBuilder({ 
  initialSurvey, 
  onSave, 
  onPublish, 
  onCancel 
}: SurveyBuilderProps) {
  const [title, setTitle] = useState(initialSurvey?.title || 'Nueva Encuesta');
  const [description, setDescription] = useState(initialSurvey?.description || '');
  const [questions, setQuestions] = useState<SurveyQuestion[]>(initialSurvey?.questions || []);
  const [isPreview, setIsPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createDefaultQuestion = (type: QuestionType): SurveyQuestion => {
    const baseQuestion: SurveyQuestion = {
      id: crypto.randomUUID(),
      type,
      title: getDefaultTitle(type),
      required: false,
    };

    switch (type) {
      case 'select':
      case 'multiselect':
      case 'radio':
      case 'checkbox':
        return {
          ...baseQuestion,
          options: [
            { id: crypto.randomUUID(), label: 'Opción 1', value: 'opcion_1' },
            { id: crypto.randomUUID(), label: 'Opción 2', value: 'opcion_2' },
            { id: crypto.randomUUID(), label: 'Opción 3', value: 'opcion_3' }
          ]
        };
      case 'scale':
        return { ...baseQuestion, max: 5 };
      case 'text':
        return { ...baseQuestion, placeholder: 'Escribe tu respuesta...' };
      case 'textarea':
        return { ...baseQuestion, placeholder: 'Escribe tu respuesta detallada...' };
      default:
        return baseQuestion;
    }
  };

  const getDefaultTitle = (type: QuestionType): string => {
    const titles: Record<QuestionType, string> = {
      text: '¿Cuál es tu respuesta?',
      textarea: '¿Puedes describirlo con más detalle?',
      select: 'Selecciona una opción',
      multiselect: 'Selecciona todas las que apliquen',
      radio: 'Elige una opción',
      checkbox: 'Selecciona las opciones que apliquen',
      yesno: '¿Estás de acuerdo?',
      scale: '¿Qué tan satisfecho estás?',
      date: '¿Qué fecha prefieres?',
      number: '¿Cuántos años tienes?'
    };
    return titles[type];
  };

  const handleDragStart = useCallback((_type: QuestionType) => {
    // El tipo se maneja a través de dataTransfer en el evento
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const type = e.dataTransfer.getData('questionType') as QuestionType;
    if (type) {
      const newQuestion = createDefaultQuestion(type);
      setQuestions(prev => [...prev, newQuestion]);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleUpdateQuestion = useCallback((updatedQuestion: SurveyQuestion) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  }, []);

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }, []);

  const handleDuplicateQuestion = useCallback((question: SurveyQuestion) => {
    const duplicated: SurveyQuestion = {
      ...question,
      id: crypto.randomUUID(),
      title: `${question.title} (copia)`,
      options: question.options?.map(opt => ({
        ...opt,
        id: crypto.randomUUID()
      }))
    };
    setQuestions(prev => [...prev, duplicated]);
  }, []);

  const handleSave = () => {
    onSave?.({
      id: initialSurvey?.id,
      title,
      description,
      questions,
      updatedAt: new Date().toISOString()
    });
  };

  const handlePublish = () => {
    onPublish?.({
      id: initialSurvey?.id,
      title,
      description,
      questions,
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onCancel}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-none 
                             focus:ring-0 p-0 placeholder-gray-400"
                  placeholder="Título de la encuesta"
                />
                <p className="text-sm text-gray-500">
                  {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPreview 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-4 h-4" />
                {isPreview ? 'Editar' : 'Vista previa'}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 
                           rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                           rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar - Solo visible en modo edición */}
          {!isPreview && (
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-24">
                <QuestionTypesPanel onDragStart={handleDragStart} />
              </div>
            </div>
          )}

          {/* Main Area */}
          <div className={`col-span-12 ${isPreview ? '' : 'lg:col-span-9'}`}>
            {/* Survey Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              {isPreview ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                  {description && <p className="text-gray-600">{description}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título de la encuesta
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Encuesta de satisfacción del cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe el propósito de esta encuesta..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Questions Area */}
            {isPreview ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionRenderer 
                    key={question.id} 
                    question={question} 
                    isPreview 
                  />
                ))}
                {questions.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No hay preguntas en esta encuesta</p>
                  </div>
                )}
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`min-h-[400px] rounded-lg transition-all ${
                      isDragOver 
                        ? 'bg-blue-50 border-2 border-dashed border-blue-400' 
                        : questions.length === 0 
                          ? 'bg-gray-50 border-2 border-dashed border-gray-300' 
                          : ''
                    }`}
                  >
                    {questions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-96">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Comienza a crear tu encuesta
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-4">
                          Arrastra los tipos de preguntas desde el panel izquierdo 
                          o haz clic en el botón de abajo para añadir tu primera pregunta.
                        </p>
                        <button
                          onClick={() => {
                            const newQuestion = createDefaultQuestion('text');
                            setQuestions([newQuestion]);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                                     rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Añadir pregunta de texto
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question) => (
                          <SortableQuestion
                            key={question.id}
                            question={question}
                            onUpdate={handleUpdateQuestion}
                            onDelete={handleDeleteQuestion}
                            onDuplicate={handleDuplicateQuestion}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Add Question Button - Solo en modo edición */}
            {!isPreview && questions.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    const newQuestion = createDefaultQuestion('text');
                    setQuestions([...questions, newQuestion]);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed 
                             border-gray-300 text-gray-600 rounded-lg font-medium 
                             hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Añadir otra pregunta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyBuilder;