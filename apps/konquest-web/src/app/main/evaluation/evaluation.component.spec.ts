import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MissionEvaluationComponent } from './evaluation.component';

import { CourseEvaluationActions } from './store/actions';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MissionDetailSelectors } from 'app/main/mission/pages/legacy-mission-detail/containers/mission-detail/store/selectors';
import { missionDetailInitialState } from 'app/main/mission/pages/legacy-mission-detail/containers/mission-detail/store/reducers';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionEvaluationComponent', () => {
  let component: MissionEvaluationComponent;
  let fixture: ComponentFixture<MissionEvaluationComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionEvaluationComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: AuthService, useValue: {} },
        provideMockStore({
          selectors: [
            {
              selector: MissionDetailSelectors.selectEvaluationQuestions,
              value: [{ id: '1' }],
            },
            {
              selector: MissionDetailSelectors.selectEvaluations,
              value: [
                {
                  mission: { id: '123' },
                  user: { id: '456' },
                },
                {
                  mission: { id: '124' },
                  user: { id: '456' },
                },
                {
                  mission: { id: '123' },
                  user: { id: '476' },
                },
                {
                  mission: { id: '123' },
                  user: undefined,
                },
              ],
            },
          ],
          initialState: missionDetailInitialState,
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch value after save and finish', () => {
    // given
    jest.spyOn(store, 'dispatch');
    const { comment, rating, nps } = { comment: 'Bulbasaur Charmander', rating: 5, nps: 4 };

    component.evaluationForm.patchValue({
      comment,
      rating,
      nps,
    });

    // when
    component.save();

    // expect
    expect(store.dispatch).toHaveBeenCalledWith(
      CourseEvaluationActions.postEvaluation({
        evaluation: {
          comment,
          rating,
          nps,
          isOnCourse: true,
        },
      }),
    );
  });

  it(`should dispatch ${CourseEvaluationActions.setRequiredData.type}`, () => {
    jest.spyOn(store, 'dispatch');
    const missionIdStub = '12345';
    const enrollmentIdStub = '12345';
    const isExternalMission = false;

    component.missionId = missionIdStub;
    component.enrollmentId = enrollmentIdStub;
    component.isOnCourse = false;
    component.isExternalMission = false;

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(
      CourseEvaluationActions.setRequiredData({
        missionId: missionIdStub,
        enrollmentId: enrollmentIdStub,
        isExternalMission,
      }),
    );
  });

  afterEach(() => {
    fixture.destroy();
  });
});
