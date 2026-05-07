import { HttpErrorResponse } from '@angular/common/http';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeInfosApi, UserCreateDTO, UsersApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KeepsError } from '@core/model';
import { UsersService } from 'app/shared/services/users.service';
import { Chance } from 'chance';
import { EMPTY, of, throwError } from 'rxjs';

describe('UsersService', () => {
  let myAccountApiMock: jest.Mocked<MyAccountV2API>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let dialogMock: jest.Mocked<MatDialog>;
  let employeeInfosApiMock: jest.Mocked<EmployeeInfosApi>;
  let usersApiMock: jest.Mocked<UsersApi>;
  let service: UsersService;
  const chance = new Chance();

  beforeEach(() => {
    myAccountApiMock = {
      post: jest.fn().mockReturnValue(of(EMPTY)),
      get: jest.fn().mockReturnValue(of(EMPTY)),
      patch: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MyAccountV2API>;
    messageServiceMock = {
      error: jest.fn(),
      success: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;
    dialogMock = {} as jest.Mocked<MatDialog>;
    employeeInfosApiMock = {} as jest.Mocked<EmployeeInfosApi>;
    usersApiMock = {} as jest.Mocked<UsersApi>;
    service = new UsersService(myAccountApiMock, messageServiceMock, dialogMock, employeeInfosApiMock, usersApiMock);
  });

  it('should generate 8 digits passwords', (done) => {
    const userId = chance.guid();

    service.generateTemporaryPassword(userId).subscribe(() => {
      expect(myAccountApiMock.post).toHaveBeenCalledWith('/users/set-password', {
        user_id: userId,
        password: expect.stringMatching(/^\d{8}$/),
        temporary: true,
      });
      done();
    });
  });

  describe('saveUser', () => {
    const user = { name: 'Test User' } as UserCreateDTO;

    const makeDuplicateCpfError = () =>
      new KeepsError(new HttpErrorResponse({ error: { errorCode: 'DUPLICATE_CPF', detail: '' } }));

    describe('create (no userId)', () => {
      it('should show DUPLICATE_CPF_ERROR when the server returns errorCode DUPLICATE_CPF', (done) => {
        myAccountApiMock.post = jest.fn().mockReturnValue(throwError(() => makeDuplicateCpfError()));

        service.saveUser(user, '').subscribe({
          error: () => {
            expect(messageServiceMock.error).toHaveBeenCalledWith('USER.DUPLICATE_CPF_ERROR');
            done();
          },
        });
      });

      it('should show CREATE_USER_ERROR on a generic error', (done) => {
        myAccountApiMock.post = jest.fn().mockReturnValue(throwError(() => new Error('generic')));

        service.saveUser(user, '').subscribe({
          error: () => {
            expect(messageServiceMock.error).toHaveBeenCalledWith('USER.CREATE_USER_ERROR');
            done();
          },
        });
      });
    });

    describe('update (with userId)', () => {
      it('should show DUPLICATE_CPF_ERROR when the server returns errorCode DUPLICATE_CPF', (done) => {
        myAccountApiMock.patch = jest.fn().mockReturnValue(throwError(() => makeDuplicateCpfError()));

        service.saveUser(user, chance.guid()).subscribe({
          error: () => {
            expect(messageServiceMock.error).toHaveBeenCalledWith('USER.DUPLICATE_CPF_ERROR');
            done();
          },
        });
      });

      it('should show UPDATE_USER_ERROR on a generic error', (done) => {
        myAccountApiMock.patch = jest.fn().mockReturnValue(throwError(() => new Error('generic')));

        service.saveUser(user, chance.guid()).subscribe({
          error: () => {
            expect(messageServiceMock.error).toHaveBeenCalledWith('USER.UPDATE_USER_ERROR');
            done();
          },
        });
      });
    });
  });

  describe('listUsersForLeaderAutocomplete', () => {
    it('should call the api with the correct params', (done) => {
      const search = 'admin';
      const currentUserId = chance.guid();
      const expectedParams = {
        search,
        'filter.status': `$eq:true`,
        sortBy: `name:DESC`,
        select: 'id,name',
        'filter.id': `$not:$in:${currentUserId}`,
      };
      const mockResponse = { data: [{ id: '123', name: 'admin' }] };
      myAccountApiMock.get.mockReturnValueOnce(of(mockResponse));

      service.listUsersForLeaderAutocomplete(search, currentUserId).subscribe((result) => {
        expect(myAccountApiMock.get).toHaveBeenCalledWith('/users', expectedParams);
        expect(result).toEqual(mockResponse.data);
        done();
      });
    });
  });
});
