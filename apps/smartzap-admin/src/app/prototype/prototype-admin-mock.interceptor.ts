import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, from, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { PrototypeAdminStateService } from './prototype-admin-state.service';

@Injectable()
export class PrototypeAdminMockInterceptor implements HttpInterceptor {
  constructor(private readonly state: PrototypeAdminStateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const mockedResponse = this.safeHandleRequest(request);
    if (mockedResponse === undefined) {
      return next.handle(request);
    }

    return from(Promise.resolve(mockedResponse)).pipe(
      mergeMap((body) => of(new HttpResponse({ status: 200, body })).pipe(delay(80))),
    );
  }

  private safeHandleRequest(request: HttpRequest<unknown>): unknown | Promise<unknown> {
    try {
      return this.handleRequest(request);
    } catch (error) {
      const pathname = this.getPathname(request.url);
      console.error('[Smartzap prototype] mock request failed', request.method, pathname, error);
      return this.buildFallbackResponse(request.method, pathname);
    }
  }

  private handleRequest(request: HttpRequest<unknown>): unknown {
    const body = this.parseBody(request.body);
    const params = this.getParams(request);

    if (request.url.startsWith(environment.apps.smartzap.api)) {
      const pathname = this.getRelativePath(request.url, environment.apps.smartzap.api);
      return this.handleSmartzapRequest(request.method, pathname, params, body);
    }

    if (request.url.startsWith(environment.apps.myAccount.apiV2)) {
      const pathname = this.getRelativePath(request.url, environment.apps.myAccount.apiV2);
      return this.handleMyAccountRequest(request.method, pathname, body);
    }

    if (request.url.startsWith(environment.apps.kontent.api)) {
      const pathname = this.getRelativePath(request.url, environment.apps.kontent.api);
      return this.handleKontentRequest(request.method, pathname, body, params);
    }

    if (request.url.startsWith(environment.apps.konquest.api)) {
      const pathname = this.getRelativePath(request.url, environment.apps.konquest.api);
      return this.handleKonquestRequest(request.method, pathname);
    }

    if (request.url.startsWith(environment.apps.certificateManager.api)) {
      const pathname = this.getRelativePath(request.url, environment.apps.certificateManager.api);
      return this.handleCertificateManagerRequest(request.method, pathname, body);
    }

    if (request.url.startsWith(environment.apps.pushManager.api)) {
      const pathname = this.getRelativePath(request.url, environment.apps.pushManager.api);
      return this.handlePushManagerRequest(request.method, pathname, params, body);
    }

    return undefined;
  }

