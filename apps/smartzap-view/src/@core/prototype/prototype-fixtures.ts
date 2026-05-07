import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';

type PrototypeContentType = 'Text' | 'Image' | 'Presentation' | 'Spreadsheet' | 'Question';

export interface PrototypeNavItem {
  id: string;
  title: string;
  description: string;
  contentType: PrototypeContentType;
}

type PrototypeQuestionOption = {
  id: string;
  title: string;
  is_ok?: boolean;
};

type PrototypeQuestion = {
  id: string;
  title: string;
  question_input_type: 'OPTION' | 'TEXT';
  options?: PrototypeQuestionOption[];
};

type PrototypeContentRecord = {
  id: string;
  name: string;
  title?: string;
  exam_type?: 'QUIZ' | 'SURVEY';
  content_type: { name: PrototypeContentType };
  url?: string;
  questions?: PrototypeQuestion[];
  user_answers?: PrototypeAnswer[];
  prototype?: {
    isFallback?: boolean;
  };
};

export type PrototypeAnswer = {
  question: string;
  options?: string;
  text_response?: string;
  is_ok: boolean;
};

const prototypeBasePath = '/assets/prototype';

export const prototypeWorkspace: WorkspaceBasicDto = {
  id: 'smartzap-prototype-workspace',
  name: 'Smartzap Prototype',
  logo_url: `${prototypeBasePath}/smartzap-prototype-hero.svg`,
  icon_url: `${prototypeBasePath}/smartzap-prototype-hero.svg`,
  hash_id: 'smartzap-prototype',
  custom_color: '#875DAB',
  theme_dark: false,
  logout_url: '',
  notify_teams: false,
  notify_slack: false,
  default_federated_identity_provider_alias: '',
};

export const prototypeNavigation: PrototypeNavItem[] = [
  {
    id: 'welcome-guide',
    title: 'Boas-vindas',
    description: 'Tela de conteúdo textual com apresentação do fluxo do Smartzap.',
    contentType: 'Text',
  },
  {
    id: 'campaign-poster',
    title: 'Peça visual',
    description: 'Estado de visualização de imagem com material promocional.',
    contentType: 'Image',
  },
  {
    id: 'launch-playbook',
    title: 'Playbook',
    description: 'Estado de documento/apresentação incorporado no viewer.',
    contentType: 'Presentation',
  },
  {
    id: 'operations-sheet',
    title: 'Painel operacional',
    description: 'Estado de planilha com indicadores e checklist operacional.',
    contentType: 'Spreadsheet',
  },
  {
    id: 'qualification-quiz',
    title: 'Quiz de qualificação',
    description: 'Fluxo de perguntas com correção e resumo ao final.',
    contentType: 'Question',
  },
  {
    id: 'nps-survey',
    title: 'Pesquisa de percepção',
    description: 'Fluxo de survey com resposta aberta e estado respondido.',
    contentType: 'Question',
  },
];

const contentMap: Record<string, PrototypeContentRecord> = {
  'welcome-guide': {
    id: 'welcome-guide',
    name: 'Boas-vindas ao Smartzap Prototype',
    content_type: { name: 'Text' },
    url: `${prototypeBasePath}/welcome-guide.html`,
  },
  'campaign-poster': {
    id: 'campaign-poster',
    name: 'Campanha de ativação da semana',
    content_type: { name: 'Image' },
    url: `${prototypeBasePath}/smartzap-prototype-hero.svg`,
  },
  'launch-playbook': {
    id: 'launch-playbook',
    name: 'Playbook de lançamento',
    content_type: { name: 'Presentation' },
    url: `${prototypeBasePath}/launch-playbook.html`,
  },
  'operations-sheet': {
    id: 'operations-sheet',
    name: 'Painel operacional',
    content_type: { name: 'Spreadsheet' },
    url: `${prototypeBasePath}/operations-sheet.html`,
  },
  'qualification-quiz': {
    id: 'qualification-quiz',
    name: 'Quiz de qualificação',
    exam_type: 'QUIZ',
    content_type: { name: 'Question' },
    questions: [
      {
        id: 'quiz-1',
        title: 'Qual mensagem inicial melhor aquece o lead sem parecer genérica?',
        question_input_type: 'OPTION',
        options: [
          { id: 'quiz-1-a', title: 'Oferta direta com desconto logo na primeira interação.', is_ok: false },
          { id: 'quiz-1-b', title: 'Contextualização curta com dor do segmento e CTA leve.', is_ok: true },
          { id: 'quiz-1-c', title: 'Texto longo com todas as funcionalidades do produto.', is_ok: false },
        ],
      },
      {
        id: 'quiz-2',
        title: 'Qual KPI indica melhor se o fluxo está convertendo sem gerar atrito?',
        question_input_type: 'OPTION',
        options: [
          { id: 'quiz-2-a', title: 'Taxa de resposta positiva por etapa.', is_ok: true },
          { id: 'quiz-2-b', title: 'Quantidade total de mensagens enviadas.', is_ok: false },
          { id: 'quiz-2-c', title: 'Tempo médio online do operador.', is_ok: false },
        ],
      },
    ],
    user_answers: [],
  },
  'nps-survey': {
    id: 'nps-survey',
    name: 'Pesquisa de percepção',
    exam_type: 'SURVEY',
    content_type: { name: 'Question' },
    questions: [
      {
        id: 'survey-1',
        title: 'Como você avaliaria a clareza da automação recebida?',
        question_input_type: 'OPTION',
        options: [
          { id: 'survey-1-a', title: 'Muito clara', is_ok: true },
          { id: 'survey-1-b', title: 'Razoável', is_ok: true },
          { id: 'survey-1-c', title: 'Confusa', is_ok: true },
        ],
      },
      {
        id: 'survey-2',
        title: 'O que você melhoraria no fluxo?',
        question_input_type: 'TEXT',
      },
    ],
    user_answers: [
      {
        question: 'survey-1',
        options: 'survey-1-b',
        is_ok: true,
      },
    ],
  },
};

export function getPrototypeContent(contentId: string): PrototypeContentRecord {
  return (
    contentMap[contentId] ?? {
      id: contentId,
      name: 'Fluxo ainda não mockado',
      content_type: { name: 'Text' },
      url: `${prototypeBasePath}/mock-unavailable.html`,
      prototype: { isFallback: true },
    }
  );
}

export function createPrototypeAnswer(body: {
  questions?: { id: string; options?: string[]; text_response?: string }[];
}): PrototypeAnswer[] {
  return (body.questions ?? []).map((question) => {
    const content = Object.values(contentMap).find((item) => item.questions?.some(({ id }) => id === question.id));
    const sourceQuestion = content?.questions?.find(({ id }) => id === question.id);
    const selectedOptionIds = question.options ?? [];
    const isOk =
      sourceQuestion?.question_input_type === 'TEXT'
        ? true
        : (sourceQuestion?.options ?? [])
            .filter((option) => option.is_ok)
            .every((option) => selectedOptionIds.includes(option.id));

    return {
      question: question.id,
      options: selectedOptionIds.length ? selectedOptionIds.join(',') : undefined,
      text_response: question.text_response,
      is_ok: isOk,
    };
  });
}
