import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CourseActions, TransferActions } from '@app/main/courses/store/actions';
import { initialState } from '@app/main/courses/store/reducers/course.reducer';
import { ReportActions } from '@app/shared/store';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CourseDetailComponent } from './course-detail.component';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { provideRouter } from '@angular/router';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;
  let store: MockStore;
  let matDialogRef: MatDialogRef<KpConfirmDialogComponent>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  const afterClosedMock = jest.fn().mockReturnValue(of({ user: { id: '1' } }));

  beforeEach(() => {
    userProfileServiceMock = {
      isAdmin$: jest.fn().mockReturnValue(of(false)),
    } as unknown as jest.Mocked<UserProfileService>;
    TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState: { ['course']: initialState } }),
        { provide: MatDialog, useValue: { open: jest.fn(() => matDialogRef) } },
        {
          provide: MatDialogRef,
          useValue: {
            componentInstance: { confirmMessage: null, confirmTitle: null },
            afterClosed: afterClosedMock,
          },
        },
        { provide: UserProfileService, useValue: userProfileServiceMock },
      ],
    });

    store = TestBed.inject(MockStore);
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;
    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch deleteCourse action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    afterClosedMock.mockReturnValueOnce(of(true));
    component.onRemove('1');
    expect(spy).toHaveBeenCalledWith(CourseActions.deleteCourse({ id: '1' }));
  });

  it('should dispatch loadUsersByRoleId action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onTransfer(undefined);
    expect(spy).toHaveBeenCalledWith(
      TransferActions.loadUsersByRoleId({ roleId: '3d010792-7119-4e14-bea3-5258a31f1ddc' }),
    );
  });

  it('should dispatch transferOwnership action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onTransfer('1');
    expect(spy).toHaveBeenCalledWith(TransferActions.transferOwnership({ courseId: '1', userId: '1' }));
  });

  it('should dispatch publish action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onPublish('1');
    expect(spy).toHaveBeenCalledWith(CourseActions.publish({ id: '1' }));
  });

  it('should dispatch generateReport action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onGenerateReport('1', 'USERS');
    expect(spy).toHaveBeenCalledWith(ReportActions.generateReport({ id: '1', reportType: 'USERS' }));
  });

  it('should dispatch updateCourseDescription action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const summary = 'New course description';
    component.updateDescription(summary);
    expect(spy).toHaveBeenCalledWith(CourseActions.updateCourseDescription({ summary }));
  });
});
