import { TestBed } from '@angular/core/testing';
import { UserProfileService } from '../../services';
import { LazyRolesChecker } from './lazy-roles-checker.service';
import { delay, of } from 'rxjs';

describe('LazyRolesChecker', () => {
  let service: LazyRolesChecker;

  const userProfileServiceMock: jest.Mocked<UserProfileService> = {
    hasRoles: jest.fn(),
    getApplicationRoles: jest.fn(() => ['admin']),
    roles$: of(['admin']).pipe(delay(10)),
  } as unknown as jest.Mocked<UserProfileService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LazyRolesChecker, { provide: UserProfileService, useValue: userProfileServiceMock }],
    });

    service = TestBed.inject(LazyRolesChecker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of true when hasRoles returns true', (done) => {
    userProfileServiceMock.hasRoles.mockReturnValueOnce(true);

    service.lazyCheckRoles('admin').subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should return an observable of false when hasRoles returns false', (done) => {
    userProfileServiceMock.hasRoles.mockReturnValueOnce(false);

    service.lazyCheckRoles('admin').subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });

  it('should wait for the roles to load if they are not available', (done) => {
    userProfileServiceMock.hasRoles.mockReturnValueOnce(true);
    userProfileServiceMock.getApplicationRoles.mockReturnValueOnce([]);
    const pipeSpy = jest.spyOn(userProfileServiceMock.roles$, 'pipe');

    service.lazyCheckRoles('admin').subscribe((result) => {
      expect(result).toBe(true);
      expect(pipeSpy).toHaveBeenCalled();
      done();
    });
  });
});
