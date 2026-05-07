export interface ScormDialogUploadForm {
  name: string;
  file: any;
}

export interface ScormLearnContent {
  id: string;
  name: string;
  description: string;
  url: string;
  created_date: string;
  updated_date: string;
  analyzed: string;
  category: string;
  content_type: string;
  order: number;
}

export interface ScormSteps {
  contents: ScormLearnContent[];
  step_title: string;
  step_order: number;
}

export interface ScormContent {
  course_title: string;
  steps: ScormSteps[];
}
