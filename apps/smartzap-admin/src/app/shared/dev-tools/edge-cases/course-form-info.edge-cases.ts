import { Store } from '@ngrx/store';
import { EdgeCase, EdgeCaseGroup } from '../dev-tools-overlay.component';
import * as CourseActions from 'app/main/courses/store/actions/course.actions';
import { Course } from 'app/main/courses/model';

const MOCK_COURSE_ID = 'mock-info-001';

function fakeCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: MOCK_COURSE_ID,
    name: 'Curso de Onboarding',
    description: 'Curso de boas-vindas para novos colaboradores da empresa.',
    lang: 'pt-BR',
    category_id: '',
    is_active: true,
    content_performance_weight: 5,
    quiz_performance_weight: 5,
    disable_send_certificate: false,
    ...overrides,
  };
}

function dispatchCourse(store: Store, course: Course): void {
  store.dispatch(CourseActions.loadCourseSuccess({ course, isOwner: true }));
}

export function getCourseFormInfoEdgeCases(store: Store): EdgeCaseGroup[] {
  // ─── Estado ───────────────────────────────────────────────────────────────
  const stateCases: EdgeCase[] = [
    {
      label: 'Carregando',
      description: 'Ativa o spinner de loading — efeito imediato',
      icon: 'hourglass_empty',
      apply: () => store.dispatch(CourseActions.loadCourse({ id: MOCK_COURSE_ID })),
    },
    {
      label: 'Novo curso (em branco)',
      description: 'Reseta o store; renavegar para ver o formulário em branco',
      icon: 'note_add',
      apply: () => store.dispatch(CourseActions.clearSelectedCourse()),
    },
    {
      label: 'Restaurar',
      description: 'Limpa os mocks — próxima navegação recarrega da API',
      icon: 'refresh',
      apply: () => store.dispatch(CourseActions.clearSelectedCourse()),
    },
  ];

  // ─── Modos de avaliação ───────────────────────────────────────────────────
  const assessmentCases: EdgeCase[] = [
    {
      label: 'Avaliação: misto (padrão)',
      description: 'Conteúdo 5 + Quiz 5 — seleciona "Misto" no formulário',
      icon: 'balance',
      apply: () => dispatchCourse(store, fakeCourse({ content_performance_weight: 5, quiz_performance_weight: 5 })),
    },
    {
      label: 'Avaliação: apenas conteúdo',
      description: 'Conteúdo 10 + Quiz 0 — seleciona "Apenas conteúdo"',
      icon: 'play_circle',
      apply: () => dispatchCourse(store, fakeCourse({ content_performance_weight: 10, quiz_performance_weight: 0 })),
    },
    {
      label: 'Avaliação: apenas quiz',
      description: 'Conteúdo 0 + Quiz 10 — seleciona "Apenas quiz"',
      icon: 'quiz',
      apply: () => dispatchCourse(store, fakeCourse({ content_performance_weight: 0, quiz_performance_weight: 10 })),
    },
  ];

  // ─── Campos opcionais ─────────────────────────────────────────────────────
  const optionalFieldCases: EdgeCase[] = [
    {
      label: 'Com mensagem WhatsApp',
      description: 'message_description preenchida com texto de boas-vindas',
      icon: 'chat',
      apply: () =>
        dispatchCourse(
          store,
          fakeCourse({
            message_description:
              'Olá! Você acaba de ser matriculado no curso *Onboarding*. Acesse agora e comece sua jornada! 🚀',
          }),
        ),
    },
    {
      label: 'Sem mensagem WhatsApp',
      description: 'message_description vazia — campo opcional em branco',
      icon: 'chat_bubble_outline',
      apply: () => dispatchCourse(store, fakeCourse({ message_description: '' })),
    },
    {
      label: 'Certificado desabilitado',
      description: 'disable_send_certificate: true — toggle deve aparecer ativo',
      icon: 'workspace_premium',
      apply: () => dispatchCourse(store, fakeCourse({ disable_send_certificate: true })),
    },
    {
      label: 'Curso inativo',
      description: 'is_active: false — curso desativado',
      icon: 'visibility_off',
      apply: () => dispatchCourse(store, fakeCourse({ is_active: false })),
    },
  ];

  // ─── Dados extremos ───────────────────────────────────────────────────────
  const extremeCases: EdgeCase[] = [
    {
      label: 'Nome no limite (100 chars)',
      description: 'Testa truncamento e contador de caracteres do campo nome',
      icon: 'text_fields',
      apply: () =>
        dispatchCourse(
          store,
          fakeCourse({
            name: 'Programa Completo de Desenvolvimento de Liderança Estratégica para Gestores de Alta Performance',
          }),
        ),
    },
    {
      label: 'Descrição no limite (200 chars)',
      description: 'Testa o contador e validação de 200 chars na descrição',
      icon: 'notes',
      apply: () =>
        dispatchCourse(
          store,
          fakeCourse({
            description:
              'Este curso abrange todos os aspectos fundamentais do onboarding corporativo, incluindo cultura organizacional, políticas internas, ferramentas utilizadas e expectativas de performance para novos integrantes.',
          }),
        ),
    },
    {
      label: 'Todos os campos no máximo',
      description: 'Nome 100 chars + Descrição 200 chars + descrição curta 120 chars',
      icon: 'data_usage',
      apply: () =>
        dispatchCourse(
          store,
          fakeCourse({
            name: 'Programa Completo de Desenvolvimento de Liderança Estratégica para Gestores de Alta Performance',
            description:
              'Este curso abrange todos os aspectos fundamentais do onboarding corporativo, incluindo cultura organizacional, políticas internas, ferramentas utilizadas e expectativas de performance para novos integrantes.',
            message_description:
              'Você foi matriculado no curso *Programa Completo de Desenvolvimento*. Acesse e inicie sua trilha agora.',
            disable_send_certificate: true,
            content_performance_weight: 10,
            quiz_performance_weight: 0,
          }),
        ),
    },
  ];

  return [
    { title: 'Estado do formulário', cases: stateCases },
    { title: 'Modos de avaliação', cases: assessmentCases },
    { title: 'Campos opcionais', cases: optionalFieldCases },
    { title: 'Dados extremos', cases: extremeCases },
  ];
}