  private handleSmartzapRequest(
    method: string,
    pathname: string,
    params: Record<string, string>,
    body: Record<string, any> | FormData,
  ) {
    const payload = body instanceof FormData ? {} : body;

    if (method === 'GET' && pathname === '/course') {
      return this.state.listCourses(params);
    }

    if (method === 'POST' && pathname === '/course') {
      return this.state.saveCourse(payload);
    }

    if (
      method === 'GET' &&
      pathname.startsWith('/course/') &&
      !pathname.endsWith('/lesson') &&
      !pathname.endsWith('/enrollment')
    ) {
      return this.state.getCourse(this.getId(pathname, '/course/'));
    }

    if (method === 'PATCH' && pathname.startsWith('/course/') && !pathname.endsWith('/publish')) {
      return this.state.updateCourse(this.getId(pathname, '/course/'), payload);
    }

    if (method === 'DELETE' && pathname.startsWith('/course/')) {
      this.state.deleteCourse(this.getId(pathname, '/course/'));
      return null;
    }

    if (method === 'POST' && pathname.endsWith('/publish')) {
      return { status: 'PROCESSING' };
    }

    if (method === 'POST' && pathname.includes('/transfer-ownership/')) {
      const [, courseId, userId] = pathname.match(/^\/course\/([^/]+)\/transfer-ownership\/([^/]+)$/) || [];
      return this.state.transferOwnership(courseId, userId);
    }

    if (method === 'GET' && pathname.endsWith('/lesson')) {
      return { result: this.state.fetchLessons(this.getNestedId(pathname, 'course')) };
    }

    if (method === 'POST' && pathname === '/lesson') {
      return this.state.createLesson(String(payload['course_id'] || ''), {
        name: String(payload['name'] || 'Nova licao'),
        order: Number(payload['order'] || 1),
      });
    }

    if (method === 'PATCH' && pathname.startsWith('/lesson/')) {
      this.state.updateLesson(this.getId(pathname, '/lesson/'), payload);
      return null;
    }

    if (method === 'DELETE' && pathname.startsWith('/lesson/')) {
      this.state.deleteLesson(this.getId(pathname, '/lesson/'));
      return null;
    }

    if (method === 'GET' && pathname.endsWith('/content') && pathname.startsWith('/lesson/')) {
      return { result: this.state.getLessonContents(this.getNestedId(pathname, 'lesson')) };
    }

    if (method === 'POST' && pathname === '/content') {
      return this.state.createLessonContent(String(payload['lesson_id'] || ''), {
        name: String(payload['name'] || 'Novo conteudo'),
        description: String(payload['description'] || ''),
        order: Number(payload['order'] || 1),
        dispatch_in: Number(payload['dispatch_in'] || 1),
        dispatch_period: String(payload['dispatch_period'] || 'MORNING'),
        learn_content: String(payload['learn_content'] || ''),
        type_id: String(payload['type_id'] || ''),
      });
    }

    if (method === 'PATCH' && pathname.startsWith('/content/')) {
      this.state.updateContent(this.getId(pathname, '/content/'), payload);
      return null;
    }

    if (method === 'DELETE' && pathname.startsWith('/content/')) {
      this.state.deleteContent(this.getId(pathname, '/content/'));
      return null;
    }

    if (method === 'POST' && pathname.endsWith('/renew-access')) {
      return this.state.renewEnrollmentContentAccess();
    }

    if (method === 'GET' && pathname === '/course-category') {
      return { result: this.state.getCategories() };
    }

    if (method === 'GET' && pathname === '/course/language') {
      return { idioms: this.state.getLanguages() };
    }

    if (method === 'POST' && pathname === '/upload/image') {
      const file = body instanceof FormData ? body.get('file') : null;
      return this.state.uploadImage(file instanceof File ? file : null);
    }

    if (method === 'GET' && pathname === '/user') {
      return this.state.listUsers(params);
    }

    if (method === 'PATCH' && pathname.startsWith('/user/')) {
      return this.state.updateUser(this.getId(pathname, '/user/'), payload);
    }

    if (method === 'DELETE' && pathname.startsWith('/user/')) {
      this.state.removeUser(this.getId(pathname, '/user/'));
      return null;
    }

    if (method === 'GET' && pathname === '/user/count') {
      return this.state.countUsers();
    }

    if (method === 'GET' && pathname === '/user/notification') {
      return { result: this.state.getNotifications().map((notification) => notification.entity) };
    }

    if (method === 'PATCH' && pathname.startsWith('/user/notification/')) {
      return this.state.markNotificationRead(this.getId(pathname, '/user/notification/'))?.entity ?? null;
    }

    if (method === 'POST' && pathname === '/user/notification/batch-read') {
      return this.state.clearNotifications();
    }

    if (method === 'GET' && pathname.endsWith('/enrollment') && pathname.startsWith('/course/')) {
      return this.state.listCourseEnrollments(this.getNestedId(pathname, 'course'), params);
    }

    if (method === 'GET' && pathname === '/enrollment') {
      return this.state.listEnrollments(params);
    }

    if (method === 'POST' && pathname === '/enrollment') {
      return this.state.createEnrollment({
        user_id: String(payload['user_id'] || ''),
        course_id: String(payload['course_id'] || ''),
      });
    }

    if (method === 'POST' && pathname === '/enrollment/user') {
      return this.state.createEnrollmentUser({
        name: String(payload['name'] || ''),
        phone: String(payload['phone'] || ''),
        email: String(payload['email'] || ''),
        tags: String(payload['tags'] || ''),
        course_id: String(payload['course_id'] || ''),
      });
    }

    if (method === 'POST' && pathname === '/enrollment/file') {
      return { success: true, imported: 3 };
    }

    if (method === 'PATCH' && pathname.startsWith('/enrollment/')) {
      return this.state.updateEnrollment(this.getId(pathname, '/enrollment/'), payload);
    }

    if (method === 'DELETE' && pathname === '/enrollment/batch') {
      this.state.deleteBatchEnrollments((payload['ids'] || []) as string[]);
      return null;
    }

    if (method === 'DELETE' && pathname.startsWith('/enrollment/')) {
      this.state.deleteEnrollment(this.getId(pathname, '/enrollment/'));
      return null;
    }

    if (method === 'GET' && pathname.endsWith('/tracking') && pathname.startsWith('/enrollment/')) {
      return { result: this.state.getEnrollmentTracking(this.getNestedId(pathname, 'enrollment')) };
    }

    if (method === 'GET' && pathname === '/schedule/sent-messages-count') {
      return this.state.countSentMessages();
    }

    if (method === 'GET' && pathname === '/enrollment/messages-pending-count') {
      return this.state.countPendingMessages();
    }

    if (method === 'GET' && pathname === '/enrollment/status-count') {
      return this.state.countEnrollmentStatuses();
    }

    if (method === 'GET' && pathname.startsWith('/workspace/') && pathname.endsWith('/billing')) {
      return this.state.getBilling();
    }

    return undefined;
  }

