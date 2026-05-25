import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginated } from '../../public-api';
import { CreateCampaignParamsModel, CreateCampaignResponseModel } from '../models/create-campaign';
import { PushCampaignModel, PushCampaignParamsModel } from '../models/push-campaign';
import { BalanceModel, StatsModel } from '../models/stats';
import { TemplatesResponseModel } from '../models/template';
import { ValidateCampaignParamsModel, ValidateCampaignResponseModel } from '../models/validate-campaign';
import { PushManagerClient } from './push-manager.client';

@Injectable({
  providedIn: 'root',
})
export class PushManagerApi {
  constructor(private readonly http: PushManagerClient) {}

  fetchTemplates() {
    return this.http.get<TemplatesResponseModel>('/templates');
  }

  fetchBalance() {
    return this.http.get<BalanceModel>('/wallet/balance');
  }

  fetchGeneralStats() {
    return this.http.get<StatsModel>('/wallet/general-stats');
  }

  fetchCampaigns(params: PushCampaignParamsModel) {
    return this.http.get<Paginated<PushCampaignModel>>('/campaigns', params);
  }

  cancelCampaign(id: string): Observable<void> {
    return this.http.post(`/campaigns/${id}/cancel`, {});
  }

  addCredits(amount: number, note?: string): Observable<void> {
    return this.http.post('/wallet/credits', { amount, note });
  }

  validateCampaign(params: ValidateCampaignParamsModel) {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('template_id', params.template_id);
    if (params.template_variables) {
      formData.append('template_variables', params.template_variables);
    }
    return this.http.postFormData<ValidateCampaignResponseModel>('/campaigns/validate', formData);
  }

  createCampaign(params: CreateCampaignParamsModel) {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('name', params.name);
    formData.append('template_id', params.template_id);
    formData.append('scheduled_at', params.scheduled_at);
    formData.append('template_variables', params.template_variables);
    if (params.reference_id) {
      formData.append('reference_id', params.reference_id);
    }
    if (params.reference_name) {
      formData.append('reference_name', params.reference_name);
    }
    return this.http.postFormData<CreateCampaignResponseModel>('/campaigns', formData);
  }
}
