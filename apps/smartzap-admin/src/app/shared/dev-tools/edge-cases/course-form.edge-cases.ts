import { Store } from '@ngrx/store';
import { EdgeCase, EdgeCaseGroup } from '../dev-tools-overlay.component';
import * as LessonsActions from 'app/main/courses/store/actions/lessons.actions';
import { Content, Lesson, EVALUATIVE_TYPE_ID, SURVEY_TYPE_ID } from 'app/main/courses/model';

let _idCounter = 0;
function uid(): string {
  return `mock-form-${++_idCounter}-${Date.now()}`;
}

const LESSON_ID = 'mock-lesson-default';
const COURSE_ID = 'mock-course-default';

function fakeLesson(contents: Content[]): Lesson {
  return {
    id: LESSON_ID,
    name: 'Lição padrão',
    description: '',
    course_id: COURSE_ID,
    order: 1,
    contents,
  };
}

function fakeContent(overrides: Partial<Content> & { typeName: string }): Content {
  const { typeName, ...rest } = overrides;
  return {
    id: uid(),
    name: 'Conteúdo mockado',
    description: '',
    dispatch_in: 1,
    dispatch_period: 'MORNING',
    learn_content: uid(),
    lesson_id: LESSON_ID,
    order: 1,
    type_id: uid(),
    type: { id: uid(), name: typeName, description: typeName, image_url: '' },
    ...rest,
  };
}

function dispatch(store: Store, contents: Content[]): void {
  store.dispatch(LessonsActions.loadLessonsSuccess({ lessons: [fakeLesson(contents)] }));
}

