import { Store } from '@ngrx/store';
import { EdgeCase, EdgeCaseGroup } from '../dev-tools-overlay.component';
import * as CoursesActions from 'app/main/courses/store/actions/courses.actions';
import { Course } from 'app/main/courses/model';

let _idCounter = 0;
function uid(): string {
  return `mock-${++_idCounter}-${Date.now()}`;
}

function fakeCourse(overrides: Partial<Course>): Course {
  return {
    id: uid(),
    name: 'Curso Mockado',
    description: 'Descrição do curso de exemplo para visualização de edge cases.',
    category_id: 'cat-mock',
    lang: 'pt-BR',
    is_active: true,
    status: 'FINISHED',
    total_contents: 0,
    total_lessons: 0,
    total_users_enrolled: 0,
    total_users_completed: 0,
    content_performance_weight: 0.7,
    quiz_performance_weight: 0.3,
    disable_send_certificate: false,
    created: '2024-01-15T10:00:00Z',
    updated: '2024-01-15T10:00:00Z',
    ...overrides,
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
      description: 'FINISHED, CREATING, REVIEWING e inativo',
      icon: 'category',
      apply: () =>
        store.dispatch(
          CoursesActions.loadCoursesSuccess({
            payload: {
              collection: [
                fakeCourse({
                  name: 'Curso Finalizado',
                  status: 'FINISHED',
                  total_users_enrolled: 1250,
                  total_users_completed: 1250,
                }),
                fakeCourse({ name: 'Curso em Criação', status: 'CREATING' }),
                fakeCourse({ name: 'Curso em Revisão', status: 'REVIEWING' }),
                fakeCourse({
                  name: 'Curso Inativo',
                  status: 'FINISHED',
                  is_active: false,
                  total_users_enrolled: 320,
                  total_users_completed: 200,
                }),
              ],
              page: { count: 4, page: 1, per_page: 20, total_pages: 1 },
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
                  total_contents: 999,
                  total_lessons: 150,
                  total_users_enrolled: 99999,
                  total_users_completed: 98765,
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
        const statuses = ['FINISHED', 'CREATING', 'REVIEWING'];
        const areas = ['Compliance', 'Liderança', 'TI', 'RH', 'Financeiro'];
        const courses = Array.from({ length: 20 }, (_, i) =>
          fakeCourse({
            name: `Curso ${i + 1} — ${areas[i % 5]}`,
            status: statuses[i % 3],
            is_active: i % 5 !== 4,
            total_users_enrolled: (i + 1) * 317,
            total_users_completed: (i + 1) * 210,
            total_lessons: (i % 10) + 1,
            total_contents: ((i % 10) + 1) * 3,
          }),
        );
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
              collection: [fakeCourse({ name: 'Único Curso da Lista', status: 'FINISHED', total_users_enrolled: 42 })],
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
