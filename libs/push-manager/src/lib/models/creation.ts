import { FormControl, FormGroup } from '@angular/forms';
import { PushTemplate, SmartzapCourse } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CreationViewModel {
  templates: PushTemplate[];
  loading: boolean;
  courses: SmartzapCourse[];
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
  campaign?: S;
  date: D;
  hour: S;
}
export type Schedule = ScheduleModel<string, Date>;
export type ScheduleForm = ScheduleModel<FormControl<string>, FormControl<Date>>;
