import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

import { MissionCreationDeactivate, missionDeactivateGuard } from './mission-deactivate.guard';
import { signal, WritableSignal } from '@angular/core';

class TestMockComponent implements MissionCreationDeactivate {
  canDeactivate(): boolean {
    return false;
  }
}

describe('missionDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn<MissionCreationDeactivate> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => missionDeactivateGuard(...guardParameters));

  let component: TestMockComponent;
  let currentNavigation: WritableSignal<any>;

  beforeEach(() => {
    currentNavigation = signal({ extras: { state: { missionSaved: false } } });
    const routerMock = { currentNavigation };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslocoService,
          useValue: { translate: jest.fn().mockImplementation((args: string) => args) },
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });
    component = new TestMockComponent();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if the component canDeactivateFunction returns true', () => {
    jest.spyOn(component, 'canDeactivate').mockReturnValue(true);

    const canDeactivate = executeGuard(component, null, { url: '' } as any, null);
    expect(canDeactivate).toBe(true);
  });

  it('should return true route state missionSaved property is true', () => {
    currentNavigation.set({ extras: { state: { missionSaved: true } } });
    jest.spyOn(component, 'canDeactivate').mockReturnValue(false);

    const canDeactivate = executeGuard(component, null, { url: '' } as any, null);
    expect(canDeactivate).toBe(true);
  });

  it('should open the confirmation dialog if the component canDeactivateFunction returns false', () => {
    jest.spyOn(component, 'canDeactivate').mockReturnValue(false);
    window.confirm = jest.fn().mockImplementation(() => true);

    const canDeactivate = executeGuard(component, null, { url: '' } as any, null);

    expect(window.confirm).toHaveBeenCalledWith('MISSION.CREATE.LEAVE_CONFIRMATION');
    expect(canDeactivate).toBe(true);
  });

  it('should open the confirmation dialog  with a translated message', () => {
    jest.spyOn(component, 'canDeactivate').mockReturnValue(false);
    window.confirm = jest.fn().mockImplementation(() => true);

    executeGuard(component, null, { url: '' } as any, null);

    expect(window.confirm).toHaveBeenCalledWith('MISSION.CREATE.LEAVE_CONFIRMATION');
  });
});
