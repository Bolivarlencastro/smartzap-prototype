import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PrototypeAdminStateService } from './prototype-admin-state.service';

@Injectable()
export class PrototypeAdminMockInterceptor implements HttpInterceptor {
  constructor(private readonly state: PrototypeAdminStateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const mockedResponse = this.safeHandleRequest(request);
    if (!mockedResponse) {
      return next.handle(request);
    }

    return of(new HttpResponse({ status: 200, body: mockedResponse })).pipe(delay(80));
  }

  private safeHandleRequest(request: HttpRequest<unknown>): unknown {
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

    return undefined;
  }

  private handleSmartzapRequest(
    method: string,
    pathname: string,
    params: Record<string, string>,
    body: Record<string, any>,
  ) {
    if (method === 'GET' && pathname === '/course') {
      return this.state.listCourses(params);
    }

    if (method === 'POST' && pathname === '/course') {
      return this.state.saveCourse(body);
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
      return this.state.updateCourse(this.getId(pathname, '/course/'), body);
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
      return this.state.createLesson(String(body['course_id'] || ''), {
        name: String(body['name'] || 'Nova licao'),
        order: Number(body['order'] || 1),
      });
    }

    if (method === 'PATCH' && pathname.startsWith('/lesson/')) {
      this.state.updateLesson(this.getId(pathname, '/lesson/'), body);
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
      return this.state.createLessonContent(String(body['lesson_id'] || ''), {
        name: String(body['name'] || 'Novo conteudo'),
        description: String(body['description'] || ''),
        order: Number(body['order'] || 1),
        dispatch_in: Number(body['dispatch_in'] || 1),
        dispatch_period: String(body['dispatch_period'] || 'MORNING'),
        learn_content: String(body['learn_content'] || ''),
        type_id: String(body['type_id'] || ''),
      });
    }

    if (method === 'PATCH' && pathname.startsWith('/content/')) {
      this.state.updateContent(this.getId(pathname, '/content/'), body);
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
      return this.state.uploadImage();
    }

    if (method === 'GET' && pathname === '/user') {
      return this.state.listUsers(params);
    }

    if (method === 'PATCH' && pathname.startsWith('/user/')) {
      return this.state.updateUser(this.getId(pathname, '/user/'), body);
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
        user_id: String(body['user_id'] || ''),
        course_id: String(body['course_id'] || ''),
      });
    }

    if (method === 'POST' && pathname === '/enrollment/user') {
      return this.state.createEnrollmentUser({
        name: String(body['name'] || ''),
        phone: String(body['phone'] || ''),
        email: String(body['email'] || ''),
        tags: String(body['tags'] || ''),
        course_id: String(body['course_id'] || ''),
      });
    }

    if (method === 'POST' && pathname === '/enrollment/file') {
      return { success: true, imported: 3 };
    }

    if (method === 'PATCH' && pathname.startsWith('/enrollment/')) {
      return this.state.updateEnrollment(this.getId(pathname, '/enrollment/'), body);
    }

    if (method === 'DELETE' && pathname === '/enrollment/batch') {
      this.state.deleteBatchEnrollments((body['ids'] || []) as string[]);
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
    body: Record<string, any>,
    params: Record<string, string>,
  ) {
    if (method === 'POST' && pathname === '/learn-content') {
      return this.state.createLearnContent({
        name: String(body['name'] || 'Novo learn content'),
        description: String(body['description'] || ''),
        type: this.guessContentType(body),
        link: String(body['link'] || ''),
        blog: String(body['blog'] || ''),
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

  private guessContentType(body: Record<string, any>): string {
    if (body['blog']) {
      return 'BLOG';
    }
    if (String(body['link'] || '').includes('soundcloud')) {
      return 'SOUNDCLOUD';
    }
    if (String(body['link'] || '').includes('youtube') || String(body['link'] || '').includes('youtu.be')) {
      return 'YOUTUBE';
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

  private parseBody(body: unknown): Record<string, any> {
    if (!body) {
      return {};
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
