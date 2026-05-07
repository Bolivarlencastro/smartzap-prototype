// ── Workspace constants
export const WORKSPACE_DEFAULT = 'n2iyyzux';
export const WORKSPACE_CY_2 = 'odi1mjay';
export const WORKSPACE_DEFAULT_UUID = '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf';
export const DEFAULT_LANGUAGE = 'pt-BR';
export const DEVELOPMENT_STATUS = {
  DONE: 'DONE',
};

// ── Courses and Trails Constants
export const TRAIL_CLOSED_TYPE_UUID = 'b38d3833-6a9a-4ee9-9c99-9de3f9b2b657';
export const TRAIL_OPEN_TYPE_UUID = '4f909ac7-6149-4ca3-bb2a-10aa2f140a9c';
export const MISSION_CLASS = 'Curso';
export const SCORM_CLASS = 'Curso Scorm';
export const EXTERNAL_CLASS = 'Curso Externo';
export const EXTERNAL_PROVIDER = 'Provedor externo';
export const MISSION_STATUS_TYPE = 'Fechada';
export const CLOSED_TYPE = 'Fechada';
export const CLOSED_TYPE_ID = '9e15d7f9-ef11-428b-9c14-5a5c31552a39';
export const OPEN_TYPE = 'Aberta';
export const OPEN_TYPE_ID = '94176ccd-d3bd-4ee1-a4ae-c08798125617';
export const NUMBER_CONTENTS = '1';
export const DEFAULT_CATEGORY = 'dbc9ffa1-1f59-428e-a18d-0e67a2770db8';
export const DEFAULT_MISSION_CATEGORY = ' automacao cy ';
export const MISSION_TOPIC = 'Teste Cy';
export const REQUIRED = 'Obrigatória';
export const CONTENTS = 'Conteúdos';
export const CONTENT = 'Conteudo Teste';
export const QUIZ_CORRECT_OPTION = 'Correct';
export const MAX_PERFORMANCE = '100';
export const MINIMAL_PERFORMANCE = '1';
export const listActions = [
  'Avaliações',
  'Matricular usuários',
  'Estatísticas',
  'Editar',
  'Contribuidores',
  'Duplicar',
  'Transferir',
  'Compartilhar',
  'Excluir',
];

// ── Events Constants
export const PRESENTIAL_EVENT = 'Evento Presencial';
export const ONLINE_EVENT = 'Evento Live';
export const NUMBER_VACANCIES = 2;
export const ONLINE_EVENT_URL = 'https://meet.google.com/odz-hcfm-bny?authuser=0';
export const ONLINE_EVENT_URL_MOCK = 'https://meet.google.com';

// ── Enrollment Status and Actions
export const PUBLISHED = 'Publicada';
export const STARTED = 'Iniciada';
export const FINISHED = 'Finalizada';
export const INACTIVE = 'Inativa';
export const INATIVO = 'Inativo';
export const ENROLL = 'Matricular-se';
export const RE_ENROLL = 'Rematricular';
export const NEW_ENROLL = 'Nova matrícula';
export const ENROLLED = 'Matriculada';
export const TRAIL_ENROLLED = 'Matriculado';
export const WAITING_APPROVAL = 'Ag. Aprovação';
export const REFUSED = 'Recusada';
export const REPROVED = 'Reprovada';
export const TO_GIVE_UP = 'Desistir';
export const GIVE_UP = 'Desistiu';
export const MOTIVE_FOR_GIVE_UP = 'Text give up';
export const WAIT_REVIEW = 'Ag. Revisão';
export const BATCH_ENROLLMENTS = ' Matrículas em Lote ';
export const ENROLLMENT_NOT_FOUND = 'Nenhuma matrícula encontrada';
export const ENROLLMENT_NOT_FOUND_FILTERED = 'Nenhuma matrícula encontrada para os filtros selecionados.';
export const ALL_ENROLLMENTS_FOR_THIS_COURSE = 'Todas Matrículas deste Curso';
export const ENROLLMENT_LIST = 'Lista de matrícula';
export const ATTENDANCE_LIST = 'Lista de presença';
export const WAITING_LIST = 'Na lista de espera';
export const WAITING_VACANCY = 'Esperando Vaga';
export const TRAIL_MENU_ACTIONS = ['Apagar', 'Transferir', 'Matrículas em Lote', 'Editar'];

// ── UI Labels
export const UPDATE_MESSAGE = 'Curso atualizado com sucesso!';
export const DOWNLOAD_CERTIFICATE = 'Baixar Certificado';
export const VIEW_MISSION = 'Visualizar Curso';
export const NEXT_CONTENT = 'Próximo Conteúdo';
export const CONTINUE_MISSION = 'Continuar Curso';
export const OPEN = 'Abrir';
export const START = 'Iniciar';
export const START_COURSE = 'Iniciar Curso';
export const SAVE = 'Salvar';
export const TRAIL_NOT_AVAILABLE = 'Não há trilhas disponíveis no momento';
export const MISSION_MESSAGE_NO_CREATED = 'Você ainda não criou cursos.';
export const NOT_EXIST_MISSIONS = 'Desculpe, curso não existe';
export const CREATED_BY_ME = 'Criados por mim';
export const ONE_LINKED_USER = '1 usuário vinculado';
export const RIGHT = 'right';
export const HYPHEN = '-';

