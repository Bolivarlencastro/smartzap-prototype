import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesService } from '@app/shared/services';
import { globalSettingsInitialState } from '@app/shared/store/features';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { provideMockStore } from '@ngrx/store/testing';
import { WorkspaceSettingsComponent } from './workspace-settings.component';

describe('WorkspaceSettingsComponent', () => {
  let component: WorkspaceSettingsComponent;
  let fixture: ComponentFixture<WorkspaceSettingsComponent>;
  let servicesMock: jest.Mocked<ServicesService>;

  beforeEach(async () => {
    servicesMock = {
      fetchAppConfig: jest.fn(),
      changeWorkspaceService: jest.fn(),
    } as unknown as jest.Mocked<ServicesService>;

    await TestBed.configureTestingModule({
      imports: [WorkspaceSettingsComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { ['globalSettings']: globalSettingsInitialState } }),
        { provide: ServicesService, useValue: servicesMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call fetchAppConfig on init', () => {
    component.ngOnInit();
    expect(servicesMock.fetchAppConfig).toHaveBeenCalled();
  });

  it('should call changeWorkspaceService when a service status changes', () => {
    const event = { checked: true, service: 'SMARTZAP', workspaceId: undefined };

    component.onAppStatusChange(event);

    expect(servicesMock.changeWorkspaceService).toHaveBeenCalledWith(event);
  });
});
