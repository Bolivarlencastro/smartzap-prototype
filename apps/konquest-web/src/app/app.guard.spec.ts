import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { AppGuard } from './app.guard';

describe('AppGuard', () => {
  let guard: AppGuard;
  let workspaceService: jest.Mocked<WorkspaceService>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AppGuard,
        {
          provide: WorkspaceService,
          useValue: { workspaceSelected: jest.fn() },
        },
      ],
    }).compileComponents();

    guard = TestBed.inject(AppGuard);
    workspaceService = TestBed.inject(WorkspaceService) as jest.Mocked<WorkspaceService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigateToHome if workspace is set', () => {
    workspaceService.workspaceSelected.mockReturnValue(true);
    const routerSpy = jest.spyOn(router, 'navigate').mockImplementation();

    const canActivate = guard.canActivate();

    expect(routerSpy).toHaveBeenCalledWith(['missions']);
    expect(canActivate).toBe(true);
  });

  it('should not navigateToHome if workspace is not set', () => {
    workspaceService.workspaceSelected.mockReturnValue(false);
    const routerSpy = jest.spyOn(router, 'navigate').mockImplementation();

    const canActivate = guard.canActivate();

    expect(routerSpy).not.toHaveBeenCalled();
    expect(canActivate).toBe(true);
  });
});