// ── Categories
export const DEFAULT_CATEGORIES = ['Desenvolvimento', 'Comunicação', 'Gestão'];
export const CUSTOM_CATEGORIES = ['automacao cy', 'automação cy 2'];

// ── Learning Objects Types
export const TRAILS = 'trails';
export const COURSES = 'courses';
export const EVENTS = 'events';

// ── Default Sections (preserved on cleanup)
export const DEFAULT_SECTIONS_IDS = [
  'dd318b8c-157a-47a7-98db-452cc795a63c',
  '84e94f25-7421-411b-92d2-b2e9e4621888',
  '31f60487-4106-4d10-bd03-c4156610d910',
];

// ── Section Map
export enum SectionMap {
  TAB_TRAILS = 'learning-trails',
  TAB_COURSES = 'courses',

  COURSE = 'course',
  LEARNING_TRAIL = 'learning-trail',
  EVENTS = 'events',
  TRAIL_ENROLLED = 'trail-enrolled',
  COURSE_ENROLLED = 'course-enrolled',
  EVENTS_ENROLLED = 'events-enrolled',
  ALL = 'all',

  DESCRIPTION = 'Description for test section',
}

// ── Fixture paths (for cy.fixture())
const ENV = Cypress.env('ENVIRONMENT');
export const FIXTURE_PATH_MISSION_DEFAULT = `${ENV}/mission/default`;
export const FIXTURE_PATH_MISSION_QUIZ = `${ENV}/mission/quiz.json`;
export const FIXTURE_PATH_MISSION_TRANSFER = `${ENV}/mission/transfer`;
export const FIXTURE_PATH_ENROLLMENT_DEFAULT = `${ENV}/enrollment/default`;
export const FIXTURE_PATH_TRAIL_DEFAULT = `${ENV}/trail/default`;
export const FIXTURE_PATH_CHANNEL_DEFAULT = `${ENV}/channel/default`;
export const FIXTURE_PATH_CHANNEL_INDEX = `${ENV}/channel/index`;
export const FIXTURE_PATH_GROUP_DEFAULT = `${ENV}/groups/default.json`;

// ── File paths (for cy.selectFile() / cy.readFile())
export const FILE_PATH_SCORM = `cypress/fixtures/${ENV}/scorm/scorm-file.zip`;
export const FILE_PATH_CERTIFICATE = `cypress/fixtures/${ENV}/enrollment/certificate/certificate.pdf`;
export const FILE_PATH_BATCH_ENROLL = `cypress/fixtures/${ENV}/enrollment/batch_enroll_sheet.xlsx`;
export const FILE_PATH_VIDEO_MP4 = `cypress/fixtures/${ENV}/content/video/video10s.mp4`;
export const FILE_PATH_IMAGE_PNG_1 = `cypress/fixtures/${ENV}/content/image/image1.png`;
export const FILE_PATH_IMAGE_PNG_2 = `cypress/fixtures/${ENV}/content/image/image2.png`;
export const FILE_PATH_IMAGE_JPG = `cypress/fixtures/${ENV}/content/image/imageJPG.jpg`;
export const FILE_PATH_IMAGE_JPEG = `cypress/fixtures/${ENV}/content/image/imageJPEG.jpeg`;
export const FILE_PATH_AUDIO_MP3 = `cypress/fixtures/${ENV}/content/audio/audio1.mp3`;
export const FILE_PATH_DOCUMENT_PDF = `cypress/fixtures/${ENV}/content/document/documentPDF.pdf`;
export const FILE_PATH_DOCUMENT_DOCX = `cypress/fixtures/${ENV}/content/document/documentDOCX.docx`;
export const FILE_PATH_DOCUMENT_PPTX = `cypress/fixtures/${ENV}/content/document/documentPPTX.pptx`;
export const FILE_PATH_DOCUMENT_XLSX = `cypress/fixtures/${ENV}/content/document/documentXLSX.xlsx`;
export const FILE_PATH_DOCUMENT_XLS = `cypress/fixtures/${ENV}/content/document/documentXLS.xls`;
export const FILE_PATH_GENIALLY = `cypress/fixtures/${ENV}/content/genially/genially.zip`;
export const FILE_PATH_INVALID = `cypress/fixtures/${ENV}/content/invalid/file.invalid`;
export const FILE_PATH_SHEET_IMPORT_USERS_GROUPS = `cypress/fixtures/${ENV}/groups/grupo-cypress-two-users.xlsx`;
export const FILE_PATH_SHEET_IMPORT_MISSIONS_GROUPS = `cypress/fixtures/${ENV}/groups/grupo-cypress-two-missions.xlsx`;
export const FILE_PATH_SHEET_IMPORT_CHANNELS_GROUPS = `cypress/fixtures/${ENV}/groups/grupo-cypress-two-channels.xlsx`;