export function getCourseFormEdgeCases(store: Store): EdgeCaseGroup[] {
  // ─── Estado ───────────────────────────────────────────────────────────────
  const stateCases: EdgeCase[] = [
    {
      label: 'Conteúdos: lista vazia',
      description: 'Etapa de conteúdos sem nenhum conteúdo adicionado',
      icon: 'table_rows_narrow',
      apply: () => dispatch(store, []),
    },
    {
      label: 'Conteúdos: carregando',
      description: 'Limpa o estado e simula o loading',
      icon: 'hourglass_empty',
      apply: () => store.dispatch(LessonsActions.clear()),
    },
    {
      label: 'Restaurar',
      description: 'Limpa os mocks — próxima navegação recarrega da API',
      icon: 'refresh',
      apply: () => store.dispatch(LessonsActions.clear()),
    },
  ];

  // ─── Tipos de arquivo ─────────────────────────────────────────────────────
  const fileTypeCases: EdgeCase[] = [
    {
      label: 'Apenas vídeos',
      description: '3 conteúdos de vídeo',
      icon: 'videocam',
      apply: () =>
        dispatch(store, [
          fakeContent({ typeName: 'video', name: 'Vídeo de Introdução', order: 1 }),
          fakeContent({ typeName: 'video', name: 'Vídeo de Conteúdo Principal', order: 2 }),
          fakeContent({ typeName: 'video', name: 'Vídeo de Encerramento', order: 3 }),
        ]),
    },
    {
      label: 'Apenas imagens',
      description: '3 conteúdos de imagem',
      icon: 'image',
      apply: () =>
        dispatch(store, [
          fakeContent({ typeName: 'image', name: 'Infográfico Parte 1', order: 1 }),
          fakeContent({ typeName: 'image', name: 'Infográfico Parte 2', order: 2 }),
          fakeContent({ typeName: 'image', name: 'Mapa Mental', order: 3 }),
        ]),
    },
    {
      label: 'Apenas PDFs',
      description: '3 conteúdos em PDF',
      icon: 'picture_as_pdf',
      apply: () =>
        dispatch(store, [
          fakeContent({ typeName: 'pdf', name: 'Manual do Colaborador', order: 1 }),
          fakeContent({ typeName: 'pdf', name: 'Política de Segurança', order: 2 }),
          fakeContent({ typeName: 'pdf', name: 'Regulamento Interno', order: 3 }),
        ]),
    },
    {
      label: 'Apenas podcasts',
      description: '3 conteúdos de áudio/podcast',
      icon: 'mic',
      apply: () =>
        dispatch(store, [
          fakeContent({ typeName: 'podcast', name: 'Episódio 1 — Boas-vindas', order: 1 }),
          fakeContent({ typeName: 'podcast', name: 'Episódio 2 — Fundamentos', order: 2 }),
          fakeContent({ typeName: 'podcast', name: 'Episódio 3 — Encerramento', order: 3 }),
        ]),
    },
  ];

  // ─── Quizzes ──────────────────────────────────────────────────────────────
  const quizCases: EdgeCase[] = [
    {
      label: 'Quiz avaliativo',
      description: 'Um conteúdo do tipo Quiz Avaliativo (Question)',
      icon: 'quiz',
      apply: () =>
        dispatch(store, [
          fakeContent({
            typeName: 'Question',
            type_id: EVALUATIVE_TYPE_ID,
            name: 'Quiz Avaliativo — Módulo 1',
            order: 1,
          }),
        ]),
    },
    {
      label: 'Quiz pesquisa',
      description: 'Um conteúdo do tipo Quiz Pesquisa (Survey Question)',
      icon: 'poll',
      apply: () =>
        dispatch(store, [
          fakeContent({
            typeName: 'Survey Question',
            type_id: SURVEY_TYPE_ID,
            name: 'Pesquisa de Satisfação',
            order: 1,
          }),
        ]),
    },
    {
      label: 'Ambos os quizzes',
      description: 'Avaliativo + Pesquisa juntos',
      icon: 'assignment',
      apply: () =>
        dispatch(store, [
          fakeContent({
            typeName: 'Question',
            type_id: EVALUATIVE_TYPE_ID,
            name: 'Quiz Avaliativo Final',
            order: 1,
          }),
          fakeContent({
            typeName: 'Survey Question',
            type_id: SURVEY_TYPE_ID,
            name: 'Pesquisa de Satisfação do Curso',
            order: 2,
          }),
        ]),
    },
  ];

  // ─── Mixes ────────────────────────────────────────────────────────────────
  const mixCases: EdgeCase[] = [
    {
      label: 'Mix completo de tipos',
      description: 'Vídeo + Imagem + PDF + Podcast + Quiz',
      icon: 'category',
      apply: () =>
        dispatch(store, [
          fakeContent({ typeName: 'video', name: 'Vídeo Introdutório', order: 1 }),
          fakeContent({ typeName: 'image', name: 'Infográfico do Módulo', order: 2 }),
          fakeContent({ typeName: 'pdf', name: 'Material de Apoio', order: 3 }),
          fakeContent({ typeName: 'podcast', name: 'Entrevista com Especialista', order: 4 }),
          fakeContent({
            typeName: 'Question',
            type_id: EVALUATIVE_TYPE_ID,
            name: 'Avaliação Final',
            order: 5,
          }),
        ]),
    },
    {
      label: 'Mix com descrições',
      description: 'Conteúdos com descrição preenchida',
      icon: 'notes',
      apply: () =>
        dispatch(store, [
          fakeContent({
            typeName: 'video',
            name: 'Vídeo de Onboarding',
            description: 'Vídeo de boas-vindas para novos colaboradores com apresentação da empresa e cultura.',
            order: 1,
          }),
          fakeContent({
            typeName: 'pdf',
            name: 'Guia de Integração',
            description: 'Manual completo com todas as informações necessárias para os primeiros 30 dias.',
            order: 2,
          }),
          fakeContent({
            typeName: 'Question',
            type_id: EVALUATIVE_TYPE_ID,
            name: 'Quiz de Conhecimento',
            description: 'Avaliação sobre os tópicos abordados no módulo introdutório.',
            order: 3,
          }),
        ]),
    },
    {
      label: 'Configurações de envio variadas',
      description: 'dispatch_in de 1, 3, 7 e 14 dias',
      icon: 'schedule_send',
      apply: () =>
        dispatch(store, [
          fakeContent({
            typeName: 'video',
            name: 'Conteúdo Dia 1',
            order: 1,
            dispatch_in: 1,
            dispatch_period: 'MORNING',
          }),
          fakeContent({
            typeName: 'pdf',
            name: 'Conteúdo Dia 3',
            order: 2,
            dispatch_in: 3,
            dispatch_period: 'AFTERNOON',
          }),
          fakeContent({
            typeName: 'image',
            name: 'Conteúdo Dia 7',
            order: 3,
            dispatch_in: 7,
            dispatch_period: 'NIGHT',
          }),
          fakeContent({
            typeName: 'podcast',
            name: 'Conteúdo Dia 14',
            order: 4,
            dispatch_in: 14,
            dispatch_period: 'MORNING',
          }),
        ]),
    },
  ];

  // ─── Dados extremos ───────────────────────────────────────────────────────
  const extremeCases: EdgeCase[] = [
    {
      label: 'Nomes longos',
      description: 'Testa overflow/truncamento de títulos',
      icon: 'text_fields',
      apply: () =>
        dispatch(store, [
          fakeContent({
            typeName: 'video',
            name: 'Introdução Completa ao Gerenciamento de Projetos com Metodologias Ágeis Scrum e Kanban para Equipes Distribuídas em Ambientes Corporativos',
            order: 1,
          }),
          fakeContent({
            typeName: 'pdf',
            name: 'Política de Segurança da Informação e Proteção de Dados Pessoais conforme Regulamentação LGPD e Normas ISO 27001',
            order: 2,
          }),
          fakeContent({
            typeName: 'Question',
            type_id: EVALUATIVE_TYPE_ID,
            name: 'Avaliação Final de Conhecimentos sobre Fundamentos de Compliance e Ética Corporativa para Gestores',
            order: 3,
          }),
        ]),
    },
    {
      label: '15 conteúdos (scroll)',
      description: 'Lista longa para testar scroll e performance',
      icon: 'format_list_numbered',
      apply: () => {
        const types = ['video', 'image', 'pdf', 'podcast'];
        const names = ['Vídeo', 'Imagem', 'PDF', 'Podcast'];
        const contents = Array.from({ length: 15 }, (_, i) => {
          const t = i % 4;
          return fakeContent({
            typeName: types[t],
            name: `${names[t]} — Módulo ${Math.floor(i / 4) + 1}, Parte ${(i % 4) + 1}`,
            order: i + 1,
            dispatch_in: i + 1,
          });
        });
        dispatch(store, contents);
      },
    },
    {
      label: 'Um único conteúdo',
      description: 'Lista com apenas um item',
      icon: 'looks_one',
      apply: () => dispatch(store, [fakeContent({ typeName: 'video', name: 'Único Conteúdo do Curso', order: 1 })]),
    },
  ];

  return [
    { title: 'Estado dos conteúdos', cases: stateCases },
    { title: 'Tipos de arquivo', cases: fileTypeCases },
    { title: 'Quizzes', cases: quizCases },
    { title: 'Mixes e combinações', cases: mixCases },
    { title: 'Dados extremos', cases: extremeCases },
  ];
}
