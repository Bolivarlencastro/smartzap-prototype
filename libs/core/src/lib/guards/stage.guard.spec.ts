import { TestBed } from '@angular/core/testing';
import { CanActivateFn, UrlTree } from '@angular/router';

import { stageGuard } from './stage.guard';
import { CORE_CONFIG, CoreConfig } from '../core-config';

describe('stageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => stageGuard(...guardParameters));
  let mockCoreConfig: CoreConfig;

  beforeEach(() => {
    mockCoreConfig = { production: false } as CoreConfig;
    TestBed.configureTestingModule({ providers: [{ provide: CORE_CONFIG, useValue: mockCoreConfig }] });
  });

  it('should allow access production is false', () => {
    const canActivate = executeGuard(null, { url: '' } as any);

    expect(canActivate).toBe(true);
  });

  it('should redirect to the default route when production is true', () => {
    mockCoreConfig.production = true;
    const resultingUrlTree = executeGuard(null, { url: '' } as any) as UrlTree;

    expect(resultingUrlTree.toString()).toBe('/');
  });
});
