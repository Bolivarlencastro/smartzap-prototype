import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LanguagesService, UserCreateDTO, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UsersService } from 'app/shared/services';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { of } from 'rxjs';
import { UserDataTransferActions, UserDetailsActions } from '../store/actions';
import { initialState, userDetailsFeatureKey } from '../store/reducers/user-details.reducer';
import { UserAsideComponent } from './user-aside.component';

describe('UserAsideComponent', () => {
  let component: UserAsideComponent;
  let fixture: ComponentFixture<UserAsideComponent>;
  let mockLanguagesService: jest.Mocked<LanguagesService>;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockWorkspaceService: jest.Mocked<WorkspaceService>;
  let store: MockStore;

  beforeEach(async () => {
    mockLanguagesService = { languages: signal([]) } as unknown as jest.Mocked<LanguagesService>;
    mockUsersService = { setUserAvatarForUpload: jest.fn() } as unknown as jest.Mocked<UsersService>;
    mockWorkspaceService = {
      getCurrentWorkspace: jest.fn().mockReturnValue(null),
    } as unknown as jest.Mocked<WorkspaceService>;
    await TestBed.configureTestingModule({
      imports: [UserAsideComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: LanguagesService,
          useValue: mockLanguagesService,
        },
        { provide: UsersService, useValue: mockUsersService },
        { provide: WorkspaceService, useValue: mockWorkspaceService },
        provideMockStore({ initialState: { [userDetailsFeatureKey]: initialState } }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ id: undefined }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserAsideComponent);
    component = fixture.componentInstance;
  });

  describe('userDetailAction', () => {
    it('should dispatch sendEmail action', () => {
      component.onAction('sendInvitation');
      expect(store.dispatch).toHaveBeenCalledWith(UserDetailsActions.sendEmail());
    });

    it('should dispatch generateTemporaryPassword action', () => {
      component.onAction('resetPassword');
      expect(store.dispatch).toHaveBeenCalledWith(UserDetailsActions.generateTemporaryPassword());
    });

    it('should dispatch closeUserDetails action', () => {
      component.onAction('close');
      expect(store.dispatch).toHaveBeenCalledWith(UserDetailsActions.closeUserDetails());
    });

    it('should dispatch deleteUser action', () => {
      component.onAction('delete');
      expect(store.dispatch).toHaveBeenCalledWith(UserDetailsActions.deleteUserFromWorkspace());
    });

    it('should dispatch importData action', () => {
      component.onAction('importData');
      expect(store.dispatch).toHaveBeenCalledWith(UserDataTransferActions.init());
    });
  });

  it('should dispatch saveUser action', () => {
    const user = { name: 'test' } as UserCreateDTO;
    component.saveUser(user);
    expect(store.dispatch).toHaveBeenCalledWith(UserDetailsActions.saveUser({ user, userRoles: undefined }));
  });
});
