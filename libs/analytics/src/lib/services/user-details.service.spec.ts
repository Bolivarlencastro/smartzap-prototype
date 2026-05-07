import { AnalyticsApiFilter, LearnAnalyticsApi, UserDataResponse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoService } from '@jsverse/transloco';
import { of, throwError } from 'rxjs';
import { UserDetailsService } from './user-details.service';

describe('UserDetailsService', () => {
  let service: UserDetailsService;
  let learnAnalyticsApi: jest.Mocked<LearnAnalyticsApi>;
  let translocoService: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    learnAnalyticsApi = {
      fetchUserData: jest.fn(() => of({} as UserDataResponse)),
    } as unknown as jest.Mocked<LearnAnalyticsApi>;

    translocoService = {
      translate: jest.fn().mockImplementation((key) => key),
    } as unknown as jest.Mocked<TranslocoService>;

    service = new UserDetailsService(translocoService, learnAnalyticsApi);
  });

  it('should handle successful fetch', () => {
    learnAnalyticsApi.fetchUserData.mockReturnValue(of(mockResponse));
    const spy = jest.spyOn(service['_userResponse'], 'next');

    service.fetchUserData('userId', {} as AnalyticsApiFilter);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ isLoading: true }));
    expect(spy).toHaveBeenCalledWith({ response: mockResponse, isLoading: false });
  });

  it('should handle 404 error', () => {
    const errorResponse = { status: 404 };
    learnAnalyticsApi.fetchUserData.mockReturnValue(throwError(() => errorResponse));

    const spy = jest.spyOn(service['_userResponse'], 'next');

    service.fetchUserData('userId', {} as AnalyticsApiFilter);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ isLoading: true }));
    expect(spy).toHaveBeenCalledWith({
      response: {},
      isLoading: false,
      error: 'USERS.DETAILS.ERROR.NOT_FOUND',
    });
  });

  it('should handle unknown error', () => {
    const errorResponse = { status: 500 };
    learnAnalyticsApi.fetchUserData.mockReturnValue(throwError(() => errorResponse));

    const spy = jest.spyOn(service['_userResponse'], 'next');

    service.fetchUserData('userId', {} as AnalyticsApiFilter);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ isLoading: true }));
    expect(spy).toHaveBeenCalledWith({
      response: {},
      isLoading: false,
      error: 'USERS.DETAILS.ERROR.UNKNOWN',
    });
  });
});

