import { Store } from '@ngrx/store';
import { EdgeCase, EdgeCaseGroup } from '../dev-tools-overlay.component';
import * as UsersActions from 'app/main/users/store/actions/users.actions';
import { User } from 'app/main/users/model';

let _idCounter = 0;
function uid(): string {
  return `mock-user-${++_idCounter}-${Date.now()}`;
}

const DEPARTMENTS = ['Comercial', 'Operações', 'Compliance', 'RH', 'Tecnologia'];
const SUB_DEPARTMENTS = ['Inside Sales', 'Operações Digitais', 'Jurídico', 'Talent Acquisition', 'Engenharia'];
const AREAS = ['Pré-venda', 'TI', 'Regulatório', 'Recrutamento', 'Desenvolvimento'];
const LEADERS = ['Roberto Ferreira', 'Marcelo Santos', 'Sandra Luz', 'Paulo Gomes', 'Ana Oliveira'];

function fakeUser(overrides: Partial<User>, index = 0): User {
  const id = uid();
  return {
    id,
    name: 'Usuário Teste',
    email: `usuario-${id.slice(-6)}@empresa.com`,
    phone: '+5511999999999',
    tags: '',
    selected: false,
    sync_check: null,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    sub_department: SUB_DEPARTMENTS[index % SUB_DEPARTMENTS.length],
    area: AREAS[index % AREAS.length],
    leader: LEADERS[index % LEADERS.length],
    ...overrides,
  };
}

export function getUsersEdgeCases(store: Store): EdgeCaseGroup[] {
  const listStateCases: EdgeCase[] = [
    {
      label: 'Lista vazia',
      description: 'Nenhum usuário — testa o estado empty',
      icon: 'person_off',
      apply: () =>
        store.dispatch(UsersActions.loadUsersSuccess({ data: { result: [], page: 1, total_pages: 0, count: 0 } })),
    },
    {
      label: 'Carregando',
      description: 'Exibe skeleton / spinner de loading',
      icon: 'hourglass_empty',
      apply: () => store.dispatch(UsersActions.loadUsers({})),
    },
    {
      label: 'Restaurar',
      description: 'Recarrega os usuários da API',
      icon: 'refresh',
      apply: () => store.dispatch(UsersActions.init()),
    },
  ];

  const contentCases: EdgeCase[] = [
    {
      label: 'Com erros de sincronização',
      description: 'Alguns usuários com sync_check preenchido',
      icon: 'sync_problem',
      apply: () =>
        store.dispatch(
          UsersActions.loadUsersSuccess({
            data: {
              result: [
                fakeUser({
                  name: 'Ana Rodrigues',
                  email: 'ana@empresa.com',
                  sync_check: 'Telefone inválido ou ausente',
                }),
                fakeUser({
                  name: 'Carlos Mendes',
                  email: 'carlos@empresa.com',
                  sync_check: 'Usuário não encontrado no MyAccount',
                }),
                fakeUser({ name: 'Beatriz Silva', email: 'beatriz@empresa.com', sync_check: null }),
                fakeUser({ name: 'Roberto Lima', email: 'roberto@empresa.com', sync_check: 'E-mail duplicado' }),
                fakeUser({ name: 'Patricia Nunes', email: 'patricia@empresa.com', sync_check: null }),
              ],
              page: 1,
              total_pages: 1,
              count: 5,
            },
          }),
        ),
    },
    {
      label: 'Nomes e e-mails longos',
      description: 'Testa overflow de texto em todos os campos',
      icon: 'text_fields',
      apply: () =>
        store.dispatch(
          UsersActions.loadUsersSuccess({
            data: {
              result: [
                fakeUser({
                  name: 'Maria Aparecida dos Santos Rodrigues da Silva Pereira',
                  email: 'maria.aparecida.dos.santos.rodrigues@departamento.empresa.corporativa.com.br',
                  phone: '+55119999999999',
                  tags: 'gerente,financeiro,sp,matriz,liderança,compliance,nivel-3',
                }),
                fakeUser({
                  name: 'João Antônio Carvalho de Albuquerque Neto Júnior',
                  email: 'joao.antonio.carvalho.de.albuquerque@filial-rj.empresa-grupo.com.br',
                  tags: 'coordenador,ti,rj,segurança,suporte,nível-2,infra',
                  sync_check: 'E-mail muito longo para ser processado pelo sistema de sincronização do MyAccount',
                }),
              ],
              page: 1,
              total_pages: 1,
              count: 2,
            },
          }),
        ),
    },
    {
      label: 'Lista grande (10 usuários)',
      description: 'Simula uma página completa com paginação',
      icon: 'format_list_bulleted',
      apply: () => {
        const firstNames = [
          'Ana',
          'Carlos',
          'Maria',
          'João',
          'Pedro',
          'Beatriz',
          'Lucas',
          'Fernanda',
          'Rafael',
          'Juliana',
        ];
        const lastNames = ['Silva', 'Souza', 'Lima', 'Pereira', 'Costa'];
        const result = firstNames.map((name, i) =>
          fakeUser(
            {
              name: `${name} ${lastNames[i % 5]}`,
              email: `${name.toLowerCase()}.${lastNames[i % 5].toLowerCase()}@empresa.com`,
              sync_check: i % 4 === 0 ? 'Telefone inválido' : null,
            },
            i,
          ),
        );
        store.dispatch(UsersActions.loadUsersSuccess({ data: { result, page: 1, total_pages: 3, count: 28 } }));
      },
    },
    {
      label: 'Um único usuário',
      description: 'Lista com apenas um resultado',
      icon: 'looks_one',
      apply: () =>
        store.dispatch(
          UsersActions.loadUsersSuccess({
            data: {
              result: [fakeUser({ name: 'Único Usuário', email: 'unico@empresa.com' })],
              page: 1,
              total_pages: 1,
              count: 1,
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
