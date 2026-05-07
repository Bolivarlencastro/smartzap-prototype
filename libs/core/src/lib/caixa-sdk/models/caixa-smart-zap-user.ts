import { CaixaPartner } from './caixa-partner';

export type CaixaSmartZapUser = {
  id: string;
  name: string;
  cpf: string;
  related_partner: CaixaPartner;
};
