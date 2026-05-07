export type UserApplicationRoles = {
  application: {
    name: string;
    id: string;
  };
  roles: string[];
};

export type SetUserApplicationRolesDto = {
  applicationId: string;
  roles: string[];
};
