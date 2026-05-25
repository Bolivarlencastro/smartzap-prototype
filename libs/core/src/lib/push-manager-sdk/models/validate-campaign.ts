export interface ValidateCampaignParamsModel {
  template_id: string;
  file: File;
  template_variables?: string;
}

export interface ValidateCampaignResponseModel {
  template_id: string;
  template_name: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  invalid_rows_preview: InvalidRowModel[];
  missing_fields: string[];
  estimated_cost: string;
  cost_per_message: string;
  current_balance: string;
  has_sufficient_balance: boolean;
  detected_columns: string[];
  file_name: string;
  can_proceed: boolean;
  validation_message: string;
}

export interface InvalidRowModel {
  row: number;
  name: string;
  phone: string;
}
