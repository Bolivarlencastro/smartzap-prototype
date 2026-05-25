export interface CreateCampaignParamsModel {
  name: string;
  template_id: string;
  file: File;
  template_variables: string;
  scheduled_at: string;
  reference_id?: string;
  reference_name?: string;
}

export interface CreateCampaignResponseModel {
  id: string;
  name: string;
  status: string;
  template_id: string;
  total_recipients: number;
  estimated_cost: string;
  created_at: string;
  message: string;
  reference_id: string;
  reference_name: string;
}
