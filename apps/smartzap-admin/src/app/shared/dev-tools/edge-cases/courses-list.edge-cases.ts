import { Store } from '@ngrx/store';
import { EdgeCase, EdgeCaseGroup } from '../dev-tools-overlay.component';
import * as CoursesActions from 'app/main/courses/store/actions/courses.actions';
import { Course } from 'app/main/courses/model';

let _idCounter = 0;
function uid(): string {
  return `mock-${++_idCounter}-${Date.now()}`;
}

const DEFAULT_VERSION: Record<string, string> = {
  FINISHED: '1.0.0',
  REVIEWING: '0.9.0',
  CREATING: '0.1.0',
  PROCESSING: '0.9.0',
};

const MOCK_CREATORS = [
  { id: 'mock-user-1', name: 'Helena Prototype' },
  { id: 'mock-user-2', name: 'Marcos Ribeiro' },
  { id: 'mock-user-3', name: 'Ana Lima' },
];

const MOCK_CATEGORIES = [
  { id: 'cat-onboarding', name: 'Onboarding', description: '' },
  { id: 'cat-sales', name: 'Vendas', description: '' },
  { id: 'cat-compliance', name: 'Compliance', description: '' },
];

function fakeCourse(overrides: Partial<Course>, index = 0): Course {
  const status = overrides.status ?? 'FINISHED';
  const isPublished = status === 'FINISHED';

  const enrolled = isPublished ? (overrides.total_users_enrolled ?? 0) : 0;
  const completed = isPublished ? Math.min(overrides.total_users_completed ?? 0, enrolled) : 0;
  const inProgress = isPublished ? (overrides.total_users_in_progress ?? Math.max(0, enrolled - completed)) : 0;

  const defaultCategory = MOCK_CATEGORIES[index % MOCK_CATEGORIES.length];
  const defaultCreator = MOCK_CREATORS[index % MOCK_CREATORS.length];
  const resolvedCategory = overrides.category_id
    ? (MOCK_CATEGORIES.find((c) => c.id === overrides.category_id) ?? defaultCategory)
    : defaultCategory;

  const {
    total_users_enrolled: _e,
    total_users_completed: _c,
    total_users_in_progress: _p,
    category: _cat,
    category_id: _catId,
    user_creator: _creator,
    ...rest
  } = overrides;

  return {
    id: uid(),
    name: 'Curso Mockado',
    description: 'Descrição do curso de exemplo para visualização de edge cases.',
    lang: 'pt-BR',
    is_active: true,
    content_performance_weight: 0.7,
    quiz_performance_weight: 0.3,
    disable_send_certificate: false,
    created: '2024-01-15T10:00:00Z',
    updated: '2024-03-20T14:30:00Z',
    ...rest,
    status,
    category_id: overrides.category_id ?? defaultCategory.id,
    category: overrides.category ?? resolvedCategory,
    user_creator: overrides.user_creator ?? defaultCreator,
    version: overrides.version ?? DEFAULT_VERSION[status] ?? '1.0.0',
    total_users_enrolled: enrolled,
    total_users_completed: completed,
    total_users_in_progress: inProgress,
  };
}

