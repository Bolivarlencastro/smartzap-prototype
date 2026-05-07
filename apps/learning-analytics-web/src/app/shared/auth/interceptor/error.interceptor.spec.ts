import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, tick } from '@angular/core/testing';
import { KeepsError } from '@core/model/error.model';
import { TranslocoModule } from '@jsverse/transloco';
import { ErrorInterceptor } from './error.interceptor';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import Keycloak from 'keycloak-js';

describe('ErrorInterceptor', () => {
  let errorInterceptor: ErrorInterceptor;
  let keycloakMock: jest.Mocked<Keycloak>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let client: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    keycloakMock = {
      logout: jest.fn().mockResolvedValue(undefined),
      authenticated: true,
    } as unknown as jest.Mocked<Keycloak>;

    messageServiceMock = {
      error: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    TestBed.configureTestingModule({
      imports: [TranslocoModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Keycloak, useValue: keycloakMock },
        { provide: KpMessageService, useValue: messageServiceMock },
        ErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
      ],
    });

    errorInterceptor = TestBed.inject(ErrorInterceptor);
    client = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });
  it('should create ErrorInterceptor', () => {
    expect(errorInterceptor).toBeTruthy();
  });

  it('should logout when user is authenticated but the server returns status 401 ', () => {
    const error401 = new HttpErrorResponse({
      error: 'test 401 status error',
      status: 401,
      statusText: 'Not Authorized',
    });

    client.get('/test').subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(KeepsError);
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Not Authorized');
        expect(error.message).toBe('Http failure response for /test: 401 Not Authorized');
        tick();
        expect(keycloakMock.logout).toHaveBeenCalled();
        expect(keycloakMock.logout).toHaveBeenCalledTimes(1);
      },
    });

    const request = controller.expectOne('/test');
    request.flush(error401.error, error401);
  });

  it('should show error message when user is not authorized to call an API', () => {
    const error403 = new HttpErrorResponse({
      error: 'test 403 status error',
      status: 403,
      statusText: 'Forbidden',
    });

    client.get('/test').subscribe({
      error: (error: KeepsError) => {
        expect(error).toBeInstanceOf(KeepsError);
        expect(error.status).toBe(403);
        expect(error.statusText).toBe('Forbidden');
        expect(error.message).toBe('Http failure response for /test: 403 Forbidden');
        expect(messageServiceMock.error).toHaveBeenCalled();
        expect(messageServiceMock.error).toHaveBeenCalledTimes(1);
        expect(messageServiceMock.error).toHaveBeenCalledWith(ErrorInterceptor.FORBIDDEN_MESSAGE);
      },
    });

    const request = controller.expectOne('/test');
    request.flush(null, error403);
  });

  it('should handle error when server returns status 400 ', () => {
    const error400 = new HttpErrorResponse({
      error: 'test 400 status error',
      status: 400,
      statusText: 'Bad Request',
    });

    client.get('/test').subscribe({
      error: (error: KeepsError) => {
        expect(error).toBeInstanceOf(KeepsError);
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
        expect(error.message).toBe('Http failure response for /test: 400 Bad Request');
      },
    });

    const request = controller.expectOne('/test');
    request.flush(null, error400);
  });

  it('should handle error when server returns status 404 ', () => {
    const error404 = new HttpErrorResponse({
      error: 'test 404 status error',
      status: 404,
      statusText: 'Not Found',
    });

    client.get('/test').subscribe({
      error: (error: KeepsError) => {
        expect(error).toBeInstanceOf(KeepsError);
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.message).toBe('Http failure response for /test: 404 Not Found');
      },
    });

    const request = controller.expectOne('/test');
    request.flush(null, error404);
  });

  it('should handle error when server returns status 500 ', () => {
    const error500 = new HttpErrorResponse({
      error: 'test 500 status error',
      status: 500,
      statusText: 'Internal Server Error',
    });

    client.get('/test').subscribe({
      error: (error: KeepsError) => {
        expect(error).toBeInstanceOf(KeepsError);
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        expect(error.message).toBe('Http failure response for /test: 500 Internal Server Error');
      },
    });

    const request = controller.expectOne('/test');
    request.flush(null, error500);
  });

  it('Should handle ErrorEvent', () => {
    client.get('/test').subscribe({
      error: (error: KeepsError) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
      },
    });

    const request = controller.expectOne('/test');
    request.error(new ProgressEvent(null));
  });
});
