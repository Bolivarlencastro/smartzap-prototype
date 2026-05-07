import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnrollmentsService } from 'app/main/courses/modules/enrollments/services';
import { Observable, of } from 'rxjs';
import { CourseCreateEnrollmentDialogComponent } from './course-create-enrollment-dialog.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

class EnrollmentsServiceMock {
  getUserByNumber(_phoneNumber: string): Observable<any> {
    return of({});
  }
}

describe('CourseCreateEnrollmentDialogComponent', () => {
  let component: CourseCreateEnrollmentDialogComponent;
  let fixture: ComponentFixture<CourseCreateEnrollmentDialogComponent>;
  let enrollmentsService: EnrollmentsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreateEnrollmentDialogComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: EnrollmentsService,
          useClass: EnrollmentsServiceMock,
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
    enrollmentsService = TestBed.inject(EnrollmentsService);

    fixture = TestBed.createComponent(CourseCreateEnrollmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getUserByNumber', () => {
    it('should update form value with user info when there is results', () => {
      const userNumber = 'userNumber';
      const userInfo = { name: 'name', email: 'email', tags: 'tags' };
      const result = { result: [userInfo] };
      jest.spyOn(component.form, 'patchValue');
      jest.spyOn(enrollmentsService, 'getUserByNumber').mockReturnValue(of(result));

      component.getUserByNumber(userNumber);

      expect(enrollmentsService.getUserByNumber).toHaveBeenCalledWith(userNumber);
      expect(component.form.patchValue).toHaveBeenCalledWith(userInfo);
    });

    it('should not update form value with user info when there is no results', () => {
      const userNumber = 'userNumber';
      const result = { result: [] };
      jest.spyOn(component.form, 'patchValue');
      jest.spyOn(enrollmentsService, 'getUserByNumber').mockReturnValue(of(result));

      component.getUserByNumber(userNumber);

      expect(enrollmentsService.getUserByNumber).toHaveBeenCalledWith(userNumber);
      expect(component.form.patchValue).not.toHaveBeenCalled();
    });
  });
});
