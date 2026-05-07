import { Injectable } from '@angular/core';
import { RegulatoryComplianceClient } from './regulatory-compliance.client';
import { Observable } from 'rxjs';
import {
  ComplianceDto,
  ComplianceListDto,
  CompliancesFilterDto,
  CycleCreateDto,
  CycleDto,
  CycleListResponseDto,
  CyclesFilterDto,
  EnrollmentCycleListResponseDto,
  EnrollmentCycleRenewResult,
  EnrollmentsCyclesFilterDto,
  LearningObjectsFilterDto,
  LearningObjectsListDto,
} from '../models';

const ENROLLMENT_CYCLES_BASE_PATH = '/enrollment-cycles';
const CYCLES_BASE_PATH = '/cycles';
const COMPLIANCES_BASE_PATH = '/compliances';
const LEARNING_OBJECTS_BASE_PATH = '/learning-objects';

@Injectable({
  providedIn: 'root',
})
export class RegulatoryComplianceApi {
  constructor(private http: RegulatoryComplianceClient) {}

  getEnrollmentsCycles(filter: EnrollmentsCyclesFilterDto) {
    return this.http.get<EnrollmentCycleListResponseDto>(ENROLLMENT_CYCLES_BASE_PATH, filter, false, false, null, true);
  }

  renewEnrollmentCycle(cycleId: string, enrollmentId: string) {
    return this.http.post<EnrollmentCycleRenewResult>(ENROLLMENT_CYCLES_BASE_PATH, { enrollmentId, cycleId });
  }

  disableEnrollmentCycle(cycleId: string): Observable<unknown> {
    return this.http.post(`${ENROLLMENT_CYCLES_BASE_PATH}/${cycleId}/disable`, {});
  }

  getCycles(filter: CyclesFilterDto) {
    return this.http.get<CycleListResponseDto>(CYCLES_BASE_PATH, filter);
  }

  createCycle(cycle: CycleCreateDto) {
    return this.http.post<CycleDto>(CYCLES_BASE_PATH, cycle);
  }

  getCycleDetails(id: string) {
    return this.http.get<CycleDto>(`${CYCLES_BASE_PATH}/${id}`);
  }

  updateCycle(id: string, cycle: CycleCreateDto) {
    return this.http.patch<CycleDto>(`${CYCLES_BASE_PATH}/${id}`, cycle);
  }

  deleteCycle(id: string) {
    return this.http.delete<unknown>(`${CYCLES_BASE_PATH}/${id}`);
  }

  batchDeleteCycles(ids: string[]) {
    return this.http.post<unknown>(`${CYCLES_BASE_PATH}/batch-delete`, { ids });
  }

  createCompliance(name: string) {
    return this.http.post<ComplianceDto>(COMPLIANCES_BASE_PATH, { name });
  }

  getCompliances(filter: CompliancesFilterDto) {
    return this.http.get<ComplianceListDto>(COMPLIANCES_BASE_PATH, filter);
  }

  getLearningObjects(filter: LearningObjectsFilterDto) {
    return this.http.get<LearningObjectsListDto>(LEARNING_OBJECTS_BASE_PATH, filter);
  }

  getComplianceDetails(id: string) {
    return this.http.get<ComplianceDto>(`${COMPLIANCES_BASE_PATH}/${id}`);
  }

  updateCompliance(name: string, id: string) {
    return this.http.put(`${COMPLIANCES_BASE_PATH}/${id}`, { name });
  }

  deleteCompliance(id: string) {
    return this.http.delete<unknown>(`${COMPLIANCES_BASE_PATH}/${id}`);
  }

  batchDeleteCompliances(ids: string[]) {
    return this.http.post<unknown>(`${COMPLIANCES_BASE_PATH}/delete-batch`, { ids });
  }

  generateReport() {
    return this.http.downloadCSV('get', `${ENROLLMENT_CYCLES_BASE_PATH}/export/csv`);
  }
}
