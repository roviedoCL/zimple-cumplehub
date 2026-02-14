import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles,
  Loader2,
  Paperclip,
  Mic,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '¡Hola! Soy tu asistente de IA para Zimple CumpleHub. Puedo ayudarte con:\n\n📊 **Análisis de Encuestas** - Interpretar resultados y generar insights\n📋 **Compliance** - Responder preguntas sobre políticas y normativas\n📝 **Redacción** - Ayudar con documentos y comunicaciones\n💡 **Recomendaciones** - Sugerir acciones basadas en datos\n\n¿En qué puedo ayudarte hoy?',
    timestamp: new Date()
  }
];

const quickActions = [
  { label: 'Analizar última encuesta', icon: '📊' },
  { label: 'Generar reporte de compliance', icon: '📋' },
  { label: 'Redactar comunicado', icon: '✍️' },
  { label: 'Ver tendencias', icon: '📈' },
];

export function AIAgentPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simular respuesta del agente (en producción esto irá al backend de LangGraph)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'encuesta': '📊 He analizado los datos de tu última encuesta de clima laboral. Aquí hay algunos insights clave:\n\n✅ **Punto fuerte:** 85% de satisfacción con el liderazgo\n⚠️ **Área de mejora:** Comunicación interdepartamental (62%)\n💡 **Recomendación:** Implementar reuniones semanales cross-funcionales',
        'denuncia': '📋 Entiendo que necesitas ayuda con una denuncia. Puedo guiarte en el proceso:\n\n1. **Documenta los hechos** con fechas y detalles específicos\n2. **Preserva evidencias** (correos, mensajes, testigos)\n3. **Usa el canal apropiado** según la gravedad\n4. **Mantén confidencialidad** durante la investigación\n\n¿Necesitas que te ayude a redactar el informe?',
        'reporte': '📊 Generando reporte de compliance...\n\n**📈 Resumen del último trimestre:**\n• 12 denuncias recibidas\n• 8 resueltas (67%)\n• Tiempo promedio de resolución: 10 días\n• Área más afectada: Operaciones\n\n**💡 Recomendaciones:**\n• Reforzar capacitación en código de ética\n• Implementar check-ins mensuales',
        'default': '🚀 Estoy en modo **DEMO**. En la versión completa con LangGraph, podré:\n\n• Procesar documentos y datos en tiempo real\n• Generar análisis predictivos avanzados\n• Crear flujos de trabajo automatizados\n• Integrarme con todas las APIs del sistema\n\n¿Te gustaría que simule alguna funcionalidad específica?'
      };

      const lowerInput = input.toLowerCase();
      let response = responses.default;
      
      if (lowerInput.includes('encuesta') || lowerInput.includes('clima')) {
        response = responses.encuesta;
      } else if (lowerInput.includes('denuncia') || lowerInput.includes('compliance')) {
        response = responses.denuncia;
      } else if (lowerInput.includes('reporte') || lowerInput.includes('análisis')) {
        response = responses.reporte;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => handleSend(), 100);
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar */}
      <div className={`${showHistory ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Historial</h3>
              <button 
                onClick={clearChat}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Limpiar conversación"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-indigo-50 rounded-lg cursor-pointer">
                <p className="text-sm font-medium text-gray-900">Conversación actual</p>
                <p className="text-xs text-gray-500">Hoy</p>
              </div>
              <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <p className="text-sm text-gray-700">Análisis Q4 2025</p>
                <p className="text-xs text-gray-500">Ayer</p>
              </div>
              <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <p className="text-sm text-gray-700">Reporte de compliance</p>
                <p className="text-xs text-gray-500">Hace 3 días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-white hover:bg-white/20 rounded-lg mr-2"
              >
                {showHistory ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold text-white">Agente IA CumpleHub</h2>
                <p className="text-xs text-indigo-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Demo Mode - LangGraph Ready
                </p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-indigo-600 ml-2' : 'bg-gradient-to-br from-indigo-500 to-purple-500 mr-2'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white shadow-sm border border-gray-200 rounded-bl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mr-2 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-200 rounded-bl-none">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-full text-sm whitespace-nowrap transition-colors"
                >
                  <span className="mr-1">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                <Mic className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje... (Shift+Enter para nueva línea)"
                  rows={1}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className="px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              🚀 Demo: En producción se conectará con LangGraph para procesamiento avanzado
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
