import { Injectable } from '@angular/core';
import {
  ApplicationService,
  SmartzapConfiguration,
  UserProfile,
  UserRoleV2,
  Workspace,
  WorkspaceBasicDto,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Billing } from 'app/shared/model/billing';
import {
  Category,
  Content,
  ContentType,
  Course,
  EVALUATIVE_TYPE_ID,
  Language,
  Lesson,
  Question,
  SURVEY_TYPE_ID,
} from 'app/main/courses/model';
import { Tracking } from 'app/main/courses/model/tracking';
import { User } from 'app/main/users/model';
import { KpNotificationSmartzapModel, SmartZapNotificationType } from '@core/services/notification.service';

type LearnContentRecord = {
  id: string;
  name: string;
  description?: string;
  content_type: string;
  url?: string;
  link?: string;
  blog?: string;
};

type EnrollmentRecord = {
  id: string;
  workspace_id: string;
  course_id: string;
  course: { id: string; name: string };
  user_id: string;
  user: Pick<User, 'email' | 'name' | 'phone' | 'tags'>;
  status: string;
  progress: number;
  performance: number;
  points: string;
  start_date: string;
  end_date: string;
  created_on: string;
  created: string;
  updated: string;
  current_content: string;
  current_content_id: string;
  current_lesson: { id: string; name: string } | null;
  current_lesson_id: string;
  timezone: string;
  selected: boolean;
  messages_pending_count: number;
  messages_sent_count: number;
};

type CourseCollectionResponse = {
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
  result: Course[];
};

type PrototypePersistedState = {
  courses: Course[];
  lessonsByCourse: Record<string, Lesson[]>;
  learnContents: Record<string, LearnContentRecord>;
  examQuestions: Record<string, Question[]>;
};

@Injectable({ providedIn: 'root' })
export class PrototypeAdminStateService {
  private readonly storageKey = 'smartzap-prototype-state-v1';
  readonly workspace: WorkspaceBasicDto = {
    id: 'ws-prototype',
    name: 'Workspace Prototype Smartzap',
    logo_url: 'assets/branding/smartzap-double-check.svg',
    icon_url: 'assets/branding/smartzap-double-check.svg',
    hash_id: '',
    custom_color: '#875DAB',
    theme_dark: false,
    logout_url: window.location.origin,
    notify_teams: false,
    notify_slack: false,
    default_federated_identity_provider_alias: '',
  };

  readonly workspaceDetail: Workspace = {
    ...this.workspace,
    id: this.workspace.id,
    company: 'Keeps Prototype Labs',
    description: 'Ambiente navegavel para previews do Smartzap Admin.',
    custom_menu_items: [{ id: 'prototype-tour', icon: 'explore', name: 'Roteiro do prototipo', url: '/courses' }],
    user_token_expiration: 30,
  };

  readonly workspaceServices: ApplicationService[] = [
    { id: 'service-smartzap', name: 'Smartzap' },
    { id: 'service-konquest', name: 'Konquest' },
  ];

  readonly roles: UserRoleV2[] = [
    {
      id: 'role-smartzap-admin',
      key: 'admin',
      role_id: 'role-smartzap-admin',
      role_name: 'Admin',
      workspace_id: this.workspace.id,
      application_id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
      application_name: 'Smartzap',
    },
    {
      id: 'role-analytics-admin',
      key: 'basic_analytics_admin',
      role_id: 'role-analytics-admin',
      role_name: 'Analytics Admin',
      workspace_id: this.workspace.id,
      application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
      application_name: 'Learn Analytics',
    },
  ];

  readonly userProfile: UserProfile = {
    id: 'user-prototype-admin',
    name: 'Helena Prototype',
    nickname: 'helena.prototype',
    email: 'helena.prototype@keeps.dev',
    secondary_email: '',
    phone: '+5511999990001',
    avatar: 'https://api.dicebear.com/9.x/shapes/svg?seed=Helena',
    gender: 'FEMALE',
    birthday: '',
    address: 'Sao Paulo, BR',
    country: 'BR',
    status: true,
    time_zone: 'America/Sao_Paulo',
    cpf: '',
    ein: '',
    education: '',
    ethnicity: '',
    marital_status: '',
    hierarchical_level: 'Manager',
    contract_type: 'CLT',
    admission_date: '2024-01-15',
    language: { id: 'pt-br', name: 'pt-BR' } as any,
    roles: this.roles,
  };

  readonly smartzapConfiguration: SmartzapConfiguration = {
    messagesContentEmbed: true,
    sendCoursesRecommendationMessage: true,
    sendCourseReminderMessage: true,
    interactWithRandomMessages: false,
    enrollmentIdleDaysLimit: 10,
    coursesPortalUrl: 'https://preview.keeps.dev/smartzap',
  };

  readonly billing: Billing = {
    available_zaps: 18240,
    monthly_plan: 25000,
    zaps_sent: 6760,
    current_billing: {
      start_at: '2026-05-01T00:00:00.000Z',
      end_at: '2026-05-31T23:59:59.000Z',
    },
    charges: [
      {
        id: 'charge-2026-05',
        balance: 18240,
        billing_cycle_day: 1,
        monthly_plan: 25000,
        used: 6760,
        start_at: '2026-05-01T00:00:00.000Z',
        end_at: '2026-05-31T23:59:59.000Z',
        created: '2026-05-01T00:00:00.000Z',
        updated: '2026-05-06T09:00:00.000Z',
      },
    ],
  };

