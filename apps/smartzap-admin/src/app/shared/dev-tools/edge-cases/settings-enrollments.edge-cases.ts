import { Store } from '@ngrx/store';
import { EdgeCase, EdgeCaseGroup } from '../dev-tools-overlay.component';
import * as SettingsEnrollmentsActions from 'app/main/settings/store/actions/enrollments.actions';
import { Enrollment } from 'app/main/courses/model';

let _idCounter = 0;
function uid(): string {
  return `mock-se-${++_idCounter}-${Date.now()}`;
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

export function getSettingsEnrollmentsEdgeCases(store: Store): EdgeCaseGroup[] {
  const listStateCases: EdgeCase[] = [
    {
      label: 'Lista vazia',
      description: 'Nenhuma matrícula — testa o estado empty',
      icon: 'table_rows_narrow',
      apply: () => {
        store.dispatch(
          SettingsEnrollmentsActions.loadEnrollmentsSuccess({
            payload: { collection: [], page: { count: 0, page: 1, per_page: 10, total_pages: 0 } },
          }),
        );
      },
    },
    {
      label: 'Carregando',
      description: 'Exibe skeleton / spinner de loading',
      icon: 'hourglass_empty',
      apply: () => store.dispatch(SettingsEnrollmentsActions.loadEnrollmentsAndStatistics()),
    },
    {
      label: 'Restaurar',
      description: 'Recarrega matrículas e estatísticas da API',
      icon: 'refresh',
      apply: () => store.dispatch(SettingsEnrollmentsActions.loadEnrollmentsAndStatistics()),
    },
  ];

  const statisticsCases: EdgeCase[] = [
    {
      label: 'Estatísticas zeradas',
      description: 'Todos os contadores em zero',
      icon: 'exposure_zero',
      apply: () =>
        store.dispatch(
          SettingsEnrollmentsActions.loadStatisticsSuccess({
            payload: {
              totalUsers: 0,
              totalSentMessages: 0,
              startedEnrollments: 0,
              waitingEnrollments: 0,
              totalPendingMessages: 0,
              totalSentMessagesPeriod: 0,
            },
          }),
        ),
    },
    {
      label: 'Estatísticas grandes',
      description: 'Contadores com valores expressivos',
      icon: 'trending_up',
      apply: () =>
        store.dispatch(
          SettingsEnrollmentsActions.loadStatisticsSuccess({
            payload: {
              totalUsers: 99999,
              totalSentMessages: 9999999,
              startedEnrollments: 75432,
              waitingEnrollments: 12345,
              totalPendingMessages: 34567,
              totalSentMessagesPeriod: 123456,
            },
          }),
        ),
    },
  ];

  const contentCases: EdgeCase[] = [
    {
      label: 'Todos os status',
      description: 'STARTED, WAITING e REFUSED juntos',
      icon: 'category',
      apply: () =>
        store.dispatch(
          SettingsEnrollmentsActions.loadEnrollmentsSuccess({
            payload: {
              collection: [
                fakeEnrollment({
                  status: 'STARTED',
                  course: { id: uid(), name: 'Curso de Compliance' },
                  user: { email: 'ativo@empresa.com', name: 'Ana Ativa', phone: '+5511999991111', tags: '' },
                  progress: 65,
                  messages_sent_count: 14,
                  messages_pending_count: 3,
                }),
                fakeEnrollment({
                  status: 'WAITING',
                  course: { id: uid(), name: 'Curso de Liderança' },
                  user: {
                    email: 'aguardando@empresa.com',
                    name: 'Bruno Aguardando',
                    phone: '+5511999992222',
                    tags: '',
                  },
                  progress: 0,
                  messages_sent_count: 0,
                  messages_pending_count: 0,
                }),
                fakeEnrollment({
                  status: 'REFUSED',
                  course: { id: uid(), name: 'Curso de TI' },
                  user: { email: 'recusado@empresa.com', name: 'Carla Recusada', phone: '+5511999993333', tags: '' },
                  progress: 30,
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
      label: 'Nomes e cursos longos',
      description: 'Testa overflow de texto em todos os campos',
      icon: 'text_fields',
      apply: () =>
        store.dispatch(
          SettingsEnrollmentsActions.loadEnrollmentsSuccess({
            payload: {
              collection: [
                fakeEnrollment({
                  status: 'STARTED',
                  course: {
                    id: uid(),
                    name: 'Curso Completo de Compliance e Ética Corporativa para Gestores de Nível Estratégico',
                  },
                  user: {
                    email: 'maria.aparecida.rodrigues@departamento.empresa-corporativa.com.br',
                    name: 'Maria Aparecida dos Santos Rodrigues da Silva Pereira',
                    phone: '+55119999999999',
                    tags: 'gerente,financeiro,sp,matriz,liderança,compliance',
                  },
                  messages_sent_count: 9999,
                  messages_pending_count: 9999,
                }),
              ],
              page: { count: 1, page: 1, per_page: 10, total_pages: 1 },
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
        const courses = ['Compliance', 'Liderança', 'Segurança da Informação', 'RH', 'Financeiro'];
        const names = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Felipe', 'Giovana', 'Hugo', 'Isa', 'João'];
        const enrollments = names.map((name, i) =>
          fakeEnrollment({
            status: statuses[i % 3],
            course: { id: uid(), name: `Curso de ${courses[i % 5]}` },
            progress: (i + 1) * 10,
            messages_sent_count: (i + 1) * 2,
            messages_pending_count: i % 3,
            user: {
              email: `${name.toLowerCase()}@empresa.com`,
              name: `${name} Sobrenome`,
              phone: `+551199999${String(i).padStart(4, '0')}`,
              tags: i % 2 === 0 ? 'colaborador' : 'gestor',
            },
          }),
        );
        store.dispatch(
          SettingsEnrollmentsActions.loadEnrollmentsSuccess({
            payload: { collection: enrollments, page: { count: 87, page: 1, per_page: 10, total_pages: 9 } },
          }),
        );
      },
    },
  ];

  return [
    { title: 'Estado da lista', cases: listStateCases },
    { title: 'Estatísticas', cases: statisticsCases },
    { title: 'Conteúdo', cases: contentCases },
  ];
}