  private handleMyAccountRequest(method: string, pathname: string, body: Record<string, any>) {
    if (method === 'GET' && pathname === '/workspaces') {
      return { data: this.state.getWorkspaceBasicList() };
    }

    if (method === 'GET' && pathname.startsWith('/workspaces/') && pathname.endsWith('/smartzap-configuration')) {
      const config = this.state.getSmartzapConfiguration();
      return {
        messages_content_embed: config.messagesContentEmbed,
        send_courses_recommendation_message: config.sendCoursesRecommendationMessage,
        send_course_reminder_message: config.sendCourseReminderMessage,
        interact_with_random_messages: config.interactWithRandomMessages,
        enrollment_idle_days_limit: config.enrollmentIdleDaysLimit,
        courses_portal_url: config.coursesPortalUrl,
      };
    }

    if (method === 'PATCH' && pathname.startsWith('/workspaces/') && pathname.endsWith('/smartzap-configuration')) {
      const config = this.state.updateSmartzapConfiguration({
        messagesContentEmbed: Boolean(body['messagesContentEmbed']),
        sendCoursesRecommendationMessage: Boolean(body['sendCoursesRecommendationMessage']),
        sendCourseReminderMessage: Boolean(body['sendCourseReminderMessage']),
        interactWithRandomMessages: Boolean(body['interactWithRandomMessages']),
        enrollmentIdleDaysLimit: Number(body['enrollmentIdleDaysLimit']) || null,
        coursesPortalUrl: String(body['coursesPortalUrl'] || ''),
      });

      return {
        messages_content_embed: config.messagesContentEmbed,
        send_courses_recommendation_message: config.sendCoursesRecommendationMessage,
        send_course_reminder_message: config.sendCourseReminderMessage,
        interact_with_random_messages: config.interactWithRandomMessages,
        enrollment_idle_days_limit: config.enrollmentIdleDaysLimit,
        courses_portal_url: config.coursesPortalUrl,
      };
    }

    if (method === 'GET' && pathname.startsWith('/workspaces/')) {
      return this.state.getWorkspace();
    }

    if (method === 'PATCH' && pathname.startsWith('/workspaces/')) {
      return this.state.updateWorkspace(body);
    }

    if (method === 'GET' && pathname === '/application-services') {
      return this.state.getWorkspaceServices();
    }

    if (method === 'GET' && pathname === '/users/info') {
      return this.state.getUserProfile();
    }

    if (method === 'GET' && pathname === '/users-roles') {
      return this.state.getUsersByRole();
    }

    return undefined;
  }

