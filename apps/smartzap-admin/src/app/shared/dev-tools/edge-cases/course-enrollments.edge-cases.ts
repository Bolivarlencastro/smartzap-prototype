import { Store } from '@ngrx/store';
import { EdgeCase, EdgeCaseGroup } from '../dev-tools-overlay.component';
import * as EnrollmentsActions from 'app/main/courses/store/actions/enrollments.actions';
import * as TrackingActions from 'app/main/courses/store/actions/tracking.action';
import { Enrollment } from 'app/main/courses/model';
import { Tracking } from 'app/main/courses/model/tracking';

let _idCounter = 0;
function uid(): string {
  return `mock-enroll-${++_idCounter}-${Date.now()}`;
}

function fakeEnrollment(overrides: Partial<Enrollment>): Enrollment {
  const id = uid();
  return {
    id,
    workspace_id: 'ws-mock',
    course_id: 'course-mock',
    course: { id: 'course-mock', name: 'Curso Mockado' },
    user_id: uid(),
    user: {
      id: uid(),
      email: 'usuario@empresa.com',
      name: 'Usuário Teste',
      phone: '+5511999999999',
      tags: '',
    },
    status: 'STARTED',
    progress: 50,
    performance: 0.75,
    points: '100',
    start_date: '2024-01-10T10:00:00Z',
    end_date: '2024-06-30T23:59:59Z',
    created_on: '2024-01-10T10:00:00Z',
    created: '2024-01-10T10:00:00Z',
    updated: '2024-01-10T10:00:00Z',
    current_content: 'Conteúdo atual',
    current_content_id: uid(),
    current_lesson: null as any,
    current_lesson_id: '',
    timezone: 'America/Sao_Paulo',
    selected: false,
    messages_pending_count: 0,
    messages_sent_count: 0,
    ...overrides,
  };
}

