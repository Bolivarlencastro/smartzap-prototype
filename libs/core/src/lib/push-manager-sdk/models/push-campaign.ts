export interface PushCampaignParamsModel {
  page?: number;
  limit?: number;
  status?: PushCampaignStatus[];
  sortBy?: string[];
  sort_by?: string[];
  search?: string;
}

export interface PushCampaignModel {
  id: string;
  name: string;
  status: PushCampaignStatus;
  template_id: string;
  total_items: number;
  sent_count: number;
  failed_count: number;
  progress: number;
  estimated_cost: string;
  actual_cost: string;
  scheduled_at: string;
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  reference_id: string;
  reference_name: string;
}

export type PushCampaignStatus = 'SCHEDULED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