  readonly categories: Category[] = [
    { id: 'cat-onboarding', name: 'Onboarding', description: 'Treinamentos de boas-vindas' },
    { id: 'cat-sales', name: 'Vendas', description: 'Playbooks e operacao comercial' },
    { id: 'cat-compliance', name: 'Compliance', description: 'Normas e politicas internas' },
  ];

  readonly languages: Language[] = [
    { name: 'Portugues (Brasil)', value: 'pt-BR' },
    { name: 'English', value: 'en' },
    { name: 'Espanol', value: 'es' },
  ];

  readonly contentTypes: ContentType[] = [
    { id: 'ct-video', name: 'video', description: 'Video', image_url: '' },
    { id: 'ct-image', name: 'image', description: 'Image', image_url: '' },
    { id: 'ct-pdf', name: 'pdf', description: 'PDF', image_url: '' },
    { id: 'ct-podcast', name: 'podcast', description: 'Podcast', image_url: '' },
    { id: EVALUATIVE_TYPE_ID, name: 'Question', description: 'Question', image_url: '' },
    { id: SURVEY_TYPE_ID, name: 'Survey Question', description: 'Survey Question', image_url: '' },
    { id: 'ct-blog', name: 'blog', description: 'Blog', image_url: '' },
  ];

  private readonly notifications: KpNotificationSmartzapModel[] = [
    this.createNotification(
      'notif-1',
      'REPORT_READY',
      SmartZapNotificationType.COURSE_REDIRECT,
      'course-onboarding',
      '2026-05-06T12:10:00.000Z',
    ),
    this.createNotification(
      'notif-2',
      'REPORT_READY',
      SmartZapNotificationType.REPORT_DOWNLOAD,
      'https://assets.keepsdev.com/files/smartzap/users.xlsx',
      '2026-05-06T08:30:00.000Z',
    ),
  ];

  private readonly users: User[] = [
    {
      id: 'user-1',
      name: 'Ana Martins',
      email: 'ana.martins@empresa.com',
      phone: '+5511980001001',
      tags: 'lideranca',
      selected: false,
      sync_check: null,
    },
    {
      id: 'user-2',
      name: 'Bruno Costa',
      email: 'bruno.costa@empresa.com',
      phone: '+5511980001002',
      tags: 'vendas',
      selected: false,
      sync_check: null,
    },
    {
      id: 'user-3',
      name: 'Carla Souza',
      email: 'carla.souza@empresa.com',
      phone: '+5511980001003',
      tags: 'operacoes',
      selected: false,
      sync_check: 'Telefone sem DDI',
    },
    {
      id: 'user-4',
      name: 'Diego Lima',
      email: 'diego.lima@empresa.com',
      phone: '+5511980001004',
      tags: 'compliance',
      selected: false,
      sync_check: null,
    },
    {
      id: 'user-5',
      name: 'Elisa Rocha',
      email: 'elisa.rocha@empresa.com',
      phone: '+5511980001005',
      tags: 'rh',
      selected: false,
      sync_check: null,
    },
    {
      id: 'user-6',
      name: 'Felipe Nunes',
      email: 'felipe.nunes@empresa.com',
      phone: '+5511980001006',
      tags: 'gestores',
      selected: false,
      sync_check: null,
    },
  ];

  private readonly courses: Course[] = [
    this.createCourse({
      id: 'course-onboarding',
      name: 'Onboarding Comercial Smartzap',
      category_id: 'cat-onboarding',
      description: 'Sequencia de boas-vindas, pitch e processo comercial.',
      lang: 'pt-BR',
      status: 'FINISHED',
      is_active: true,
      total_contents: 4,
      total_lessons: 2,
      total_users_enrolled: 124,
      total_users_completed: 91,
      user_creator: { id: this.userProfile.id, name: this.userProfile.name },
    }),
    this.createCourse({
      id: 'course-playbook',
      name: 'Playbook de Lancamento B2B',
      category_id: 'cat-sales',
      description: 'Material para squads comerciais e CS.',
      lang: 'pt-BR',
      status: 'REVIEWING',
      is_active: true,
      total_contents: 3,
      total_lessons: 1,
      total_users_enrolled: 86,
      total_users_completed: 30,
      user_creator: { id: this.userProfile.id, name: this.userProfile.name },
    }),
    this.createCourse({
      id: 'course-compliance',
      name: 'Compliance em Operacoes Digitais',
      category_id: 'cat-compliance',
      description: 'Trilha de boas praticas e politicas internas.',
      lang: 'pt-BR',
      status: 'FINISHED',
      is_active: false,
      total_contents: 5,
      total_lessons: 2,
      total_users_enrolled: 210,
      total_users_completed: 177,
      user_creator: { id: 'user-marcos', name: 'Marcos Ribeiro' },
    }),
    this.createCourse({
      id: 'course-retention',
      name: 'Retencao e NPS para Base Ativa',
      category_id: 'cat-sales',
      description: 'Fluxos de acompanhamento e acionamento de clientes.',
      lang: 'en',
      status: 'CREATING',
      is_active: true,
      total_contents: 2,
      total_lessons: 1,
      total_users_enrolled: 42,
      total_users_completed: 0,
      user_creator: { id: this.userProfile.id, name: this.userProfile.name },
    }),
    this.createCourse({
      id: 'course-cultura',
      name: 'Cultura e Valores da Empresa',
      category_id: 'cat-compliance',
      description: 'Apresentacao dos principios, missao e visao organizacional.',
      lang: 'pt-BR',
      status: 'FINISHED',
      is_active: true,
      total_contents: 3,
      total_lessons: 1,
      total_users_enrolled: 312,
      total_users_completed: 289,
      user_creator: { id: 'user-ana', name: 'Ana Lima' },
    }),
  ];

