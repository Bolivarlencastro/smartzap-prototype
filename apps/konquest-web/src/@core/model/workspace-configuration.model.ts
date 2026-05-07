export interface RawModuleService {
  id: string;
  service: {
    id: string;
    name: string;
  };
  status?: boolean;
}

export interface ModuleService {
  label?: string;
  field?: string;
  status?: boolean;
  tooltip?: string;
}