export function getCoursesListEdgeCases(store: Store): EdgeCaseGroup[] {
  const listStateCases: EdgeCase[] = [
    {
      label: 'Lista vazia',
      description: 'Nenhum curso — testa o estado empty',
      icon: 'table_rows_narrow',
      apply: () =>
        store.dispatch(
          CoursesActions.loadCoursesSuccess({
            payload: { collection: [], page: { count: 0, page: 1, per_page: 20, total_pages: 0 } },
          }),
        ),
    },
    {
      label: 'Carregando',
      description: 'Exibe skeleton / spinner de loading',
      icon: 'hourglass_empty',
      apply: () =>
        store.dispatch(CoursesActions.loadCourses({ page: { count: 0, page: 1, per_page: 20, total_pages: 0 } })),
    },
    {
      label: 'Restaurar',
      description: 'Recarrega os cursos da API',
      icon: 'refresh',
      apply: () => store.dispatch(CoursesActions.initializeCourses()),
    },
  ];

  const contentCases: EdgeCase[] = [
    {
      label: 'Todos os status',
      description: 'FINISHED com andamento, CREATING, REVIEWING e inativo',
      icon: 'category',
      apply: () =>
        store.dispatch(
          CoursesActions.loadCoursesSuccess({
            payload: {
              collection: [
                fakeCourse({
                  name: 'Curso Finalizado (com andamento)',
                  status: 'FINISHED',
                  version: '2.0.1',
                  total_users_enrolled: 1250,
                  total_users_completed: 980,
                  total_users_in_progress: 270,
                }),
                fakeCourse({
                  name: 'Curso Finalizado (todos concluíram)',
                  status: 'FINISHED',
                  version: '1.0.0',
                  total_users_enrolled: 500,
                  total_users_completed: 500,
                }),
                fakeCourse({ name: 'Curso em Criação', status: 'CREATING', version: '0.1.0' }),
                fakeCourse({ name: 'Curso em Revisão', status: 'REVIEWING', version: '0.9.0' }),
                fakeCourse({
                  name: 'Curso Inativo (publicado)',
                  status: 'FINISHED',
                  is_active: false,
                  version: '3.0.0',
                  total_users_enrolled: 320,
                  total_users_completed: 200,
                  total_users_in_progress: 120,
                }),
              ],
              page: { count: 5, page: 1, per_page: 20, total_pages: 1 },
            },
          }),
        ),
    },
    {
      label: 'Títulos longos + números grandes',
      description: 'Testa overflow de texto e contadores',
      icon: 'text_fields',
      apply: () =>
        store.dispatch(
          CoursesActions.loadCoursesSuccess({
            payload: {
              collection: [
                fakeCourse({
                  name: 'Curso Completo de Compliance e Ética Corporativa para Gestores de Nível Estratégico e Operacional da Empresa',
                  status: 'FINISHED',
                  version: '12.3.45',
                  total_contents: 999,
                  total_lessons: 150,
                  total_users_enrolled: 99999,
                  total_users_completed: 98765,
                  total_users_in_progress: 1234,
                  points: 9999,
                  duration: '9999h',
                }),
                fakeCourse({
                  name: 'Treinamento Avançado em Segurança da Informação, Proteção de Dados Pessoais e Conformidade com a LGPD',
                  status: 'CREATING',
                  total_contents: 45,
                  total_lessons: 12,
                }),
                fakeCourse({
                  name: 'Desenvolvimento de Liderança e Gestão de Equipes de Alta Performance em Ambientes Corporativos Complexos',
                  status: 'REVIEWING',
                }),
              ],
              page: { count: 3, page: 1, per_page: 20, total_pages: 1 },
            },
          }),
        ),
    },
    {
      label: 'Paginação cheia (20 cursos)',
      description: 'Simula página completa com múltiplas páginas',
      icon: 'format_list_bulleted',
      apply: () => {
        const statuses = ['FINISHED', 'CREATING', 'REVIEWING'] as const;
        const areas = ['Compliance', 'Liderança', 'TI', 'RH', 'Financeiro'];
        const versions: Record<string, string[]> = {
          FINISHED: ['1.0.0', '1.2.3', '2.0.0', '3.1.4', '1.0.1', '2.5.0', '4.0.0'],
          REVIEWING: ['0.9.0', '0.8.1', '0.9.5'],
          CREATING: ['0.1.0', '0.2.0', '0.1.1'],
        };
        let finishedIdx = 0;
        const courses = Array.from({ length: 20 }, (_, i) => {
          const status = statuses[i % 3];
          const isPublished = status === 'FINISHED';
          const enrolled = isPublished ? (i + 1) * 317 : 0;
          const completed = isPublished ? Math.floor(enrolled * 0.66) : 0;
          const inProgress = isPublished ? enrolled - completed : 0;
          const versionPool = versions[status];
          const version = versionPool[finishedIdx++ % versionPool.length];
          return fakeCourse(
            {
              name: `Curso ${i + 1} — ${areas[i % 5]}`,
              status,
              is_active: i % 5 !== 4,
              version,
              total_users_enrolled: enrolled,
              total_users_completed: completed,
              total_users_in_progress: inProgress,
              total_lessons: (i % 10) + 1,
              total_contents: ((i % 10) + 1) * 3,
              updated: new Date(Date.now() - i * 86_400_000 * 3).toISOString(),
            },
            i,
          );
        });
        store.dispatch(
          CoursesActions.loadCoursesSuccess({
            payload: { collection: courses, page: { count: 98, page: 1, per_page: 20, total_pages: 5 } },
          }),
        );
      },
    },
    {
      label: 'Um único curso',
      description: 'Lista com apenas um resultado',
      icon: 'looks_one',
      apply: () =>
        store.dispatch(
          CoursesActions.loadCoursesSuccess({
            payload: {
              collection: [
                fakeCourse({
                  name: 'Único Curso da Lista',
                  status: 'FINISHED',
                  version: '1.0.0',
                  total_users_enrolled: 42,
                  total_users_completed: 30,
                  total_users_in_progress: 12,
                }),
              ],
              page: { count: 1, page: 1, per_page: 20, total_pages: 1 },
            },
          }),
        ),
    },
  ];

  return [
    { title: 'Estado da lista', cases: listStateCases },
    { title: 'Conteúdo', cases: contentCases },
  ];
}
