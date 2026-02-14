# Survey Builder - Módulo de Encuestas Visual

## Descripción

El Survey Builder es un módulo independiente que permite crear y editar encuestas de forma visual e intuitiva, diseñado para usuarios no técnicos.

## Características

### ✅ Tipos de Preguntas Disponibles

1. **Texto corto** - Respuesta en una línea
2. **Texto largo** - Respuesta en párrafo
3. **Lista desplegable** - Selección de una opción
4. **Opción única** (Radio) - Seleccionar solo una
5. **Selección múltiple** (Checkbox) - Seleccionar varias
6. **Sí / No** - Respuesta binaria
7. **Escala** - Calificación 1-5, 1-7 o 1-10
8. **Número** - Valor numérico con mínimo y máximo
9. **Fecha** - Selector de fecha

### ✅ Funcionalidades

- **Arrastrar y soltar** - Agrega preguntas arrastrándolas desde el panel lateral
- **Reordenar** - Cambia el orden de las preguntas con drag & drop
- **Edición inline** - Edita cada pregunta haciendo clic en el ícono de configuración
- **Vista previa** - Visualiza cómo se verá la encuesta antes de publicar
- **Duplicar** - Crea copias de preguntas existentes
- **Eliminar** - Elimina preguntas individualmente
- **Obligatorio/Opcional** - Marca preguntas como requeridas

## Uso

### Crear una Nueva Encuesta

1. Navega a `/surveys` y haz clic en "Diseñador Visual"
2. Arrastra los tipos de preguntas desde el panel izquierdo
3. Haz clic en el ícono de configuración para editar cada pregunta
4. Configura el título, descripción y opciones según sea necesario
5. Usa "Vista previa" para ver cómo se verá la encuesta
6. Guarda o publica la encuesta

### Editar una Encuesta Existente

1. Navega a `/surveys/builder/:id` (reemplaza :id con el ID de la encuesta)
2. Realiza los cambios necesarios
3. Guarda los cambios

## Estructura de Datos

```typescript
interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];  // Para select, radio, checkbox
  min?: number;                // Para números
  max?: number;                // Para números y escala
  placeholder?: string;        // Para textos
}

interface QuestionOption {
  id: string;
  label: string;
  value: string;
}
```

## Componentes

- `SurveyBuilder` - Componente principal
- `QuestionTypesPanel` - Panel lateral con tipos de preguntas
- `QuestionRenderer` - Renderizador de preguntas individual
- `SortableQuestion` - Wrapper para drag & drop

## Dependencias

```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

## Integración con API

El componente espera las siguientes props:

```typescript
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
```

## Próximas Mejoras

- [ ] Plantillas predefinidas (Clima Laboral, NPS, etc.)
- [ ] Lógica condicional (mostrar/ocultar preguntas)
- [ ] Validaciones personalizadas
- [ ] Importar/Exportar encuestas (JSON)
- [ ] Colaboración en tiempo real
- [ ] Historial de versiones