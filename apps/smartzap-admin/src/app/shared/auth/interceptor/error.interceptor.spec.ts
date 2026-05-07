import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorInterceptor } from './error.interceptor';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import Keycloak from 'keycloak-js';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        {
          provide: Keycloak,
          useValue: { logout: jest.fn() },
        },
        {
          provide: KpMessageService,
          useValue: {},
        },
      ],
    });
    interceptor = TestBed.inject(ErrorInterceptor);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('intercept', () => {
    describe('422 http error', () => {
      it('should thrown error without i18n message when error payload is not a valid json', (done) => {
        const httpRequest = new HttpRequest('GET', 'url');
        const httpError = new HttpErrorResponse({
          status: 422,
          error: 'invalid json',
        });
        const expectedError = {
          status: httpError.status,
          error: httpError.error,
          i18n: undefined,
        };
        const next = { handle: () => throwError(httpError) } as any;

        interceptor
          .intercept(httpRequest, next)
          .pipe(
            catchError((error) => {
              expect(error).toEqual(expectedError);
              return of({});
            }),
          )
          .subscribe(done());
      });

      it('should thrown error without i18n message when there is no fields in error payload', (done) => {
        const httpRequest = new HttpRequest('GET', 'url');
        const httpError = new HttpErrorResponse({
          status: 422,
          error: JSON.stringify({}),
        });
        const expectedError = {
          status: httpError.status,
          error: httpError.error,
          i18n: undefined,
        };
        const next = { handle: () => throwError(httpError) } as any;

        interceptor
          .intercept(httpRequest, next)
          .pipe(
            catchError((error) => {
              expect(error).toEqual(expectedError);
              return of({});
            }),
          )
          .subscribe(done());
      });

      it('should thrown error with i18n message from first field error payload', (done) => {
        const httpRequest = new HttpRequest('GET', 'url');
        const httpError = new HttpErrorResponse({
          status: 422,
          error: JSON.stringify({ name: ['error'] }),
        });
        const expectedError = {
          status: httpError.status,
          error: httpError.error,
          i18n: 'NAME.ERROR',
        };
        const next = { handle: () => throwError(httpError) } as any;

        interceptor
          .intercept(httpRequest, next)
          .pipe(
            catchError((error) => {
              expect(error).toEqual(expectedError);
              return of({});
            }),
          )
          .subscribe(done());
      });
    });
  });

  describe('transformErrorFromString', () => {
    it('should transform an error string', () => {
      const errorString = '{"name": ["Longer than maximum length 100."]}';
      const expectedResult = { name: ['Longer than maximum length 100.'] };

      const result = interceptor.transformErrorFromString(errorString);

      expect(result).toEqual(expectedResult);
    });

    it('should transform an error string sanitizing single quotes to double quotes', () => {
      const errorString = `{'name': ['Longer than maximum length 100.']}`;
      const expectedResult = { name: ['Longer than maximum length 100.'] };

      const result = interceptor.transformErrorFromString(errorString);

      expect(result).toEqual(expectedResult);
    });

    it('should return undefined when the error string is not a valid json string', () => {
      const errorString = 'not valid';

      const result = interceptor.transformErrorFromString(errorString);

      expect(result).toBeUndefined();
    });
  });

  describe('getFirstErrorMessage', () => {
    it('should return first error message from error payload', () => {
      const fieldName = 'name';
      const errorMessage = 'Longer than maximum length 100.';
      const errorPayload = { [fieldName]: [errorMessage] };
      const expectedResult = 'NAME.LONGER THAN MAXIMUM LENGTH 100';

      const result = interceptor.getFirstErrorMessage(errorPayload);

      expect(result).toEqual(expectedResult);
    });

    it('should return undefined when there are no fields with error', () => {
      const errorPayload = {};

      const result = interceptor.getFirstErrorMessage(errorPayload);

      expect(result).toBeUndefined();
    });

    it('should return undefined when there are no errors for the first field', () => {
      const errorPayload = { name: [] };

      const result = interceptor.getFirstErrorMessage(errorPayload);

      expect(result).toBeUndefined();
    });
  });
});
