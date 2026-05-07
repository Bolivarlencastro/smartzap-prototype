import { RoleWorkspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Application } from './application.model';

export interface Role {
  id: string;
  application: string | Application;
  name: string;
  key: string;
}

export interface RoleUser {
  id: string;
  workspace: RoleWorkspace;
  role: Role;
  self_sign_up: boolean;
}
