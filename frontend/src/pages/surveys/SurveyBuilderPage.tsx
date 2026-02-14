import { useNavigate, useParams } from 'react-router-dom';
import { SurveyBuilder } from '../../components/survey-builder';

export function SurveyBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // TODO: Cargar encuesta existente si estamos editando
  const initialSurvey = isEditing ? undefined : undefined;

  const handleSave = (survey: any) => {
    console.log('Guardando encuesta:', survey);
    // TODO: Implementar llamada a API
    // await api.post('/surveys', survey);
    navigate('/surveys');
  };

  const handlePublish = (survey: any) => {
    console.log('Publicando encuesta:', survey);
    // TODO: Implementar llamada a API
    // await api.post('/surveys', { ...survey, status: 'published' });
    navigate('/surveys');
  };

  const handleCancel = () => {
    navigate('/surveys');
  };

  return (
    <SurveyBuilder
      initialSurvey={initialSurvey}
      onSave={handleSave}
      onPublish={handlePublish}
      onCancel={handleCancel}
    />
  );
}