import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MissionActions, missionCreateFeatureKey, missionCreateInitialState } from '../../store';

import { MissionCreateComponent } from './mission-create.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionCreateComponent', () => {
  let component: MissionCreateComponent;
  let fixture: ComponentFixture<MissionCreateComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionCreateComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [missionCreateFeatureKey]: missionCreateInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionCreateComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it(`should dispatch ${MissionActions.resetStore.type} action`, () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(MissionActions.resetStore());
  });
});