  private readonly lessonsByCourse = new Map<string, Lesson[]>();
  private readonly learnContents = new Map<string, LearnContentRecord>();
  private readonly examQuestions = new Map<string, Question[]>();
  private readonly enrollments: EnrollmentRecord[] = [
    this.seedEnrollment('enrollment-1', 'course-onboarding', 'user-1', 'STARTED', 56, 0.82),
    this.seedEnrollment('enrollment-2', 'course-onboarding', 'user-2', 'WAITING', 0, 0),
    this.seedEnrollment('enrollment-3', 'course-playbook', 'user-4', 'COMPLETED', 100, 0.94),
    this.seedEnrollment('enrollment-4', 'course-compliance', 'user-5', 'STARTED', 72, 0.88),
    this.seedEnrollment('enrollment-5', 'course-retention', 'user-6', 'REFUSED', 15, 0.2),
  ];
  private readonly trackingByEnrollment = new Map<string, Tracking[]>();

  constructor() {
    if (!this.hydratePersistedState()) {
      this.seedCourseContent();
      this.persistState();
    }
  }

  getWorkspaceBasicList(): WorkspaceBasicDto[] {
    return [this.clone(this.workspace)];
  }

  getWorkspace(): Workspace {
    return this.clone(this.workspaceDetail);
  }

  updateWorkspace(partial: Partial<Workspace>): Workspace {
    Object.assign(this.workspaceDetail, partial);
    return this.getWorkspace();
  }

  getWorkspaceServices(): ApplicationService[] {
    return this.clone(this.workspaceServices);
  }

  getUserProfile(): UserProfile {
    return this.clone({ ...this.userProfile, roles: this.roles });
  }

  getUserRoles(): UserRoleV2[] {
    return this.clone(this.roles);
  }

  getUsersByRole(): { items: Array<{ id: string; user?: Pick<User, 'id' | 'name' | 'email' | 'phone'> }> } {
    return {
      items: this.users.map((user) => ({
        id: `assignment-${user.id}`,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      })),
    };
  }

  getNotifications() {
    return this.clone(this.notifications);
  }

  markNotificationRead(notificationId: string) {
    return this.notifications.find((notification) => notification.id === notificationId) ?? null;
  }

  clearNotifications() {
    return null;
  }

  getBilling(): Billing {
    return this.clone(this.billing);
  }

  getCategories(): Category[] {
    return this.clone(this.categories);
  }

  getLanguages(): Language[] {
    return this.clone(this.languages);
  }

  getSmartzapConfiguration(): SmartzapConfiguration {
    return this.clone(this.smartzapConfiguration);
  }

  updateSmartzapConfiguration(config: Partial<SmartzapConfiguration>): SmartzapConfiguration {
    Object.assign(this.smartzapConfiguration, config);
    return this.getSmartzapConfiguration();
  }

  listCourses(params: Record<string, string | number | string[]>): CourseCollectionResponse {
    let result = this.courses.slice();
    const searchTerm = String(params['name__ilike'] || '').toLowerCase();
    const categoryFilter = this.toArray(params['category_id__eq']);
    const languageFilter = this.toArray(params['lang__in']).map((item) => item.toLowerCase());
    const statusFilter = this.toArray(params['status__in']);
    const creatorId = params['user_creator_id'] ? String(params['user_creator_id']) : null;

    if (searchTerm) {
      result = result.filter((course) => course.name.toLowerCase().includes(searchTerm));
    }
    if (categoryFilter.length) {
      result = result.filter((course) => categoryFilter.includes(course.category_id));
    }
    if (languageFilter.length) {
      result = result.filter((course) => languageFilter.includes(course.lang.toLowerCase()));
    }
    if (statusFilter.length) {
      result = result.filter((course) => statusFilter.includes(course.status || ''));
    }
    if (creatorId) {
      result = result.filter((course) => course.user_creator?.id === creatorId);
    }

    result = this.sortByField(result, String(params['sort'] || '-created'));
    return this.paginate(result, Number(params['page'] || 1), Number(params['per_page'] || 20));
  }

  getCourse(courseId: string): Course | undefined {
    const course = this.courses.find((item) => item.id === courseId);
    return course ? this.clone(course) : undefined;
  }

  saveCourse(body: Partial<Course>): Course {
    if (body.id) {
      return this.updateCourse(body.id, body);
    }

    const newCourse = this.createCourse({
      id: this.uid('course'),
      name: body.name || 'Novo curso prototipo',
      description: body.description || '',
      category_id: body.category_id || this.categories[0].id,
      lang: body.lang || 'pt-BR',
      status: 'CREATING',
      is_active: body.is_active ?? true,
      total_contents: 0,
      total_lessons: 0,
      total_users_enrolled: 0,
      total_users_completed: 0,
      user_creator: { id: this.userProfile.id },
      thumb_image: body.thumb_image,
      holder_image: body.holder_image,
      quiz_performance_weight: body.quiz_performance_weight ?? 0.3,
      content_performance_weight: body.content_performance_weight ?? 0.7,
      disable_send_certificate: body.disable_send_certificate ?? false,
      message_description: body.message_description,
    });

    this.courses.unshift(newCourse);
    this.lessonsByCourse.set(newCourse.id, []);
    this.persistState();
    return this.clone(newCourse);
  }

  updateCourse(courseId: string, body: Partial<Course>): Course {
    const course = this.courses.find((item) => item.id === courseId);
    if (!course) {
      throw new Error(`Course not found: ${courseId}`);
    }

    Object.assign(course, body, { updated: new Date().toISOString() });
    this.persistState();
    return this.clone(course);
  }

