import { Injectable } from '@angular/core';
import { SisyphusClient } from './sisyphus.client';
import { Observable } from 'rxjs';
import { ActionReportDTO, BatchActionAPIParams, BatchActionDTO } from '../models';
import { PageResponse } from '../../pagination';
import { HttpParams } from '@angular/common/http';

const BATCH_ACTIONS_PATH = '/batches';

@Injectable({
  providedIn: 'root',
})
export class BatchActionsApi {
  constructor(private http: SisyphusClient) {}

  getActions(params: HttpParams): Observable<PageResponse<BatchActionDTO>> {
    return this.http.get<PageResponse<BatchActionDTO>>(BATCH_ACTIONS_PATH, params, false, false, null, true);
  }

  exportLog(id: string): Observable<ActionReportDTO> {
    return this.http.get<ActionReportDTO>(`${BATCH_ACTIONS_PATH}/${id}/reports`);
  }

  dispatchAction(params: BatchActionAPIParams): Observable<BatchActionDTO> {
    return this.http.post<BatchActionDTO>(BATCH_ACTIONS_PATH, params);
  }
}