  private handleKontentRequest(
    method: string,
    pathname: string,
    body: Record<string, any> | FormData,
    params: Record<string, string>,
  ) {
    if (method === 'POST' && pathname === '/learn-content') {
      const name =
        body instanceof FormData ? String(body.get('name') || 'Novo learn content') : String(body['name'] || '');
      const description =
        body instanceof FormData ? String(body.get('description') || '') : String(body['description'] || '');
      const link = body instanceof FormData ? String(body.get('link') || '') : String(body['link'] || '');
      const blog = body instanceof FormData ? String(body.get('blog') || '') : String(body['blog'] || '');

      return this.state.createLearnContent({
        name,
        description,
        type: this.guessContentType(body),
        link,
        blog,
      });
    }

    if (method === 'GET' && pathname === '/learn-content/types') {
      return this.state.getLearnContentTypes();
    }

    if (method === 'GET' && pathname.startsWith('/learn-content/types/')) {
      return this.state.getLearnContentType(this.getId(pathname, '/learn-content/types/'));
    }

    if (method === 'GET' && pathname.startsWith('/learn-content/')) {
      return this.state.getLearnContent(this.getId(pathname, '/learn-content/'));
    }

    if (method === 'PATCH' && pathname.startsWith('/learn-content/')) {
      const name = body instanceof FormData ? String(body.get('name') || '') : String(body['name'] || '');
      const description =
        body instanceof FormData ? String(body.get('description') || '') : String(body['description'] || '');
      const link = body instanceof FormData ? String(body.get('link') || '') : String(body['link'] || '');
      const blog = body instanceof FormData ? String(body.get('blog') || '') : String(body['blog'] || '');
      const file = body instanceof FormData ? body.get('file') : null;

      return this.state.updateLearnContent(this.getId(pathname, '/learn-content/'), {
        name,
        description,
        type: file
          ? this.guessContentType(body)
          : String(body instanceof FormData ? body.get('type') || '' : body['type'] || ''),
        link,
        blog,
        url: file
          ? `https://prototype.local/uploads/${encodeURIComponent(String((file as File)?.name || 'arquivo'))}`
          : undefined,
      });
    }

    if (method === 'DELETE' && pathname.startsWith('/learn-content/')) {
      this.state.deleteLearnContent(this.getId(pathname, '/learn-content/'));
      return null;
    }

    if (method === 'POST' && pathname === '/assessments/exams') {
      return this.state.createExam(body as any);
    }

    if (method === 'GET' && pathname.endsWith('/questions') && pathname.startsWith('/assessments/exams/')) {
      return this.state.getExamQuestions(this.getNestedId(pathname, 'exams'));
    }

    if (method === 'POST' && pathname.endsWith('/questions') && pathname.startsWith('/assessments/exams/')) {
      return this.state.createExamQuestion(this.getNestedId(pathname, 'exams'), body as any);
    }

    if (method === 'PATCH' && pathname.startsWith('/assessments/questions/')) {
      return this.state.updateExamQuestion(this.getId(pathname, '/assessments/questions/'), body as any);
    }

    if (method === 'DELETE' && pathname.startsWith('/assessments/questions/')) {
      this.state.deleteExamQuestion(this.getId(pathname, '/assessments/questions/'));
      return null;
    }

    return undefined;
  }

  private handleKonquestRequest(method: string, pathname: string) {
    if (method === 'POST' && pathname === '/learn-contents/cover-images') {
      return this.state.uploadCoverImages();
    }

    return undefined;
  }

  private handleCertificateManagerRequest(method: string, pathname: string, body: Record<string, any> | FormData) {
    const payload: Record<string, unknown> = {};
    if (body instanceof FormData) {
      body.forEach((value, key) => {
        payload[key] = value;
      });
    } else {
      Object.assign(payload, body);
    }

    if (method === 'GET' && pathname === '/certificates') {
      return this.state.listCertificates(payload as Record<string, string>);
    }

    if (method === 'POST' && pathname === '/certificates') {
      return this.state.createCertificate(payload);
    }

    if (method === 'PATCH' && pathname.startsWith('/certificates/') && !pathname.endsWith('/toggle-default')) {
      return this.state.updateCertificate(this.getId(pathname, '/certificates/'), payload);
    }

    if (method === 'DELETE' && pathname.startsWith('/certificates/')) {
      this.state.deleteCertificate(this.getId(pathname, '/certificates/'));
      return null;
    }

    if (method === 'POST' && pathname === '/certificates/toggle-default') {
      return this.state.toggleDefaultCertificate(String(payload['certificateId'] || ''));
    }

    if (method === 'POST' && pathname === '/certificates/images') {
      return { url: 'https://media.keepsdev.com/certificate-manager/default-images/landscape.png' };
    }

    return undefined;
  }

