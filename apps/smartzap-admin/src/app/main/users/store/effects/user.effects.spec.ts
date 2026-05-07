import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { UsersEffects } from './users.effects';
import { User } from '../../model';
import { UsersService } from '../../services';
import { initialState, State } from '../reducers/users.reducer';
import { selectGetUsers } from '../selectors/users.selectors';
import { UsersActions } from '../actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

class UsersServiceMock {
  updateUser(_userId: string, _payload: User): Observable<any> {
    return of({});
  }

  fetchUsers(_params: any, _filter: any): Observable<any> {
    return of({});
  }
}

describe('UsersEffects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let usersService: UsersService;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: UsersService,
          useClass: UsersServiceMock,
        },
        {
          provide: KpMessageService,
          useValue: {},
        },
      ],
    }).compileComponents();
    effects = TestBed.inject(UsersEffects);
    usersService = TestBed.inject(UsersService);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('updateUser$', () => {
    it('should fire action when update user succeeds', (done) => {
      const userId = 'userId';
      const userPayload = {
        name: 'name',
        email: 'email',
        phone: 'phone',
        tags: 'tags',
      };
      const updateUserSpy = jest.spyOn(usersService, 'updateUser');
      const expectedAction = {
        type: UsersActions.updateUserSuccess.type,
        user: { id: userId, ...userPayload },
      };
      actions$ = of(
        UsersActions.updateUser({
          id: userId,
          user: userPayload,
        }),
      );

      effects.updateUser$.subscribe((response) => {
        expect(updateUserSpy).toHaveBeenCalledWith(userId, userPayload);
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire failure action with mapped message by response status code when could not update user', (done) => {
      const userId = 'userId';
      const userPayload = {
        name: 'name',
        email: 'email',
        phone: 'phone',
        tags: 'tags',
      };
      const updateUserError = { status: 409 };
      const updateUserSpy = jest.spyOn(usersService, 'updateUser').mockReturnValue(throwError(updateUserError));
      const expectedErrorMessage = 'USERS.ERROR.USER_EXISTS';
      const expectedAction = {
        type: UsersActions.updateUserFailure.type,
        error: expectedErrorMessage,
      };
      actions$ = of(
        UsersActions.updateUser({
          id: userId,
          user: userPayload,
        }),
      );

      effects.updateUser$.subscribe((response) => {
        expect(updateUserSpy).toHaveBeenCalledWith(userId, userPayload);
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire failure action with default message when could not update user', (done) => {
      const userId = 'userId';
      const userPayload = {
        name: 'name',
        email: 'email',
        phone: 'phone',
        tags: 'tags',
      };
      const updateUserError = { status: 400, i18n: 'error' };
      const updateUserSpy = jest.spyOn(usersService, 'updateUser').mockReturnValue(throwError(updateUserError));
      const expectedAction = {
        type: UsersActions.updateUserFailure.type,
        error: updateUserError.i18n,
      };
      actions$ = of(
        UsersActions.updateUser({
          id: userId,
          user: userPayload,
        }),
      );

      effects.updateUser$.subscribe((response) => {
        expect(updateUserSpy).toHaveBeenCalledWith(userId, userPayload);
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('toggleSelectAll$', () => {
    it('should fire toggleSelectUser with selected equals true for each non selected user', (done) => {
      const users = [
        { id: '1', selected: true },
        { id: '2', selected: false },
      ] as User[];
      store.overrideSelector(selectGetUsers, users);

      actions$ = of(UsersActions.toggleSelectAll());

      effects.toggleSelectAll$.subscribe((response) => {
        expect(response).toEqual(UsersActions.toggleSelectUser({ id: '2', selected: true }));
        done();
      });
    });

    it('should fire toggleSelectUser with selected equals false for all users when all are selected', (done) => {
      const users = [{ id: '1', selected: true }] as User[];
      store.overrideSelector(selectGetUsers, users);

      actions$ = of(UsersActions.toggleSelectAll());

      effects.toggleSelectAll$.subscribe((response) => {
        expect(response).toEqual(UsersActions.toggleSelectUser({ id: '1', selected: false }));
        done();
      });
    });
  });
});
