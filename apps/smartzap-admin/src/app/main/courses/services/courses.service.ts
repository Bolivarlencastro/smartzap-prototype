import { Injectable } from '@angular/core';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SmartzapAPI } from '@core/api/smartzap.api';
import { Enrollment, EnrollmentApiResponse } from 'app/main/courses/model';
import { CollectionApiResponse, CollectionResponse, Page } from 'app/shared/model';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Course, ImageUploadApiResponse, Lesson } from '../model';

@Injectable()
export class CoursesService {
  constructor(
    private _http: SmartzapAPI,
    private _authService: AuthService,
  ) {}

  fetchCourses(coursePage: Page, filters?: any, term?: string, sort?: string): Observable<CollectionResponse<Course>> {
    const params: Record<string, string | number> = {
      page: coursePage.page,
      per_page: coursePage.per_page,
      ...(sort && { sort }),
    };

    if (term) params['name__ilike'] = term;
    if (filters?.categories.length) params['category_id__eq'] = filters.categories;
    if (filters?.languages.length) params['lang__in'] = filters.languages.map((lang) => lang.toLocaleLowerCase());
    if (filters?.statuses.length) params['status__in'] = filters.statuses.join(',');
    if (filters?.createdByMe && this._authService.userId) params['user_creator_id'] = this._authService.userId;

    return this._http.get<CollectionApiResponse<Course>>('/course', params).pipe(
      map((response) => this.applyCourseFilters(response, filters)),
      switchMap((response) => forkJoin([buildPage(response), buildResult(response)])),
      map(([page, collection]) => ({ page, collection })),
    );
  }

  fetchCourse(id: string): Observable<Course> {
    return this._http.get<Course>(`/course/${id}`);
  }

  fetchLessons(id: string): Observable<Lesson[]> {
    return this._http
      .get<any>(`/course/${id}/lesson`, { page: 1, per_page: 999 })
      .pipe(map((response) => response.result));
  }

  // Create
  saveCourse(course: Course): Observable<Course> {
    const { id } = course;

    if (!id) {
      return this.createCourse(course);
    }

    return this.updateCourse(id, course);
  }

  createCourse(course: Course): Observable<Course> {
    const {
      name,
      description,
      category_id,
      lang,
      thumb_image,
      holder_image,
      is_active,
      quiz_performance_weight,
      content_performance_weight,
      disable_send_certificate,
      message_description,
      enable_native_nps,
    } = course;
    return this._http.post<Course>('/course', {
      name,
      description,
      category_id,
      lang,
      thumb_image,
      holder_image,
      is_active,
      status: 'CREATING',
      quiz_performance_weight,
      content_performance_weight,
      disable_send_certificate,
      message_description,
      enable_native_nps,
    });
  }

  updateCourse(id: string, course: Course): Observable<Course> {
    const {
      name,
      description,
      category_id,
      lang,
      thumb_image,
      holder_image,
      is_active,
      quiz_performance_weight,
      content_performance_weight,
      disable_send_certificate,
      message_description,
      enable_native_nps,
    } = course;
    return this._http.patch<Course>(`/course/${id}`, {
      name,
      description,
      category_id,
      lang,
      thumb_image,
      holder_image,
      is_active,
      quiz_performance_weight,
      content_performance_weight,
      disable_send_certificate,
      message_description,
      enable_native_nps,
    });
  }

  updateSummary(id: string, summary: string): Observable<void> {
    return this._http.patch<void>(`/course/${id}`, { description: summary });
  }

  deleteCourse(id: string): Observable<void> {
    return this._http.delete<void>(`/course/${id}`);
  }

  duplicateCourse(id: string): Observable<Course> {
    return this._http.post<Course>(`/course/${id}/duplicate`, {});
  }