  private handlePushManagerRequest(
    method: string,
    pathname: string,
    params: Record<string, string>,
    body: Record<string, any> | FormData,
  ): unknown {
    if (method === 'GET' && pathname === '/templates') {
      return {
        itens: [
          {
            id: 'tpl-onboarding',
            content_sid: 'HX001',
            name: 'Boas-vindas ao Treinamento',
            title: 'Boas-vindas!',
            body_preview: 'Olá {{nome}}! Você foi inscrito no treinamento *{{curso}}*. Acesse: {{link}}',
            variables: [
              { position: 0, name: 'nome', required: true },
              { position: 1, name: 'curso', required: true },
              { position: 2, name: 'link', required: true },
            ],
            category: 'UTILITY',
            language: 'pt-BR',
            is_active: true,
            cost_per_message: '0.15',
          },
          {
            id: 'tpl-reminder',
            content_sid: 'HX002',
            name: 'Lembrete de Conclusão',
            title: 'Lembrete!',
            body_preview: 'Oi {{nome}}, não esqueça de concluir o curso *{{curso}}* até {{data}}.',
            variables: [
              { position: 0, name: 'nome', required: true },
              { position: 1, name: 'curso', required: true },
              { position: 2, name: 'data', required: true },
            ],
            category: 'UTILITY',
            language: 'pt-BR',
            is_active: true,
            cost_per_message: '0.12',
          },
          {
            id: 'tpl-certificate',
            content_sid: 'HX003',
            name: 'Certificado Disponível',
            title: 'Seu certificado chegou!',
            body_preview: '{{nome}}, seu certificado do curso *{{curso}}* está pronto! Baixe aqui: {{link}}',
            variables: [
              { position: 0, name: 'nome', required: true },
              { position: 1, name: 'curso', required: true },
              { position: 2, name: 'link', required: true },
            ],
            category: 'MARKETING',
            language: 'pt-BR',
            is_active: true,
            cost_per_message: '0.10',
          },
        ],
        total: 3,
      };
    }

    if (method === 'GET' && pathname === '/wallet/balance') {
      return { balance: 18240, currency: 'BRL' };
    }

    if (method === 'GET' && pathname === '/wallet/general-stats') {
      return { total_dispatches: 4320, total_investment: '648.00' };
    }

    if (method === 'GET' && pathname === '/campaigns') {
      const page = Number(params['page'] || 1);
      const perPage = Number(params['per_page'] || 10);
      const campaigns = [
        {
          id: 'camp-1',
          name: 'Onboarding Comercial — Maio',
          status: 'COMPLETED',
          template_name: 'Boas-vindas ao Treinamento',
          contacts_count: 124,
          sent_count: 118,
          failed_count: 6,
          scheduled_at: '2026-05-10T09:00:00.000Z',
          completed_at: '2026-05-10T09:05:00.000Z',
          cost: '18.60',
        },
        {
          id: 'camp-2',
          name: 'Lembrete Compliance',
          status: 'COMPLETED',
          template_name: 'Lembrete de Conclusão',
          contacts_count: 210,
          sent_count: 205,
          failed_count: 5,
          scheduled_at: '2026-05-08T14:00:00.000Z',
          completed_at: '2026-05-08T14:06:00.000Z',
          cost: '25.20',
        },
        {
          id: 'camp-3',
          name: 'Certificados Disponíveis',
          status: 'SCHEDULED',
          template_name: 'Certificado Disponível',
          contacts_count: 91,
          sent_count: 0,
          failed_count: 0,
          scheduled_at: '2026-05-28T10:00:00.000Z',
          completed_at: null,
          cost: '9.10',
        },
        {
          id: 'camp-4',
          name: 'Cultura Empresarial — Junho',
          status: 'SCHEDULED',
          template_name: 'Boas-vindas ao Treinamento',
          contacts_count: 312,
          sent_count: 0,
          failed_count: 0,
          scheduled_at: '2026-06-02T08:00:00.000Z',
          completed_at: null,
          cost: '46.80',
        },
      ];
      const statusFilter: string[] = params['status'] ? String(params['status']).split(',') : [];
      const filtered = statusFilter.length ? campaigns.filter((c) => statusFilter.includes(c.status)) : campaigns;
      const start = (page - 1) * perPage;
      return {
        data: filtered.slice(start, start + perPage),
        meta: {
          totalItems: filtered.length,
          totalPages: Math.ceil(filtered.length / perPage),
          current_page: page,
          itemsPerPage: perPage,
          sortBy: [],
        },
        links: { current: '', last: '', next: '', previous: '', first: '' },
      };
    }

    if (method === 'POST' && pathname.includes('/cancel')) {
      return null;
    }

    if (method === 'POST' && pathname === '/campaigns/validate') {
      return {
        template_id: 'tpl-onboarding',
        template_name: 'Boas-vindas ao Treinamento',
        total_rows: 53,
        valid_rows: 50,
        invalid_rows: 3,
        invalid_rows_preview: [
          { row: 7, name: 'Maria Oliveira', phone: '119999' },
          { row: 21, name: '', phone: '11988887777' },
          { row: 45, name: 'João Sem Telefone', phone: '' },
        ],
        missing_fields: [],
        estimated_cost: '7.50',
        cost_per_message: '0.15',
        current_balance: '18240.00',
        has_sufficient_balance: true,
        detected_columns: ['nome', 'telefone'],
        file_name: 'contatos.csv',
        can_proceed: true,
        validation_message: 'Arquivo válido com 50 contatos aptos para envio.',
      };
    }

    if (method === 'POST' && pathname === '/campaigns') {
      const now = new Date().toISOString();
      return {
        id: `camp-${Date.now()}`,
        name: 'Nova Campanha',
        status: 'SCHEDULED',
        template_id: 'tpl-onboarding',
        total_recipients: 50,
        estimated_cost: '7.50',
        created_at: now,
        message: 'Campanha criada com sucesso.',
        reference_id: '',
        reference_name: '',
      };
    }

    return undefined;
  }

