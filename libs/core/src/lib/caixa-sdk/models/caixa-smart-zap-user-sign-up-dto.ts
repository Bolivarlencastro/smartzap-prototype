import { PartnerType } from './partner-type.enum';

export interface CaixaSmartZapUserSignUpDto {
  name: string;
  cpf: string;
  partner_type: PartnerType;
  phone: string;
  email: string;
  partner_convention_number: string;
  terms_accept: boolean;
  course_id?: string;
}