export function getCourseEnrollmentsEdgeCases(store: Store): EdgeCaseGroup[] {
  const listStateCases: EdgeCase[] = [
    {
      label: 'Lista vazia',
      description: 'Nenhuma matrícula — testa o estado empty',
      icon: 'table_rows_narrow',
      apply: () => {
        store.dispatch(EnrollmentsActions.clear());
        store.dispatch(
          EnrollmentsActions.loadEnrollmentsSuccess({
            payload: { collection: [], page: { count: 0, page: 1, per_page: 10, total_pages: 0 } },
          }),
        );
      },
    },
    {
      label: 'Carregando',
      description: 'Exibe skeleton / spinner de loading',
      icon: 'hourglass_empty',
      apply: () => store.dispatch(EnrollmentsActions.loadEnrollments()),
    },
    {
      label: 'Restaurar',
      description: 'Recarrega matrículas da API',
      icon: 'refresh',
      apply: () => store.dispatch(EnrollmentsActions.refreshEnrollments({ course_id: '' })),
    },
  ];

  const statusCases: EdgeCase[] = [
    {
      label: 'Todos os status',
      description: 'STARTED, WAITING e REFUSED juntos',
      icon: 'category',
      apply: () =>
        store.dispatch(
          EnrollmentsActions.loadEnrollmentsSuccess({
            payload: {
              collection: [
                fakeEnrollment({
                  status: 'STARTED',
                  user: { email: 'ativo@empresa.com', name: 'Ana Ativa', phone: '+5511999991111', tags: '' },
                  progress: 65,
                  performance: 0.82,
                  messages_sent_count: 14,
                  messages_pending_count: 3,
                }),
                fakeEnrollment({
                  status: 'WAITING',
                  user: {
                    email: 'aguardando@empresa.com',
                    name: 'Bruno Aguardando',
                    phone: '+5511999992222',
                    tags: '',
                  },
                  progress: 0,
                  performance: 0,
                  messages_sent_count: 0,
                  messages_pending_count: 0,
                }),
                fakeEnrollment({
                  status: 'REFUSED',
                  user: { email: 'recusado@empresa.com', name: 'Carla Recusada', phone: '+5511999993333', tags: '' },
                  progress: 30,
                  performance: 0.4,
                  messages_sent_count: 5,
                  messages_pending_count: 0,
                }),
              ],
              page: { count: 3, page: 1, per_page: 10, total_pages: 1 },
            },
          }),
        ),
    },
    {
      label: 'Progresso variado',
      description: '0%, 25%, 50%, 75%, 100% de progresso',
      icon: 'bar_chart',
      apply: () =>
        store.dispatch(
          EnrollmentsActions.loadEnrollmentsSuccess({
            payload: {
              collection: [0, 25, 50, 75, 100].map((progress) =>
                fakeEnrollment({
                  status: progress === 100 ? 'STARTED' : 'STARTED',
                  progress,
                  performance: progress / 100,
                  points: String(progress * 10),
                  user: {
                    email: `progresso${progress}@empresa.com`,
                    name: `Usuário ${progress}%`,
                    phone: '+5511999990000',
                    tags: '',
                  },
                  certificate_url: progress === 100 ? 'https://certificado.exemplo.com/cert-mock.pdf' : undefined,
                }),
              ),
              page: { count: 5, page: 1, per_page: 10, total_pages: 1 },
            },
          }),
        ),
    },
  ];

  const dataCases: EdgeCase[] = [
    {
      label: 'Nomes e dados longos',
      description: 'Testa overflow em nome, e-mail e tags',
      icon: 'text_fields',
      apply: () =>
        store.dispatch(
          EnrollmentsActions.loadEnrollmentsSuccess({
            payload: {
              collection: [
                fakeEnrollment({
                  status: 'STARTED',
                  progress: 48,
                  messages_sent_count: 9999,
                  messages_pending_count: 9999,
                  user: {
                    email: 'maria.aparecida.dos.santos.rodrigues@departamento.empresa-grupo.com.br',
                    name: 'Maria Aparecida dos Santos Rodrigues da Silva Pereira de Albuquerque',
                    phone: '+55119999999999',
                    tags: 'gerente,financeiro,sp,matriz,liderança,compliance,nivel-3,board',
                  },
                }),
                fakeEnrollment({
                  status: 'REFUSED',
                  progress: 10,
                  messages_sent_count: 2,
                  messages_pending_count: 0,
                  user: {
                    email: 'joao.antonio.carvalho.de.albuquerque@filial-rj.grupo-empresarial.com.br',
                    name: 'João Antônio Carvalho de Albuquerque Neto Júnior',
                    phone: '+5521888881111',
                    tags: 'coordenador,ti,rj,segurança,suporte,nível-2',
                  },
                }),
              ],
              page: { count: 2, page: 1, per_page: 10, total_pages: 1 },
            },
          }),
        ),
    },
    {
      label: 'Paginação cheia (10 matrículas)',
      description: 'Simula página completa com múltiplas páginas',
      icon: 'format_list_bulleted',
      apply: () => {
        const statuses = ['STARTED', 'WAITING', 'REFUSED'] as const;
        const names = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Felipe', 'Giovana', 'Hugo', 'Isa', 'João'];
        const enrollments = names.map((name, i) =>
          fakeEnrollment({
            status: statuses[i % 3],
            progress: (i + 1) * 10,
            performance: ((i + 1) * 10) / 100,
            messages_sent_count: (i + 1) * 3,
            messages_pending_count: i % 3,
            user: {
              email: `${name.toLowerCase()}@empresa.com`,
              name: `${name} Sobrenome`,
              phone: `+551199999${String(i).padStart(4, '0')}`,
              tags: i % 2 === 0 ? 'colaborador,sp' : 'gestor,rj',
            },
          }),
        );
        store.dispatch(
          EnrollmentsActions.loadEnrollmentsSuccess({
            payload: { collection: enrollments, page: { count: 47, page: 1, per_page: 10, total_pages: 5 } },
          }),
        );
      },
    },
  ];

  const trackingDialogCases: EdgeCase[] = [
    {
      label: 'Atividades: lista vazia',
      description: 'Dialog de atividades sem conteúdo acessado',
      icon: 'inbox',
      apply: () => store.dispatch(TrackingActions.loadTrackingEnrolmentSuccess({ trackings: [] })),
    },
    {
      label: 'Atividades: carregando',
      description: 'Dialog de atividades com spinner',
      icon: 'hourglass_empty',
      apply: () => store.dispatch(TrackingActions.loadTrackingEnrolment({ id: 'mock-loading' })),
    },
    {
      label: 'Atividades: todos os status',
      description: 'Vídeo, quiz, PDF — vários status',
      icon: 'playlist_add_check',
      apply: () =>
        store.dispatch(
          TrackingActions.loadTrackingEnrolmentSuccess({
            trackings: [
              fakeTracking({
                schedule_status: 'COMPLETED',
                content: { id: '1', name: 'Vídeo Introdutório', type: { id: '1', name: 'video' } },
              }),
              fakeTracking({
                schedule_status: 'STARTED',
                content: { id: '2', name: 'Quiz de Conhecimento', type: { id: '2', name: 'quiz' } },
                total_correct_answers: 3,
                total_questions: 10,
              }),
              fakeTracking({
                schedule_status: 'NOT_STARTED',
                first_access: null,
                last_access: null,
                content: { id: '3', name: 'Material em PDF', type: { id: '3', name: 'pdf' } },
              }),
              fakeTracking({
                schedule_status: 'COMPLETED',
                content: { id: '4', name: 'Webinar ao Vivo', type: { id: '4', name: 'live' } },
              }),
            ],
          }),
        ),
    },
    {
      label: 'Atividades: títulos longos',
      description: 'Testa truncamento de nomes de conteúdo',
      icon: 'text_fields',
      apply: () =>
        store.dispatch(
          TrackingActions.loadTrackingEnrolmentSuccess({
            trackings: [
              fakeTracking({
                content: {
                  id: '1',
                  name: 'Introdução ao Gerenciamento de Projetos Ágeis com Scrum e Kanban para Equipes Distribuídas',
                  type: { id: '1', name: 'video' },
                },
              }),
              fakeTracking({
                content: {
                  id: '2',
                  name: 'Fundamentos de Inteligência Artificial e Machine Learning para Desenvolvedores Web Modernos',
                  type: { id: '2', name: 'quiz' },
                },
              }),
            ],
          }),
        ),
    },
    {
      label: 'Atividades: 10 itens',
      description: 'Lista completa com diversos tipos de conteúdo',
      icon: 'format_list_numbered',
      apply: () =>
        store.dispatch(
          TrackingActions.loadTrackingEnrolmentSuccess({
            trackings: Array.from({ length: 10 }, (_, i) =>
              fakeTracking({
                content: {
                  id: String(i + 1),
                  name: `Conteúdo ${i + 1} — ${['Vídeo', 'Quiz', 'PDF', 'Live', 'Artigo'][i % 5]}`,
                  type: { id: String((i % 5) + 1), name: ['video', 'quiz', 'pdf', 'live', 'article'][i % 5] },
                },
                schedule_status: ['COMPLETED', 'STARTED', 'NOT_STARTED'][i % 3],
                first_access: i % 3 === 2 ? null : '2024-01-15T10:30:00',
                last_access: i % 3 === 2 ? null : `2024-0${(i % 9) + 1}-20T14:00:00`,
                total_correct_answers: i % 3 === 2 ? 0 : i + 1,
                total_questions: 10,
              }),
            ),
          }),
        ),
    },
  ];

  return [
    { title: 'Estado da lista', cases: listStateCases },
    { title: 'Status das matrículas', cases: statusCases },
    { title: 'Dados extremos', cases: dataCases },
    { title: 'Dialog: Atividades do usuário', cases: trackingDialogCases },
  ];
}

let _trackingCounter = 0;

function fakeTracking(overrides: Partial<Tracking & { content: any }> = {}): Tracking {
  return {
    idGenerated: ++_trackingCounter,
    content_name: 'Conteúdo de Exemplo',
    content_type: { id: '1', name: 'video' },
    first_access: '2024-02-10T09:00:00',
    last_access: '2024-03-20T14:30:00',
    duration: 3600,
    content_duration: 7200,
    learn_duration: 3600,
    total_correct_answers: 8,
    total_questions: 10,
    schedule_status: 'COMPLETED',
    content: { id: '1', name: 'Conteúdo de Exemplo', type: { id: '1', name: 'video' } },
    ...overrides,
  };
}
