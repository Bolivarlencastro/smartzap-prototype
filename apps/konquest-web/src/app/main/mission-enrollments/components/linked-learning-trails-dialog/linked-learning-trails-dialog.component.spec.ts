import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Step } from 'app/main/learning-trail/model/learning-trail';
import { MissionsEnrollmentsDialogComponent } from '../missions-enrollments-dialog/missions-enrollments-dialog.component';
import { LinkedLearningTrailsComponent } from './linked-learning-trails-dialog.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('LinkedLearningTrailsComponent', () => {
  let component: LinkedLearningTrailsComponent;
  let fixture: ComponentFixture<LinkedLearningTrailsComponent>;
  let dialogRef: jest.Mocked<MatDialogRef<MissionsEnrollmentsDialogComponent>>;
  const learningTrail = {
    id: '2',
    learning_trail: '111',
    learning_trail_name: 'Learning Trail Name',
    order: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedLearningTrailsComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: [
            {
              id: '1',
              learning_trail: '111',
              learning_trail_name: 'Learning Trail Name',
              order: 0,
            },
            learningTrail,
            {
              id: '3',
              learning_trail: '112',
              learning_trail_name: 'Learning Trail Name 2',
              order: 2,
            },
          ],
        },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
      ],
    }).compileComponents();
    dialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<MissionsEnrollmentsDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedLearningTrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.dataSourceLearningTrails).toBeTruthy();
  });

  it('should navigate to learning trail with param "trail"', () => {
    // when
    component.onClickRow(learningTrail as Step);

    // expect
    expect(dialogRef.close).toHaveBeenCalledWith({ row: learningTrail, results: undefined });
  });
});