const mockResponse: any = {
  data: [
    {
      _id: 'bbf47825-8dfb-49bc-8ad8-f8adc775f95f',
      _index: 'kafka-analytics-users-stage',
      _score: 0,
      _source: {
        address: 'Florianópolis',
        avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/f9406145-5b5b-4049-b49b-5881f8fb1cec.jpg',
        birthday: '2024-02-13',
        created_date: null,
        email: 'admin@keeps.com.br',
        gender: 'MALE',
        id: 'bbf47825-8dfb-49bc-8ad8-f8adc775f95f',
        language_id: 'ea636f50-fdc4-49b0-b2de-9e5905de456b',
        leader_id: 'f4f96f8d-708e-403b-ba5a-b45d110a7f6b',
        leader_name: 'Elcimar',
        name: 'Super Admin',
        nickname: 'Testando',
        origin: 'myaccount',
        phone: '351919908797',
        secondary_email: 'teste@teste.com.br',
        status: true,
        updated_date: '2024-08-08T17:15:00.847796+00:00',
        user_profile_workspace: [
          {
            area_of_activity: 'automatizar',
            director: 'Diretoria 1',
            id: '8dd3f195-fc7c-46d7-acbb-8daf4cfb82b6',
            job_function_id: null,
            job_function_name: null,
            job_id: '9754ce63-9557-4f14-99ee-5b9ad84beed4',
            job_name: 'DEV',
            manager: 'Subdiretoria 1',
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            area_of_activity: 'Tecnologia',
            director: 'Director',
            id: '9ca85958-67bc-4b23-95ee-6d05821c83fb',
            job_function_id: null,
            job_function_name: null,
            job_id: 'bfa68fa4-dfd3-4d80-a59b-18991fda8b05',
            job_name: 'DESENVOLVEDOR',
            manager: 'Manager',
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
          {
            area_of_activity: null,
            director: null,
            id: '7f593d70-9d45-44d7-8b7c-e4f61c349b55',
            job_function_id: null,
            job_function_name: null,
            job_id: '8518786a-b561-4552-a982-8996c844b596',
            job_name: 'TESTER',
            manager: null,
            workspace_id: '825202dd-22fa-4b70-8ba9-193dec87a0b7',
          },
          {
            area_of_activity: null,
            director: null,
            id: '8e3eef00-3e56-462e-9bc3-4ea4772ad65a',
            job_function_id: null,
            job_function_name: null,
            job_id: '8518786a-b561-4552-a982-8996c844b596',
            job_name: 'TESTER',
            manager: null,
            workspace_id: '83ea42be-51f3-4c3d-b3ce-0bbb0caa8e5d',
          },
        ],
        user_progress_workspace: [
          {
            enrollments_completed: 1,
            enrollments_completed_ratio: 0.08333333333333333,
            enrollments_total: 12,
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            enrollments_completed: 1,
            enrollments_completed_ratio: 0.5,
            enrollments_total: 2,
            workspace_id: '825202dd-22fa-4b70-8ba9-193dec87a0b7',
          },
          {
            enrollments_completed: 3,
            enrollments_completed_ratio: 0.16666666666666666,
            enrollments_total: 18,
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
        ],
        user_role_workspace: [
          {
            id: 'aac4a5dc-4ecd-4eb0-a3f6-2ebd39ae3cb6',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            id: '5ec75491-13fc-42d9-b3c9-ab8ae07c45ea',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954',
              key: 'basic_analytics_admin',
              name: 'Analytics Admin',
            },
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
          {
            id: 'cfb4da56-cbaf-47b0-8bd1-94cbaded8c6b',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: '83ea42be-51f3-4c3d-b3ce-0bbb0caa8e5d',
          },
          {
            id: '4b0002f1-440a-4c62-a969-69a43abf7eae',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
          {
            id: '34c637a0-a702-43e5-85e3-0554c2200858',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            id: '32b1666d-f6ad-4927-a726-b96518ff9495',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: 'b8c7b36b-3811-4a18-a8f1-6544a4128578',
          },
          {
            id: 'c6bf796f-d3b8-4bac-9d97-5c39fda1b98b',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: 'b8c7b36b-3811-4a18-a8f1-6544a4128578',
          },
          {
            id: '324cd61c-a9c7-498f-9b98-4edf05d934b0',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: '297a88de-c34b-4661-be8a-7090fa9a89e5',
              key: 'admin',
              name: 'Konquest Admin ',
            },
            workspace_id: '83ea42be-51f3-4c3d-b3ce-0bbb0caa8e5d',
          },
          {
            id: '2ec8a542-a64f-4f6a-9ccf-011f33f716da',
            role: {
              application_id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
              id: '3d010792-7119-4e14-bea3-5258a31f1ddc',
              key: 'admin',
              name: 'Smartzap Admin',
            },
            workspace_id: '825202dd-22fa-4b70-8ba9-193dec87a0b7',
          },
          {
            id: '29592ae0-d23f-4087-9977-e3060c1c1587',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954',
              key: 'basic_analytics_admin',
              name: 'Analytics Admin',
            },
            workspace_id: '825202dd-22fa-4b70-8ba9-193dec87a0b7',
          },
          {
            id: '0db257e8-42b4-4e91-a487-53202127dfc5',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '83ea42be-51f3-4c3d-b3ce-0bbb0caa8e5d',
          },
          {
            id: '8bdcd9ac-0765-409c-8d3c-e07fe96b0498',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: '83ea42be-51f3-4c3d-b3ce-0bbb0caa8e5d',
          },
          {
            id: '86dee04b-79ad-4313-81b6-373ca1982ebd',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: 'f44524a3-b28a-4bed-a19e-13b1fb296ef7',
          },
          {
            id: '1c590e77-f9cb-42fc-8ce6-fdd79721307c',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: 'f44524a3-b28a-4bed-a19e-13b1fb296ef7',
          },
          {
            id: 'e2a533b0-4c62-42f9-ae9d-a8ece5869a15',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '79dd0625-307a-4b66-b995-69df1e193b1e',
          },
          {
            id: 'b5914f63-3bc4-4c02-9e7d-e423ebb71f1c',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: '79dd0625-307a-4b66-b995-69df1e193b1e',
          },
          {
            id: '4b73083a-a6d8-4795-a593-c83337f4bd7d',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: 'e67234f4-957b-483d-badc-2fbcd6cd4173',
              key: 'keeps_admin',
              name: 'FULL ADMIN',
            },
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
          {
            id: '4e1b1d35-d086-40a1-8b3c-0b42630905df',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'a6d23aea-807e-4374-964e-c725b817742d',
              key: 'user',
              name: 'Konquest User',
            },
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            id: 'b22c49c5-7527-4c4b-9d08-bbf0456433e0',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: '4ddf7c3a-13ab-47a2-98fd-ab0b177ef823',
              key: 'basic_analytics_user',
              name: 'User Analytics',
            },
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            id: '6c8e8f88-fb27-4aa2-af93-c7e222acfb72',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: 'fa33a6d0-4b8b-46ae-b1f0-77199c396008',
          },
          {
            id: 'ccba9d4a-c2d1-43e6-a153-bb1917b90936',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: 'fa33a6d0-4b8b-46ae-b1f0-77199c396008',
          },
          {
            id: '0b089bdd-9d23-4fc7-9ae2-cf52726a741c',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: 'f04185d0-5225-4978-9c58-b6bc3e53eee1',
          },
          {
            id: '67b7786d-c0fc-422e-b084-355b2d117f87',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: 'f04185d0-5225-4978-9c58-b6bc3e53eee1',
          },
          {
            id: 'a58f2ecd-ebd7-4d99-b2df-a15d268a2f4b',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: '297a88de-c34b-4661-be8a-7090fa9a89e5',
              key: 'admin',
              name: 'Konquest Admin ',
            },
            workspace_id: '79dd0625-307a-4b66-b995-69df1e193b1e',
          },
          {
            id: 'dd150c56-0687-48c2-bb51-13c056040d14',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '549c6516-8729-4b93-9a03-8d1317656a31',
          },
          {
            id: 'd1aa7b52-55d8-42f6-9cb3-7404c43f0f52',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: '549c6516-8729-4b93-9a03-8d1317656a31',
          },
          {
            id: 'fc5c4830-c359-4c8b-b61a-4fad440d3605',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: 'fa33a6d0-4b8b-46ae-b1f0-77199c396008',
          },
          {
            id: 'f36ea401-c1d9-49d0-b8a9-830d6180f8d8',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: 'f04185d0-5225-4978-9c58-b6bc3e53eee1',
          },
          {
            id: '73b9c960-7ac4-455d-b06e-240ad34b775e',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '4fb29056-5de2-44d1-804f-70706f9dfcad',
          },
          {
            id: 'b6662630-7fd3-44a7-bdad-50feecf3eddf',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954',
              key: 'basic_analytics_admin',
              name: 'Analytics Admin',
            },
            workspace_id: 'f04185d0-5225-4978-9c58-b6bc3e53eee1',
          },
          {
            id: 'b20f8f35-a707-4c84-9614-e3567a574b9f',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954',
              key: 'basic_analytics_admin',
              name: 'Analytics Admin',
            },
            workspace_id: '4fb29056-5de2-44d1-804f-70706f9dfcad',
          },
          {
            id: 'fd5e158d-3083-43c0-ab1f-369b2785b0c5',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: '4fb29056-5de2-44d1-804f-70706f9dfcad',
          },
          {
            id: 'c38ed393-4587-44af-8d1b-68b7cf6ec255',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            id: 'b8c9cefb-be2a-484e-ad65-59fc5719af91',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '92bc96f6-d526-4a3b-8751-dbbe5f3c8d2a',
          },
          {
            id: '51483602-74b3-4da3-ad2a-fb1e13f03080',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: '92bc96f6-d526-4a3b-8751-dbbe5f3c8d2a',
          },
          {
            id: '9b248f92-5529-47dc-bafb-1fc9190d9c32',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '7e7c98f4-0f37-447e-bad8-47c6fe4f3b69',
          },
          {
            id: 'bd7505ad-c571-4fb4-821d-9c6298def3f3',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: '7e7c98f4-0f37-447e-bad8-47c6fe4f3b69',
          },
          {
            id: 'cfb80e9c-ed79-447b-8b0a-c9fe50dccdfe',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: '92bc96f6-d526-4a3b-8751-dbbe5f3c8d2a',
          },
          {
            id: '69f3a5ac-54bf-4df5-b55f-9f209620be0d',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954',
              key: 'basic_analytics_admin',
              name: 'Analytics Admin',
            },
            workspace_id: '92bc96f6-d526-4a3b-8751-dbbe5f3c8d2a',
          },
          {
            id: '2782942e-25c9-43ea-be31-50bc06da6ead',
            role: {
              application_id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
              id: '3d010792-7119-4e14-bea3-5258a31f1ddc',
              key: 'admin',
              name: 'Smartzap Admin',
            },
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
          {
            id: '5867d22c-3345-4f98-96d7-ccdd037a195c',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '4f0a9578-6db4-4adb-b498-7dc6e521f10c',
          },
          {
            id: '66138635-4694-4571-9b1c-0cb9b1a2e997',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
              key: 'account_admin',
              name: 'My Account Admin',
            },
            workspace_id: '4f0a9578-6db4-4adb-b498-7dc6e521f10c',
          },
          {
            id: '30de17b9-d55e-465a-9214-713abdf10da1',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954',
              key: 'basic_analytics_admin',
              name: 'Analytics Admin',
            },
            workspace_id: '4f0a9578-6db4-4adb-b498-7dc6e521f10c',
          },
          {
            id: '3a476fb0-ff61-4738-bad8-4a555887be30',
            role: {
              application_id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
              id: '3d010792-7119-4e14-bea3-5258a31f1ddc',
              key: 'admin',
              name: 'Smartzap Admin',
            },
            workspace_id: '4f0a9578-6db4-4adb-b498-7dc6e521f10c',
          },
          {
            id: '603f1102-5f1a-4d3a-bfb8-a3d54f6fc27f',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: '4f0a9578-6db4-4adb-b498-7dc6e521f10c',
          },
          {
            id: 'f42afda7-e7aa-40b5-a7f0-5462ea779996',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
          {
            id: 'c091220e-ee5f-45ea-980f-ddc4332f2ade',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
              key: 'super_admin',
              name: 'Konquest Super Admin',
            },
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
          {
            id: '85e82b45-d6e3-4370-8c45-74f2282c7d8f',
            role: {
              application_id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
              id: 'b995b041-4c9c-47a3-aa1f-d7b1394d0954',
              key: 'basic_analytics_admin',
              name: 'Analytics Admin',
            },
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            id: 'a7977d57-8515-4e87-8d37-4c8ec2ac8f69',
            role: {
              application_id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
              id: '3d010792-7119-4e14-bea3-5258a31f1ddc',
              key: 'admin',
              name: 'Smartzap Admin',
            },
            workspace_id: '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf',
          },
          {
            id: 'f6ec7953-d794-43ae-983d-8a2084f31e6b',
            role: {
              application_id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
              id: '297a88de-c34b-4661-be8a-7090fa9a89e5',
              key: 'admin',
              name: 'Konquest Admin ',
            },
            workspace_id: '825202dd-22fa-4b70-8ba9-193dec87a0b7',
          },
          {
            id: '21bcf8d0-f334-4ead-8a44-2b0725cc1a3e',
            role: {
              application_id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
              id: '77e3a833-94b5-4c37-891d-988513eabb67',
              key: 'company_admin',
              name: 'My Account Company Administrator',
            },
            workspace_id: '825202dd-22fa-4b70-8ba9-193dec87a0b7',
          },
        ],
      },
    },
  ],
  stats: {
    activities: {
      completed_enrollments_total_activities: 0,
      completed_enrollments_total_seconds: 0,
      content_types: [
        {
          doc_count: 77,
          key: '2284bfce-fdfc-4477-9143-39c380cc653c',
          name: {
            buckets: [
              {
                doc_count: 77,
                key: 'Image',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 71,
          key: '799f766c-a956-4c03-b5aa-bde9ba357de8',
          name: {
            buckets: [
              {
                doc_count: 71,
                key: 'Podcast',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 24,
          key: '673e4c02-ae1c-4e61-830b-706d35bd0b11',
          name: {
            buckets: [
              {
                doc_count: 24,
                key: 'Spreadsheet',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 16,
          key: '7ee375e4-b781-46e6-b0de-0323ebb94b96',
          name: {
            buckets: [
              {
                doc_count: 16,
                key: 'Presentation',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 12,
          key: '0faac34b-2393-4352-8a94-a9ee0659f824',
          name: {
            buckets: [
              {
                doc_count: 12,
                key: 'PDF',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 9,
          key: 'b7094e27-b263-4fed-a928-6f0a78439cbe',
          name: {
            buckets: [
              {
                doc_count: 9,
                key: 'Text',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 8,
          key: '569cc389-ac1d-4fa0-9692-f715b475b59b',
          name: {
            buckets: [
              {
                doc_count: 8,
                key: 'Video',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 8,
          key: 'bda0cca5-ac84-4257-8b83-defac7f96738',
          name: {
            buckets: [
              {
                doc_count: 8,
                key: 'HTML',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 3,
          key: 'ee9855a5-3a65-4dcb-81b9-ac9f16e01831',
          name: {
            buckets: [
              {
                doc_count: 3,
                key: 'SCORM',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
      ],
      courses_recent_activities: {
        last_30_days: {
          doc_count: 3,
          unique_courses: {
            value: 1,
          },
        },
        last_7_days: {
          doc_count: 0,
          unique_courses: {
            value: 0,
          },
        },
        previous_30_days: {
          doc_count: 22,
          unique_courses: {
            value: 3,
          },
        },
        previous_7_days: {
          doc_count: 0,
          unique_courses: {
            value: 0,
          },
        },
      },
      courses_total_activities: 37,
      courses_total_courses: 8,
      enrollments_total_activities: 28,
      enrollments_total_seconds: 221.677,
      pulses_recent_activities: {
        last_30_days: {
          doc_count: 7,
          unique_pulses: {
            value: 2,
          },
        },
        last_7_days: {
          doc_count: 1,
          unique_pulses: {
            value: 1,
          },
        },
        previous_30_days: {
          doc_count: 139,
          unique_pulses: {
            value: 11,
          },
        },
        previous_7_days: {
          doc_count: 5,
          unique_pulses: {
            value: 1,
          },
        },
      },
      pulses_total_activities: 205,
      pulses_total_pulses: 12,
      total_seconds: 4107.644,
    },
    answers: {
      correct_answers: 30,
      correct_ratio: 0.9375,
      total_answers: 32,
      total_exams: 15,
      total_questions: 32,
    },
    courses: {
      channels_created: 36,
      courses_contributed: 0,
      courses_created: 312,
      pulses_created: 164,
    },
    enrollments: {
      categories: [
        {
          doc_count: 4,
          key: 'e5077e79-1ac8-4f84-a54e-c768eaf6a552',
          name: {
            buckets: [
              {
                doc_count: 4,
                key: 'Communications',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 3,
          key: '6dec35d5-ca97-4238-a2ea-2beff4256c92',
          name: {
            buckets: [
              {
                doc_count: 3,
                key: '15',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 2,
          key: '80d00879-8f18-42bd-9c07-579f4210077d',
          name: {
            buckets: [
              {
                doc_count: 2,
                key: 'asda',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 2,
          key: '9f2f3c32-e8a7-4f78-b54c-72754fee642c',
          name: {
            buckets: [
              {
                doc_count: 2,
                key: 'Imaginativo',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 1,
          key: '10a83ec6-bc13-465c-990c-914948d142f5',
          name: {
            buckets: [
              {
                doc_count: 1,
                key: 'Formação NR',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 1,
          key: '2335adc0-0c6a-41f2-a5f0-761721331368',
          name: {
            buckets: [
              {
                doc_count: 1,
                key: '17',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 1,
          key: '7d46e9d8-30cf-42be-99d0-19dd724d2be9',
          name: {
            buckets: [
              {
                doc_count: 1,
                key: 'Design',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 1,
          key: 'dbc9ffa1-1f59-428e-a18d-0e67a2770db8',
          name: {
            buckets: [
              {
                doc_count: 1,
                key: 'automacao cy',
              },
            ],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
      ],
      completed: {
        performance_avg: 1,
        ranges: [
          {
            doc_count: 0,
            key: '*-0.1',
            to: 0.1,
            from: 0,
          },
          {
            doc_count: 0,
            from: 0.1,
            key: '0.1-0.25',
            to: 0.25,
          },
          {
            doc_count: 0,
            from: 0.25,
            key: '0.25-0.5',
            to: 0.5,
          },
          {
            doc_count: 0,
            from: 0.5,
            key: '0.5-0.75',
            to: 0.75,
          },
          {
            doc_count: 2,
            from: 0.75,
            key: '0.75-*',
            to: 1,
          },
        ],
        ratio: 0.13333333333333333,
        total: 2,
      },
      performance_avg: 1,
      total: 15,
    },
  },
};
