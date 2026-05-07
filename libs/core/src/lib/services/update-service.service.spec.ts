import { TestBed } from '@angular/core/testing';
import { provideUpdates } from './update-service.service';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { EMPTY, NEVER, of, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { UserProfileService } from './user-profile.service';

class SwUpdateMock {
  isEnabled = true;
  versionUpdates = new Subject<VersionEvent>();
}

describe('UpdateService (via provideUpdates)', () => {
  let swUpdate: SwUpdateMock;
  let logSpy: jest.SpyInstance;
  let snackbar: jest.Mocked<MatSnackBar>;
  let userProfileService: jest.Mocked<UserProfileService>;
  let locationMock: jest.Mocked<Location>;
  let snackbarRef: jest.Mocked<MatSnackBarRef<any>>;

  beforeEach(() => {
    swUpdate = new SwUpdateMock();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    snackbarRef = { onAction: jest.fn().mockReturnValue(NEVER) } as unknown as jest.Mocked<MatSnackBarRef<any>>;
    snackbar = {
      open: jest.fn().mockReturnValue(snackbarRef),
    } as unknown as jest.Mocked<MatSnackBar>;
    userProfileService = {
      getUserLocale: jest.fn().mockReturnValue('en'),
    } as unknown as jest.Mocked<UserProfileService>;

    locationMock = {
      reload: jest.fn(),
    } as unknown as jest.Mocked<Location>;

    delete (window as any).location;
    window.location = locationMock;

    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: swUpdate },
        { provide: MatSnackBar, useValue: snackbar },
        { provide: UserProfileService, useValue: userProfileService },
        provideUpdates(),
      ],
    });

    TestBed.inject(SwUpdate);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should not subscribe or log when service worker is disabled', () => {
    swUpdate.isEnabled = false;

    TestBed.resetTestingModule();

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: swUpdate },
        { provide: MatSnackBar, useValue: snackbar },
        { provide: UserProfileService, useValue: userProfileService },
        provideUpdates(),
      ],
    });

    TestBed.inject(SwUpdate);

    swUpdate.versionUpdates.next({
      type: 'VERSION_DETECTED',
      version: { hash: 'abc', appData: {} },
    } as VersionEvent);

    swUpdate.versionUpdates.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'old', appData: {} },
      latestVersion: { hash: 'new', appData: {} },
    } as VersionEvent);

    swUpdate.versionUpdates.next({
      type: 'VERSION_INSTALLATION_FAILED',
      version: { hash: 'err', appData: {} },
      error: new Error('boom'),
    } as unknown as VersionEvent);

    expect(logSpy).not.toHaveBeenCalled();
  });

  it('should log when a new version is detected', () => {
    swUpdate.versionUpdates.next({
      type: 'VERSION_DETECTED',
      version: { hash: 'v1', appData: {} },
    } as VersionEvent);

    expect(logSpy).toHaveBeenCalledWith('Downloading new app version: v1');
  });

  it('should log the current and new versions when a new version is ready', () => {
    swUpdate.versionUpdates.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'v1', appData: {} },
      latestVersion: { hash: 'v2', appData: {} },
    } as VersionEvent);

    expect(logSpy).toHaveBeenNthCalledWith(1, 'Current app version: v1');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'New app version ready for use: v2');
    expect(snackbar.open).toHaveBeenCalledWith('A new version is ready to use!', 'Reload', {
      duration: 60 * 1000,
      panelClass: 'kp-snackbar-success',
    });
  });

  it('should display the update message in the user language', () => {
    userProfileService.getUserLocale.mockReturnValue('pt-BR');

    swUpdate.versionUpdates.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'v1', appData: {} },
      latestVersion: { hash: 'v2', appData: {} },
    } as VersionEvent);

    expect(snackbar.open).toHaveBeenCalledWith('Uma nova versão está pronta para uso!', 'Recarregar', {
      duration: 60 * 1000,
      panelClass: 'kp-snackbar-success',
    });
  });

  it('should reload the page when the user clicks the reload button in the snackbar', () => {
    (snackbarRef.onAction as any).mockReturnValueOnce(of(EMPTY));

    swUpdate.versionUpdates.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'v1', appData: {} },
      latestVersion: { hash: 'v2', appData: {} },
    } as VersionEvent);

    expect(locationMock.reload).toHaveBeenCalled();
  });

  it('should log an error when version installation fails', () => {
    const err = new Error('network');
    swUpdate.versionUpdates.next({
      type: 'VERSION_INSTALLATION_FAILED',
      version: { hash: 'v2', appData: {} },
      error: err,
    } as unknown as VersionEvent);

    expect(logSpy).toHaveBeenCalledWith("Failed to install app version 'v2': Error: network");
  });
});
