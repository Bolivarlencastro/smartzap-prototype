export interface TemplatesResponseModel {
  itens: PushTemplate[];
  total: number;
}

export interface PushTemplate {
  id: string;
  content_sid: string;
  name: string;
  title: string;
  body_preview: string;
  variables: PushTemplateVariables[];
  category: string;
  language: string;
  is_active: boolean;
  cost_per_message: string;
}

export interface PushTemplateVariables {
  position: number;
  name: string;
  required: boolean;
}
