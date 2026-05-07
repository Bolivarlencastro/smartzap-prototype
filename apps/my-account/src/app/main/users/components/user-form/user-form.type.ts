import { FormControl, FormGroup } from '@angular/forms';
import { UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface EmployeeInfoFormType {
  area_of_activity: FormControl<string>;
  director: FormControl<string>;
  manager: FormControl<string>;
  job_position_id: FormControl<string>;
}

export interface UserFormType {
  email: FormControl<string>;
  name: FormControl<string>;
  nickname: FormControl<string>;
  birthday: FormControl<string>;
  cpf: FormControl<string>;
  ethnicity: FormControl<string>;
  gender: FormControl<string>;
  marital_status: FormControl<string>;
  language_id: FormControl<string>;
  secondary_email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
  country: FormControl<string>;
  admission_date: FormControl<string>;
  education: FormControl<string>;
  hierarchical_level: FormControl<string>;
  contract_type: FormControl<string>;
  employee_info: FormGroup<EmployeeInfoFormType>;
  ein: FormControl<string>;
  related_user_leader_id: FormControl<UserProfile>;
}