  // Upload
  uploadImage(file: File, imageType: 'holder_image' | 'thumb_image'): Observable<string> {
    const image_type = imageType === 'thumb_image' ? 'thumb' : 'holder';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('image_type', image_type);
    return this._http.postFormData<ImageUploadApiResponse>('/upload/image', formData).pipe(map(({ url }) => url));
  }

  // Enrollments

  fetchCompletedEnrollments(
    course_id: string,
    pageData: Page,
    term: string,
    sort: string,
    filter?: any,
  ): Observable<CollectionResponse<Enrollment>> {
    return this.fetchEnrollments(course_id, pageData, term, sort, {
      ...(filter || {}),
      status: 'COMPLETED',
    });
  }

  fetchEnrollments(
    course_id: string,
    pageData: Page,
    term: string,
    sort: string,
    filter?: any,
  ): Observable<CollectionResponse<Enrollment>> {
    let params: Record<string, number | string> = { page: pageData.page, per_page: pageData.per_page };

    if (term) {
      params['user__name__ilike'] = term;
    }

    if (sort) {
      params['sort'] = sort;
    }

    if (filter) {
      params = { ...params, ...filter };
    }

    return this._http.get<CollectionApiResponse<Enrollment>>(`/course/${course_id}/enrollment`, params).pipe(
      switchMap((response) => forkJoin([buildPage(response), buildResult(response)])),
      map(([page, collection]) => ({ page, collection })),
    );
  }

  createUserEnrollment(course_id: string, data: any): Observable<any> {
    const { name, phone, email, tags, timezone } = data;
    return this._http.post('/enrollment/user', {
      name,
      phone,
      email,
      tags,
      timezone,
      course_id,
    });
  }

  importEnrollments(course_id: string, data: any): Observable<EnrollmentApiResponse> {
    const { timezone, formData } = data;
    const { file } = formData;

    const form = new FormData();
    form.append('file', file, file.name);
    form.append('timezone', timezone);
    form.append('course_id', course_id);

    return this._http.postFormData('/enrollment/file', form);
  }

  removeEnrollment(id: string): Observable<any> {
    return this._http.delete(`/enrollment/${id}`);
  }

  removeSelectedEnrollments(ids: string[]): Observable<any> {
    return this._http.delete(`/enrollment/batch`, null, { ids });
  }

  startPublishProcess(course_id: string): Observable<string> {
    return this._http.post<any>(`/course/${course_id}/publish`, {}).pipe(map(() => 'PROCESSING'));
  }

  publish(course_id: string): Observable<string> {
    return this._http.patch<void>(`/course/${course_id}`, { status: 'FINISHED' }).pipe(map(() => 'FINISHED'));
  }

  transferOwnership(course_id: string, user_id: string): Observable<any> {
    return this._http.post<any>(`/course/${course_id}/transfer-ownership/${user_id}`, {});
  }

  private applyCourseFilters(
    response: CollectionApiResponse<Course>,
    filters?: { categories?: string[]; languages?: string[]; statuses?: string[] },
  ): CollectionApiResponse<Course> {
    if (!filters?.categories?.length && !filters?.languages?.length && !filters?.statuses?.length) {
      return response;
    }

    const filteredResult = response.result.filter((course) => {
      const matchesCategory =
        !filters?.categories?.length || filters.categories.includes(course.category_id || course.category?.id);
      const matchesLanguage =
        !filters?.languages?.length ||
        filters.languages.map((lang) => lang.toLocaleLowerCase()).includes(course.lang?.toLocaleLowerCase());
      const matchesStatus = !filters?.statuses?.length || filters.statuses.includes(course.status);

      return matchesCategory && matchesLanguage && matchesStatus;
    });

    return {
      ...response,
      count: filteredResult.length,
      total_pages: Math.ceil(filteredResult.length / response.per_page),
      result: filteredResult,
    };
  }
}

const buildPage = ({ count, per_page, page, total_pages }: Page) => of({ count, per_page, page, total_pages });
const buildResult = <T>({ result }: CollectionApiResponse<T>) => of(result);