  private buildFallbackResponse(method: string, pathname: string): unknown {
    if (method === 'GET' && pathname === '/enrollment') {
      return {
        count: 0,
        page: 1,
        per_page: 10,
        total_pages: 0,
        result: [],
      };
    }

    if (method === 'GET' && pathname === '/schedule/sent-messages-count') {
      return { messages_sent_count: 0 };
    }

    if (method === 'GET' && pathname === '/enrollment/messages-pending-count') {
      return { message_pending_count: 0 };
    }

    if (method === 'GET' && pathname === '/user/count') {
      return { users_count: 0 };
    }

    if (method === 'GET' && pathname === '/enrollment/status-count') {
      return { started_count: 0, waiting_count: 0 };
    }

    return undefined;
  }

  private guessContentType(body: Record<string, any> | FormData): string {
    const explicitType = body instanceof FormData ? String(body.get('type') || '') : String(body['type'] || '');
    const blog = body instanceof FormData ? String(body.get('blog') || '') : String(body['blog'] || '');
    const link = body instanceof FormData ? String(body.get('link') || '') : String(body['link'] || '');
    const file = body instanceof FormData ? body.get('file') : null;

    if (explicitType) {
      return explicitType;
    }
    if (blog) {
      return 'BLOG';
    }
    if (link.includes('soundcloud')) {
      return 'SOUNDCLOUD';
    }
    if (link.includes('youtube') || link.includes('youtu.be')) {
      return 'YOUTUBE';
    }
    if (file instanceof File) {
      if (file.type.startsWith('video/')) return 'YOUTUBE';
      if (file.type.startsWith('audio/')) return 'SOUNDCLOUD';
      if (file.type.startsWith('image/')) return 'IMAGE';
      if (file.type === 'application/pdf') return 'GOOGLE_DRIVE';
    }
    return 'FILE';
  }

  private getPathname(url: string): string {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }

  private getRelativePath(url: string, apiBaseUrl: string): string {
    const pathname = this.getPathname(url);
    const apiBasePath = this.getPathname(apiBaseUrl);

    if (pathname === apiBasePath) {
      return '/';
    }

    if (pathname.startsWith(`${apiBasePath}/`)) {
      return pathname.slice(apiBasePath.length);
    }

    return pathname;
  }

  private getParams(request: HttpRequest<unknown>): Record<string, string> {
    const params: Record<string, string> = {};
    request.params.keys().forEach((key) => {
      const value = request.params.getAll(key);
      params[key] = value?.length && value.length > 1 ? value.join(',') : request.params.get(key) || '';
    });
    return params;
  }

  private parseBody(body: unknown): Record<string, any> | FormData {
    if (!body) {
      return {};
    }
    if (body instanceof FormData) {
      return body;
    }
    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch {
        return {};
      }
    }
    return body as Record<string, any>;
  }

  private getId(pathname: string, prefix: string): string {
    return pathname.replace(prefix, '').split('/')[0];
  }

  private getNestedId(pathname: string, resource: string): string {
    const match = pathname.match(new RegExp(`/${resource}/([^/]+)`));
    return match?.[1] || '';
  }
}
