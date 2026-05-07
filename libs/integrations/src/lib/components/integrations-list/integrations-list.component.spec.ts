import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../utils';
import { IntegrationCardComponent } from '../integration-card/integration-card.component';
import { IntegrationsListComponent } from './integrations-list.component';

describe('IntegrationsListComponent', () => {
  let component: IntegrationsListComponent;
  let fixture: ComponentFixture<IntegrationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationsListComponent, IntegrationCardComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit toggleIntegration', () => {
    const emitSpy = jest.spyOn(component.integrationToggle, 'emit');
    const mockIntegration = { id: 'slack' } as any;

    component.toggleIntegration(mockIntegration, true);

    expect(emitSpy).toHaveBeenCalledWith({ integration: mockIntegration, enabled: true });
  });
});
