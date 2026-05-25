import { FormControl, FormGroup } from '@angular/forms';
import {
  PushTemplate,
  SmartzapCourse,
  ValidateCampaignResponseModel,
} from '@keeps-platform-frontend-workspace/kp-keeps';

export interface ValidatedWith {
  templateId: string;
  templateVariables: string;
  fileName: string;
}

export interface CreationViewModel {
  templates: PushTemplate[];
  loading: boolean;
  courses: SmartzapCourse[];
  validationResult: ValidateCampaignResponseModel | null;
  validatedWith: ValidatedWith | null;
  validating: boolean;
  submitting: boolean;
}

interface TemplateModel<T, V> {
  templateId: T;
  variables: V;
}
export type Template = TemplateModel<string, Record<string, string>>;
export type TemplateForm = TemplateModel<FormControl<string>, FormGroup<Record<string, FormControl<string>>>>;

interface ContactsModel<T> {
  contacts: T;
}
export type Contacts = ContactsModel<File>;
export type ContactsForm = ContactsModel<FormControl<File>>;

interface ScheduleModel<S, D> {
  courseId?: S;
  courseName?: S;
  campaign?: S;
  date: D;
  hour: S;
}
export type Schedule = ScheduleModel<string, Date>;
export type ScheduleForm = ScheduleModel<FormControl<string>, FormControl<Date>>;
