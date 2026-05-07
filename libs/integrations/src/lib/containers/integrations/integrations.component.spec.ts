import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { EMPTY, of } from 'rxjs';
import { IntegrationsListComponent } from '../../components/integrations-list/integrations-list.component';
import { IntegrationsService } from '../../services';
import { integrationsInitialState } from '../../store';
import { IntegrationsActions, TokensDialogActions } from '../../store/actions';
import { IntegrationsComponent } from './integrations.component';

describe('IntegrationsComponent', () => {
  let component: IntegrationsComponent;
  let fixture: ComponentFixture<IntegrationsComponent>;
  let integrationsServiceMock: jest.Mocked<IntegrationsService>;
  let store: Store;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    integrationsServiceMock = {
      getIntegrations: jest.fn(() => of(EMPTY)),
      toggleIntegration: jest.fn(() => of(EMPTY)),
      openTokenConfigureDialog: jest.fn(),
    } as unknown as jest.Mocked<IntegrationsService>;

    await TestBed.configureTestingModule({
      imports: [IntegrationsComponent, IntegrationsListComponent],
      providers: [
        { provide: IntegrationsService, useValue: integrationsServiceMock },
        provideMockStore({ initialState: { integrations: integrationsInitialState } }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(IntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch toggleIntegration', () => {
    const event = { integration: { id: 'slack' } as any, enabled: true };
    component.toggleIntegration(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      IntegrationsActions.toggleIntegration({ integration: event.integration, enabled: event.enabled }),
    );
  });

  it('should dispatch openTokensConfigDialog', () => {
    component.openTokenConfigureDialog();
    expect(dispatchSpy).toHaveBeenCalledWith(TokensDialogActions.openDialog());
  });
});
