import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mission } from 'app/main/mission/mission.model';
import { MissionProviderFormComponent } from './mission-provider-form.component';
import { By } from '@angular/platform-browser';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionProviderFormComponent', () => {
  let component: MissionProviderFormComponent;
  let fixture: ComponentFixture<MissionProviderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionProviderFormComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionProviderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reflect the mission on the form', () => {
    const submitSpy = jest.spyOn(component.formSubmit, 'emit');
    const mockProvider = { id: 'mock_provider_id', name: 'mock_provider', icon: '' };
    const mockMission: Partial<Mission> = {
      external_course_url: 'https://mock_url.com',
      duration_time: 3600,
      provider: mockProvider,
    };
    const expectedFormValue: Partial<Mission> = {
      duration_time: 3600,
      external_course_url: 'https://mock_url.com',
      provider: { icon: '', id: 'mock_provider_id', name: 'mock_provider' },
    };

    fixture.componentRef.setInput('mission', mockMission);
    fixture.detectChanges();
    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledWith(expectedFormValue);
  });

  it('should emit the searchProvider event', () => {
    const searchProviderSpy = jest.spyOn(component.searchProvider, 'emit');

    const providerInput: HTMLInputElement = fixture.debugElement.query(
      By.css("[data-test='provider-input']"),
    ).nativeElement;

    providerInput.value = 'mock_filter';
    providerInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(searchProviderSpy).toHaveBeenCalledWith('mock_filter');
  });

  it('should disable the form if the mission is from an integration', () => {
    const mockProvider = { id: 'mock_provider_id', name: 'mock_provider', icon: '' };
    const mockMission: Partial<Mission> = {
      external_course_url: 'https://mock_url.com',
      duration_time: 3600,
      provider: mockProvider,
      is_integration: true,
    };
    const providerInput: HTMLInputElement = fixture.debugElement.query(
      By.css("[data-test='provider-input']"),
    ).nativeElement;

    fixture.componentRef.setInput('mission', mockMission);
    fixture.detectChanges();

    expect(providerInput.disabled).toBe(true);
  });

  it('should emit next if the mission is from an integration when submitting the form', () => {
    const nextSpy = jest.spyOn(component.next, 'emit');
    const mockProvider = { id: 'mock_provider_id', name: 'mock_provider', icon: '' };
    const mockMission: Partial<Mission> = {
      external_course_url: 'https://mock_url.com',
      duration_time: 3600,
      provider: mockProvider,
      is_integration: true,
    };
    fixture.componentRef.setInput('mission', mockMission);
    fixture.detectChanges();

    component.onSubmit();

    expect(nextSpy).toHaveBeenCalled();
  });
});
