import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  MissionActions,
  missionCreateFeatureKey,
  missionCreateInitialState,
  MissionProvidersActions,
} from '../../store';

import { MissionProviderComponent } from './mission-provider.component';
import { Mission, MissionProvider } from 'app/main/mission/mission.model';
import { Store } from '@ngrx/store';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionProviderComponent', () => {
  let component: MissionProviderComponent;
  let fixture: ComponentFixture<MissionProviderComponent>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionProviderComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [missionCreateFeatureKey]: missionCreateInitialState } })],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
  });

  it('should normalize the form value before saving', () => {
    const mockProvider: MissionProvider = { id: 'mock_provider_id', name: 'Provider', icon: '' };
    const mockCourseUrl = 'https://keeps.com.br';
    const expectedMission: Partial<Mission> = {
      provider: mockProvider,
      external_course_url: mockCourseUrl,
      external: { course_url: mockCourseUrl, provider: mockProvider.id },
    };
    const mockFormValue: Partial<Mission> = {
      provider: mockProvider,
      external_course_url: mockCourseUrl,
    };

    component.saveMission(mockFormValue);

    expect(dispatchSpy).toHaveBeenCalledWith(MissionActions.saveMission({ mission: expectedMission }));
  });

  it('should emit the search providers action', () => {
    component.searchProvider('mock_filter');

    expect(dispatchSpy).toHaveBeenCalledWith(MissionProvidersActions.filterProviders({ filter: 'mock_filter' }));
  });
});
