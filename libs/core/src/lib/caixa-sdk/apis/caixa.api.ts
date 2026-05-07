import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  CaixaCourse,
  CaixaCourseCategory,
  CaixaPartner,
  CaixaSmartZapCourseEnrollmentDto,
  CaixaSmartZapUser,
  CaixaSmartZapUserSignUpDto,
  CaixaSmartZapUserUpdateDto,
  CourseListFilter,
  CreateCourseEnrollmentDto,
  PartnerType,
} from '../models';
import { CaixaClient } from './caixa.client';
import { PageDto } from '../../regulatory-compliance-sdk';

@Injectable({
  providedIn: 'root',
})
export class CaixaApi {
  constructor(private http: CaixaClient) {}

  getCourses(filter: CourseListFilter): Observable<CaixaCourse[]> {
    return this.http.get<PageDto<CaixaCourse>>('/courses', filter).pipe(map((response) => response.items));
  }

  getCategories(): Observable<CaixaCourseCategory[]> {
    return this.http.get<CaixaCourseCategory[]>('/categories');
  }

  searchUser(cpf: string): Observable<CaixaSmartZapUser> {
    return this.http.get<CaixaSmartZapUser>('/users/find', { search: cpf });
  }

  signUpUser(userSignUpDto: CaixaSmartZapUserSignUpDto) {
    return this.http.post<CaixaSmartZapUser>('/users', userSignUpDto);
  }

  updateUser(userUpdateDto: CaixaSmartZapUserUpdateDto, userId: string) {
    return this.http.patch<unknown>(`/users/${userId}`, userUpdateDto);
  }

  searchPartner(search: string, partnerType: PartnerType): Observable<PageDto<CaixaPartner>> {
    return this.http.get<PageDto<CaixaPartner>>('/partners', { search, partnerType });
  }

  enroll(enrollmentDto: CreateCourseEnrollmentDto, courseId: string) {
    return this.http.post<unknown>(`/courses/${courseId}/enroll`, enrollmentDto);
  }

  cancelUserEnrollment(userId: string) {
    return this.http.post<unknown>(`/users/${userId}/give-up`, {});
  }

  getUserEnrollments(userId: string) {
    return this.http.get<CaixaSmartZapCourseEnrollmentDto[]>(`/enrollments/${userId}`);
  }
}