  deleteCourse(courseId: string): void {
    const index = this.courses.findIndex((course) => course.id === courseId);
    if (index >= 0) {
      this.courses.splice(index, 1);
      this.lessonsByCourse.delete(courseId);
      this.persistRelatedCourseArtifacts(courseId);
      this.persistState();
    }
  }

  fetchLessons(courseId: string): Lesson[] {
    return this.clone(this.lessonsByCourse.get(courseId) || []);
  }

  createLesson(courseId: string, body: { name: string; order: number }): Lesson {
    const lesson: Lesson = {
      id: this.uid('lesson'),
      name: body.name,
      description: '',
      course_id: courseId,
      order: body.order,
      contents: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    const lessons = this.lessonsByCourse.get(courseId) || [];
    lessons.push(lesson);
    this.lessonsByCourse.set(courseId, lessons);
    this.syncCourseCounters(courseId);
    this.persistState();
    return this.clone(lesson);
  }

  updateLesson(lessonId: string, body: Partial<Lesson>): void {
    const lesson = this.findLesson(lessonId);
    if (!lesson) {
      return;
    }
    Object.assign(lesson, body, { updated: new Date().toISOString() });
    this.persistState();
  }

  deleteLesson(lessonId: string): void {
    for (const [courseId, lessons] of this.lessonsByCourse.entries()) {
      const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
      if (lessonIndex >= 0) {
        lessons.splice(lessonIndex, 1);
        this.lessonsByCourse.set(courseId, lessons);
        this.syncCourseCounters(courseId);
        this.persistState();
        return;
      }
    }
  }

  getLessonContents(lessonId: string): Content[] {
    const lesson = this.findLesson(lessonId);
    return this.clone(lesson?.contents || []);
  }

  createLearnContent(body: { name: string; description?: string; type?: string; link?: string; blog?: string }) {
    const inferredType = (body.type || '').toUpperCase();
    const contentType =
      inferredType === 'BLOG'
        ? 'BLOG'
        : inferredType === 'IMAGE'
          ? 'IMAGE'
          : inferredType === 'VIDEO' || inferredType === 'YOUTUBE' || inferredType === 'VIMEO'
            ? 'VIDEO'
            : inferredType === 'PODCAST' || inferredType === 'SOUNDCLOUD'
              ? 'PODCAST'
              : inferredType === 'GOOGLE_DRIVE'
                ? 'PDF'
                : 'PDF';

    const learnContent: LearnContentRecord = {
      id: this.uid('learn-content'),
      name: body.name,
      description: body.description,
      content_type: contentType,
      url: body.link || body.blog || '',
      link: body.link,
      blog: body.blog,
    };

    this.learnContents.set(learnContent.id, learnContent);
    this.persistState();
    return this.clone(learnContent);
  }

  getLearnContent(contentId: string) {
    return this.clone(this.learnContents.get(contentId));
  }

  updateLearnContent(
    contentId: string,
    body: { name?: string; description?: string; type?: string; link?: string; blog?: string; url?: string },
  ) {
    const learnContent = this.learnContents.get(contentId);
    if (!learnContent) return null;

    const inferredType = (body.type || '').toUpperCase();
    const contentType =
      inferredType === 'BLOG'
        ? 'BLOG'
        : inferredType === 'IMAGE'
          ? 'IMAGE'
          : inferredType === 'VIDEO' || inferredType === 'YOUTUBE' || inferredType === 'VIMEO'
            ? 'VIDEO'
            : inferredType === 'PODCAST' || inferredType === 'SOUNDCLOUD'
              ? 'PODCAST'
              : 'PDF';

    Object.assign(learnContent, {
      name: body.name ?? learnContent.name,
      description: body.description ?? learnContent.description,
      content_type: body.type ? contentType : learnContent.content_type,
      url: body.url ?? body.link ?? body.blog ?? learnContent.url,
      link: body.link ?? learnContent.link,
      blog: body.blog ?? learnContent.blog,
    });

    this.learnContents.set(contentId, learnContent);
    this.persistState();
    return this.clone(learnContent);
  }

  getLearnContentTypes() {
    return this.contentTypes.map((type) => ({
      id: type.id,
      name: type.name,
      description: type.description,
      image: '',
      image_cover: '',
      extensions: '',
    }));
  }

  getLearnContentType(contentTypeId: string) {
    const type = this.contentTypes.find((item) => item.id === contentTypeId) || this.contentTypes[0];
    return {
      id: type.id,
      name: type.name,
      description: type.description,
      image: '',
      image_cover: '',
      extensions: '',
    };
  }

  deleteLearnContent(contentId: string) {
    this.learnContents.delete(contentId);
    this.persistState();
  }

  createLessonContent(
    lessonId: string,
    body: {
      name: string;
      description?: string;
      order: number;
      dispatch_in: number;
      dispatch_period: string;
      learn_content: string;
      type_id: string;
    },
  ): Content {
    const lesson = this.findLesson(lessonId);
    const type = this.contentTypes.find((item) => item.id === body.type_id) || this.contentTypes[0];
    const content: Content = {
      id: this.uid('content'),
      name: body.name,
      description: body.description || '',
      dispatch_in: body.dispatch_in,
      dispatch_period: body.dispatch_period,
      learn_content: body.learn_content,
      lesson_id: lessonId,
      order: body.order,
      type_id: body.type_id,
      type,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    if (lesson) {
      lesson.contents.push(content);
      lesson.contents.sort((a, b) => a.order - b.order);
      this.syncCourseCounters(lesson.course_id);
      this.persistState();
    }

    return this.clone(content);
  }

  updateContent(contentId: string, body: Partial<Content>): void {
    const content = this.findContent(contentId);
    if (!content) {
      return;
    }
    Object.assign(content, body, { updated: new Date().toISOString() });
    if (body.type_id) {
      content.type = this.contentTypes.find((item) => item.id === body.type_id) || content.type;
    }
    this.persistState();
  }

  deleteContent(contentId: string): void {
    for (const [courseId, lessons] of this.lessonsByCourse.entries()) {
      for (const lesson of lessons) {
        const index = lesson.contents.findIndex((content) => content.id === contentId);
        if (index >= 0) {
          const [removed] = lesson.contents.splice(index, 1);
          if (removed?.learn_content) {
            this.learnContents.delete(removed.learn_content);
          }
          this.syncCourseCounters(courseId);
          this.persistState();
          return;
        }
      }
    }
  }

  createExam(body: { title: string; exam_type: string }) {
    const examId = this.uid('exam');
    this.examQuestions.set(examId, [
      {
        id: this.uid('question'),
        workspace_id: this.workspace.id,
        user_creator_id: this.userProfile.id,
        question_type: body.exam_type === 'SURVEY' ? 'survey_choices' : 'correct_choices',
        title: body.title,
        points: 10,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        order: 1,
        question_input_type: 'CHOICE',
        options: [
          { id: this.uid('option'), option: 'Opcao 1', correct_answer: true },
          { id: this.uid('option'), option: 'Opcao 2', correct_answer: false },
        ],
      },
    ]);

    const typeId = body.exam_type === 'SURVEY' ? SURVEY_TYPE_ID : EVALUATIVE_TYPE_ID;
    const learnContent = {
      id: examId,
      name: body.title,
      description: '',
      content_type: typeId,
      url: '',
    };

    this.learnContents.set(examId, learnContent);
    this.persistState();
    return { id: examId, title: body.title, exam_type: body.exam_type };
  }

  getExamQuestions(examId: string) {
    return {
      count: (this.examQuestions.get(examId) || []).length,
      results: this.clone(this.examQuestions.get(examId) || []),
    };
  }

  createExamQuestion(examId: string, question: Partial<Question>) {
    const questions = this.examQuestions.get(examId) || [];
    const newQuestion: Question = {
      id: this.uid('question'),
      workspace_id: this.workspace.id,
      user_creator_id: this.userProfile.id,
      question_type: question.question_type || 'correct_choices',
      title: question.title || 'Nova pergunta',
      points: question.points || 10,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      options: question.options || [],
      order: questions.length + 1,
      question_input_type: question.question_input_type || 'CHOICE',
    };

    questions.push(newQuestion);
    this.examQuestions.set(examId, questions);
    this.persistState();
    return this.clone(newQuestion);
  }

  updateExamQuestion(questionId: string, body: Partial<Question>) {
    for (const questions of this.examQuestions.values()) {
      const question = questions.find((item) => item.id === questionId);
      if (question) {
        Object.assign(question, body, { updated_date: new Date().toISOString() });
        this.persistState();
        return this.clone(question);
      }
    }
    return null;
  }

  deleteExamQuestion(questionId: string): void {
    for (const [examId, questions] of this.examQuestions.entries()) {
      const index = questions.findIndex((item) => item.id === questionId);
      if (index >= 0) {
        questions.splice(index, 1);
        this.examQuestions.set(examId, questions);
        this.persistState();
        return;
      }
    }
  }

  listUsers(params: Record<string, string | number>) {
    const page = Number(params['page'] || 1);
    const perPage = Number(params['per_page'] || 10);
    const phone = String(params['phone__ilike'] || '').toLowerCase();
    const email = String(params['email__ilike'] || '').toLowerCase();
    const name = String(params['name__ilike'] || '').toLowerCase();
    const tagsIn = String(params['tags__in'] || '')
      .split(',')
      .filter(Boolean);
    const syncedIn = String(params['synced__in'] || '')
      .split(',')
      .filter(Boolean);
    let result = this.users.slice();

    if (phone) {
      result = result.filter((user) => user.phone.replace(/[-+()\s]/g, '').includes(phone));
    } else if (email) {
      result = result.filter((user) => user.email.toLowerCase().includes(email));
    } else if (name) {
      result = result.filter((user) => user.name.toLowerCase().includes(name));
    }

    if (tagsIn.length) {
      result = result.filter((user) =>
        user.tags
          ? user.tags
              .split(',')
              .map((t) => t.trim())
              .some((t) => tagsIn.includes(t))
          : false,
      );
    }

    if (syncedIn.length && syncedIn.length < 2) {
      if (syncedIn.includes('synced')) {
        result = result.filter((user) => !user.sync_check);
      } else if (syncedIn.includes('not_synced')) {
        result = result.filter((user) => !!user.sync_check);
      }
    }

    result = this.sortByField(result, String(params['sort'] || 'name'));
    const paginated = this.paginate(result, page, perPage);
    return {
      result: paginated.result,
      page: paginated.page,
      total_pages: paginated.total_pages,
      count: paginated.count,
    };
  }

  updateUser(userId: string, body: Partial<User>) {
    const user = this.users.find((item) => item.id === userId);
    if (user) {
      Object.assign(user, body);
    }
    return null;
  }

  removeUser(userId: string) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  listCourseEnrollments(courseId: string, params: Record<string, string | number>) {
    return this.listEnrollments({
      ...params,
      course_id: courseId,
      search: String(params['user__name__ilike'] || ''),
      status__in: String(params['status'] || params['status__in'] || ''),
    });
  }

  listEnrollments(params: Record<string, string | number>) {
    let result = this.enrollments.slice();
    const courseId = String(params['course_id'] || '');
    const status = String(params['status__in'] || '');
    const search = String(params['search'] || '').toLowerCase();

    if (courseId) {
      result = result.filter((enrollment) => enrollment.course_id === courseId);
    }
    if (status) {
      const statuses = status.split(',').filter(Boolean);
      result = result.filter((enrollment) => statuses.includes(enrollment.status));
    }
    if (search && search.length >= 3) {
      result = result.filter(
        (enrollment) =>
          enrollment.user.name.toLowerCase().includes(search) || enrollment.user.email.toLowerCase().includes(search),
      );
    }

    result = this.sortByField(result, String(params['sort'] || '-created'));
    return this.paginate(result, Number(params['page'] || 1), Number(params['per_page'] || 10));
  }

  createEnrollment(data: { user_id: string; course_id: string }) {
    const created = this.createEnrollmentRecord(data.course_id, data.user_id, 'WAITING', 0, 0);
    this.enrollments.unshift(created);
    return this.clone(created);
  }

  createEnrollmentUser(data: { name: string; phone: string; email: string; tags: string; course_id: string }) {
    const userId = this.uid('user');
    this.users.unshift({
      id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      tags: data.tags || '',
      selected: false,
      sync_check: null,
    });
    return this.createEnrollment({ user_id: userId, course_id: data.course_id });
  }

  updateEnrollment(enrollmentId: string, body: Partial<EnrollmentRecord>) {
    const enrollment = this.enrollments.find((item) => item.id === enrollmentId);
    if (enrollment) {
      Object.assign(enrollment, body, { updated: new Date().toISOString() });
      return this.clone(enrollment);
    }
    return null;
  }

  deleteEnrollment(enrollmentId: string) {
    const index = this.enrollments.findIndex((item) => item.id === enrollmentId);
    if (index >= 0) {
      this.enrollments.splice(index, 1);
    }
  }

  deleteBatchEnrollments(ids: string[]) {
    ids.forEach((id) => this.deleteEnrollment(id));
  }

  getEnrollmentTracking(enrollmentId: string): Tracking[] {
    return this.clone(this.trackingByEnrollment.get(enrollmentId) || []);
  }

  countSentMessages() {
    return {
      messages_sent_count: this.enrollments.reduce((total, enrollment) => total + enrollment.messages_sent_count, 0),
    };
  }

  countPendingMessages() {
    return {
      message_pending_count: this.enrollments.reduce(
        (total, enrollment) => total + enrollment.messages_pending_count,
        0,
      ),
    };
  }

  countUsers() {
    return { users_count: this.users.length };
  }

  countEnrollmentStatuses() {
    return {
      started_count: this.enrollments.filter((enrollment) => enrollment.status === 'STARTED').length,
      waiting_count: this.enrollments.filter((enrollment) => enrollment.status === 'WAITING').length,
    };
  }

  renewEnrollmentContentAccess() {
    return null;
  }

  async uploadImage(file: File | null): Promise<{ url: string }> {
    if (!file) {
      return { url: `https://picsum.photos/seed/${this.uid('image')}/800/450` };
    }

    const url = await this.fileToDataUrl(file);
    return { url };
  }

  uploadCoverImages() {
    const token = this.uid('cover');
    return {
      large: `https://picsum.photos/seed/${token}-large/1200/675`,
      small: `https://picsum.photos/seed/${token}-small/600/338`,
      vertical: `https://picsum.photos/seed/${token}-vertical/540/960`,
    };
  }

  transferOwnership(courseId: string, userId: string) {
    const course = this.courses.find((item) => item.id === courseId);
    if (course) {
      course.user_creator = { id: userId };
      this.persistState();
    }
    return { success: true };
  }

  private seedCourseContent() {
    const onboardingLesson = this.createLesson('course-onboarding', { name: 'Boas-vindas', order: 1 });
    this.createLessonContent(onboardingLesson.id, {
      name: 'Video de boas-vindas',
      description: 'Abertura do programa.',
      order: 1,
      dispatch_in: 1,
      dispatch_period: 'MORNING',
      learn_content: this.createLearnContent({ name: 'Video de boas-vindas', type: 'YOUTUBE' }).id,
      type_id: 'ct-video',
    });
    this.createLessonContent(onboardingLesson.id, {
      name: 'Manual comercial PDF',
      description: 'Guia pratico de uso.',
      order: 2,
      dispatch_in: 2,
      dispatch_period: 'AFTERNOON',
      learn_content: this.createLearnContent({ name: 'Manual comercial PDF', type: 'FILE' }).id,
      type_id: 'ct-pdf',
    });

    const onboardingLessonTwo = this.createLesson('course-onboarding', { name: 'Qualificacao', order: 2 });
    const exam = this.createExam({ title: 'Quiz de qualificacao', exam_type: 'EVALUATIVE' });
    this.createLessonContent(onboardingLessonTwo.id, {
      name: 'Quiz de qualificacao',
      description: 'Valida os conceitos do onboarding.',
      order: 1,
      dispatch_in: 4,
      dispatch_period: 'MORNING',
      learn_content: exam.id,
      type_id: EVALUATIVE_TYPE_ID,
    });

    const playbookLesson = this.createLesson('course-playbook', { name: 'Sprint de lancamento', order: 1 });
    this.createLessonContent(playbookLesson.id, {
      name: 'Checklist visual',
      description: 'Resumo visual da campanha.',
      order: 1,
      dispatch_in: 1,
      dispatch_period: 'MORNING',
      learn_content: this.createLearnContent({ name: 'Checklist visual', type: 'FILE' }).id,
      type_id: 'ct-image',
    });

    const complianceLesson = this.createLesson('course-compliance', { name: 'Politicas', order: 1 });
    this.createLessonContent(complianceLesson.id, {
      name: 'Codigo de conduta',
      description: 'Politicas e diretrizes principais.',
      order: 1,
      dispatch_in: 1,
      dispatch_period: 'MORNING',
      learn_content: this.createLearnContent({ name: 'Codigo de conduta', type: 'BLOG' }).id,
      type_id: 'ct-blog',
    });

    const retentionLesson = this.createLesson('course-retention', { name: 'Escuta ativa', order: 1 });
    this.createLessonContent(retentionLesson.id, {
      name: 'Podcast de abordagem',
      description: 'Treino de ligacao consultiva.',
      order: 1,
      dispatch_in: 2,
      dispatch_period: 'NIGHT',
      learn_content: this.createLearnContent({ name: 'Podcast de abordagem', type: 'SOUNDCLOUD' }).id,
      type_id: 'ct-podcast',
    });

    for (const enrollment of this.enrollments) {
      this.trackingByEnrollment.set(enrollment.id, this.buildTracking(enrollment));
    }
  }

  private buildTracking(enrollment: EnrollmentRecord): Tracking[] {
    const lessons = this.lessonsByCourse.get(enrollment.course_id) || [];
    const contents = lessons.flatMap((lesson) => lesson.contents);
    return contents.map((content, index) => ({
      idGenerated: index + 1,
      content_name: content.name,
      content_type: { id: content.type_id, name: content.type?.name || 'content' },
      first_access: '2026-05-03T10:00:00.000Z',
      last_access: '2026-05-04T11:00:00.000Z',
      duration: 320,
      content_duration: 480,
      learn_duration: '05:20',
      total_correct_answers: content.type_id === EVALUATIVE_TYPE_ID ? 4 : 0,
      total_questions: content.type_id === EVALUATIVE_TYPE_ID ? 5 : 0,
      schedule_status: enrollment.status === 'WAITING' ? 'WAITING' : 'SENT',
      content: this.clone(content),
    }));
  }

  private seedEnrollment(
    id: string,
    courseId: string,
    userId: string,
    status: string,
    progress: number,
    performance: number,
  ) {
    return this.createEnrollmentRecord(courseId, userId, status, progress, performance, id);
  }

  private createEnrollmentRecord(
    courseId: string,
    userId: string,
    status: string,
    progress: number,
    performance: number,
    forcedId?: string,
  ): EnrollmentRecord {
    const course = this.courses.find((item) => item.id === courseId) || this.courses[0];
    const user = this.users.find((item) => item.id === userId) || this.users[0];
    const lesson = (this.lessonsByCourse.get(courseId) || [])[0];
    const content = lesson?.contents[0];
    const now = new Date().toISOString();

    return {
      id: forcedId || this.uid('enrollment'),
      workspace_id: this.workspace.id,
      course_id: course.id,
      course: { id: course.id, name: course.name },
      user_id: user.id,
      user: { email: user.email, name: user.name, phone: user.phone, tags: user.tags },
      status,
      progress,
      performance,
      points: String(Math.round(performance * 100)),
      start_date: '2026-05-01T10:00:00.000Z',
      end_date: '2026-06-01T18:00:00.000Z',
      created_on: now,
      created: now,
      updated: now,
      current_content: content?.name || 'Aguardando primeiro disparo',
      current_content_id: content?.id || '',
      current_lesson: lesson ? { id: lesson.id, name: lesson.name } : null,
      current_lesson_id: lesson?.id || '',
      timezone: 'America/Sao_Paulo',
      selected: false,
      messages_pending_count: status === 'WAITING' ? 2 : 0,
      messages_sent_count: status === 'WAITING' ? 0 : 6,
    };
  }

  private createCourse(
    overrides: Partial<Course> & Pick<Course, 'id' | 'name' | 'description' | 'category_id' | 'lang'>,
  ): Course {
    const now = new Date().toISOString();
    return {
      id: overrides.id,
      name: overrides.name,
      description: overrides.description,
      category_id: overrides.category_id,
      lang: overrides.lang,
      is_active: overrides.is_active ?? true,
      status: overrides.status ?? 'CREATING',
      total_contents: overrides.total_contents ?? 0,
      total_lessons: overrides.total_lessons ?? 0,
      total_users_enrolled: overrides.total_users_enrolled ?? 0,
      total_users_completed: overrides.total_users_completed ?? 0,
      content_performance_weight: overrides.content_performance_weight ?? 0.7,
      quiz_performance_weight: overrides.quiz_performance_weight ?? 0.3,
      disable_send_certificate: overrides.disable_send_certificate ?? false,
      created: overrides.created || now,
      updated: overrides.updated || now,
      holder_image: overrides.holder_image || `https://picsum.photos/seed/${overrides.id}-holder/1200/675`,
      thumb_image: overrides.thumb_image || `https://picsum.photos/seed/${overrides.id}-thumb/600/338`,
      user_creator: overrides.user_creator || { id: this.userProfile.id, name: this.userProfile.name },
      message_description: overrides.message_description,
      category: this.categories.find((category) => category.id === overrides.category_id),
      points: overrides.points,
      duration: overrides.duration,
    };
  }

  private createNotification(
    id: string,
    message: string,
    action: SmartZapNotificationType,
    content: string,
    updated: string,
  ): KpNotificationSmartzapModel {
    return {
      id,
      title: `REPORTS.${message}`,
      created_at: updated,
      entity: {
        id,
        message,
        content,
        created: updated,
        updated,
        type: { action } as any,
      } as any,
    };
  }

  private findLesson(lessonId: string): Lesson | undefined {
    for (const lessons of this.lessonsByCourse.values()) {
      const lesson = lessons.find((item) => item.id === lessonId);
      if (lesson) {
        return lesson;
      }
    }
    return undefined;
  }

  private findContent(contentId: string): Content | undefined {
    for (const lessons of this.lessonsByCourse.values()) {
      for (const lesson of lessons) {
        const content = lesson.contents.find((item) => item.id === contentId);
        if (content) {
          return content;
        }
      }
    }
    return undefined;
  }

  private syncCourseCounters(courseId: string) {
    const course = this.courses.find((item) => item.id === courseId);
    const lessons = this.lessonsByCourse.get(courseId) || [];
    if (course) {
      course.total_lessons = lessons.length;
      course.total_contents = lessons.reduce((total, lesson) => total + lesson.contents.length, 0);
      course.updated = new Date().toISOString();
    }
  }

  private hydratePersistedState(): boolean {
    const storage = this.getStorage();
    const persistedState = storage?.getItem(this.storageKey);

    if (!persistedState) {
      return false;
    }

    try {
      const state = JSON.parse(persistedState) as PrototypePersistedState;

      this.courses.splice(0, this.courses.length, ...(state.courses || []).map((course) => this.hydrateCourse(course)));
      this.lessonsByCourse.clear();
      Object.entries(state.lessonsByCourse || {}).forEach(([courseId, lessons]) => {
        this.lessonsByCourse.set(courseId, lessons || []);
      });

      this.learnContents.clear();
      Object.entries(state.learnContents || {}).forEach(([id, content]) => {
        this.learnContents.set(id, content);
      });

      this.examQuestions.clear();
      Object.entries(state.examQuestions || {}).forEach(([id, questions]) => {
        this.examQuestions.set(id, questions || []);
      });

      for (const enrollment of this.enrollments) {
        this.trackingByEnrollment.set(enrollment.id, this.buildTracking(enrollment));
      }

      return true;
    } catch (error) {
      console.error('[Smartzap prototype] failed to hydrate persisted state', error);
      storage?.removeItem(this.storageKey);
      return false;
    }
  }

  private persistState(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    try {
      const snapshot: PrototypePersistedState = {
        courses: this.courses.map((course) => this.stripDataUrls(this.hydrateCourse(course))),
        lessonsByCourse: Object.fromEntries(this.lessonsByCourse.entries()),
        learnContents: Object.fromEntries(this.learnContents.entries()),
        examQuestions: Object.fromEntries(this.examQuestions.entries()),
      };

      storage.setItem(this.storageKey, JSON.stringify(snapshot));
    } catch (error) {
      console.warn('[Smartzap prototype] failed to persist state to localStorage', error);
    }
  }

  private stripDataUrls(course: Course): Course {
    return {
      ...course,
      holder_image: course.holder_image?.startsWith('data:') ? undefined : course.holder_image,
      thumb_image: course.thumb_image?.startsWith('data:') ? undefined : course.thumb_image,
    };
  }

  private persistRelatedCourseArtifacts(courseId: string): void {
    const lessons = this.lessonsByCourse.get(courseId) || [];
    const learnContentIds = lessons
      .flatMap((lesson) => lesson.contents.map((content) => content.learn_content))
      .filter(Boolean);

    learnContentIds.forEach((learnContentId) => {
      this.learnContents.delete(learnContentId);
      this.examQuestions.delete(learnContentId);
    });
  }

  private hydrateCourse(course: Course): Course {
    return {
      ...course,
      category: this.categories.find((category) => category.id === course.category_id),
    };
  }

  private getStorage(): Storage | null {
    return typeof globalThis !== 'undefined' && 'localStorage' in globalThis ? globalThis.localStorage : null;
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => resolve(String(reader.result || '')));
      reader.addEventListener('error', () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  }

  private paginate<T extends { id?: string }>(collection: T[], page: number, perPage: number) {
    const safePage = Math.max(page, 1);
    const safePerPage = Math.max(perPage, 1);
    const start = (safePage - 1) * safePerPage;
    const result = collection.slice(start, start + safePerPage);

    return {
      count: collection.length,
      page: safePage,
      per_page: safePerPage,
      total_pages: Math.max(1, Math.ceil(collection.length / safePerPage)),
      result: this.clone(result),
    };
  }

  private sortByField<T extends Record<string, any>>(collection: T[], sort: string): T[] {
    const isDesc = sort.startsWith('-');
    const field = isDesc ? sort.slice(1) : sort;
    return collection.slice().sort((left, right) => {
      const leftValue = String(left[field] ?? '').toLowerCase();
      const rightValue = String(right[field] ?? '').toLowerCase();
      if (leftValue === rightValue) {
        return 0;
      }
      return leftValue > rightValue ? (isDesc ? -1 : 1) : isDesc ? 1 : -1;
    });
  }

  private toArray(value: string | number | string[] | undefined): string[] {
    if (Array.isArray(value)) {
      return value.map(String);
    }
    if (typeof value === 'number') {
      return [String(value)];
    }
    if (typeof value === 'string' && value.length) {
      return value.split(',').filter(Boolean);
    }
    return [];
  }

  private uid(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private clone<T>(value: T): T {
    return value === undefined ? value : JSON.parse(JSON.stringify(value));
  }
}
