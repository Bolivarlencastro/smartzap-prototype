import { TestBed } from '@angular/core/testing';
import { CanActivateFn, CanMatchFn, UrlTree } from '@angular/router';
import { regulatoryComplianceCanActivate, regulatoryComplianceCanMatch } from './regulatory-compliance';
import { Observable, of } from 'rxjs';
import { LazyRolesChecker } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('RegulatoryComplianceGuards', () => {
  let lazyRolesCheckerMock: jest.Mocked<LazyRolesChecker>;

  const executeCanActivate: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => regulatoryComplianceCanActivate(...guardParameters));

  const executeCanMatch: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => regulatoryComplianceCanMatch(...guardParameters));

  beforeEach(() => {
    lazyRolesCheckerMock = { lazyCheckRoles: jest.fn(() => of(true)) } as unknown as jest.Mocked<LazyRolesChecker>;
    TestBed.configureTestingModule({ providers: [{ provide: LazyRolesChecker, useValue: lazyRolesCheckerMock }] });
  });

  describe('regulatoryComplianceCanActivate', () => {
    it('should be created', () => {
      expect(executeCanActivate).toBeTruthy();
    });

    it('should return an observable of true when access is allowed', (done) => {
      const executionResult = executeCanActivate(null, null) as Observable<boolean>;

      executionResult.subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return an observable of UrlTree redirecting to root when access is denied', (done) => {
      lazyRolesCheckerMock.lazyCheckRoles.mockReturnValueOnce(of(false));
      const executionResult = executeCanActivate(null, null) as Observable<UrlTree>;

      executionResult.subscribe((result) => {
        expect(result.toString()).toBe('/');
        done();
      });
    });
  });

  describe('regulatoryComplianceCanMatch', () => {
    it('should be created', () => {
      expect(executeCanMatch).toBeTruthy();
    });

    it('should return an observable of true when access is allowed', (done) => {
      const executionResult = executeCanMatch(null, null) as Observable<boolean>;

      executionResult.subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return an observable of UrlTree redirecting to root when access is denied', (done) => {
      lazyRolesCheckerMock.lazyCheckRoles.mockReturnValueOnce(of(false));
      const executionResult = executeCanMatch(null, null) as Observable<UrlTree>;

      executionResult.subscribe((result) => {
        expect(result.toString()).toBe('/');
        done();
      });
    });
  });
});
