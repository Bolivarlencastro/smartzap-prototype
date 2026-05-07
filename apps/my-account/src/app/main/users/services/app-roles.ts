type AppRole = { id: string; weight: number };

export const KONQUEST_ROLES: Record<string, AppRole> = {
  user: { id: 'a6d23aea-807e-4374-964e-c725b817742d', weight: 0 },
  curator: { id: '45f1fc7f-56f4-4208-a347-ee4d84a8f064', weight: 1 },
  content: { id: '97f4a026-f727-4e23-bdf9-971fec7ce20e', weight: 2 },
  instructor: { id: '5f19d9b6-dc84-4db3-9074-8f8dfbbe51c8', weight: 3 },
  admin: { id: '297a88de-c34b-4661-be8a-7090fa9a89e5', weight: 4 },
  super_admin: { id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6', weight: 5 },
};

export const ANALYTICS_ROLES: Record<string, AppRole> = {
  basic_analytics_user: { id: '4ddf7c3a-13ab-47a2-98fd-ab0b177ef823', weight: 0 },
  basic_analytics_leader: { id: '6a2b41b4-54c2-40d1-a587-cf25ab284aa0', weight: 1 },
  basic_analytics_admin: { id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954', weight: 2 },
};

export const MY_ACCOUNT_ROLES: Record<string, AppRole> = {
  account_admin: { id: '3b16b975-0297-4edf-950b-e3700b0d0d01', weight: 0 },
  company_admin: { id: '77e3a833-94b5-4c37-891d-988513eabb67', weight: 1 },
  keeps_admin: { id: 'e67234f4-957b-483d-badc-2fbcd6cd4173', weight: 2 },
};

export const SMARTZAP_ROLES: Record<string, AppRole> = {
  user: { id: '08404086-5e4e-48c6-91d7-dbeb360c7205', weight: 0 },
  admin: { id: '3d010792-7119-4e14-bea3-5258a31f1ddc', weight: 1 },
};
