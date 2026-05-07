interface BaseEntity {
  id: string;
  created_date: Date;
  updated_date: Date;
}

export type LanguageTypes = 'en' | 'es' | 'pt-BR' | 'pt-PT';

export interface Language extends BaseEntity {
  name: LanguageTypes;
  status: boolean;
}
