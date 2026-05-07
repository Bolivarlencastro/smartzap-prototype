import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Enrollment } from 'app/main/courses/model';
import { EnrollmentListComponent } from './enrollment-list.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('EnrollmentListComponent', () => {
  let component: EnrollmentListComponent;
  let fixture: ComponentFixture<EnrollmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentListComponent, getTranslocoTestingModule()],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentListComponent);
    component = fixture.componentInstance;
    component.datasource = [];
    fixture.detectChanges();
  });

  it('should not display remove button when list is empty', () => {
    const removeAllButton = fixture.debugElement.query(By.css('[data-test="enrollmenL-list.removeAllButton"]'));

    expect(component.datasource.length).toBe(0);
    expect(removeAllButton).toBeFalsy();
  });

  describe('sortData', () => {
    it('should emit sort event', () => {
      jest.spyOn(component.sortEvent, 'emit');
      const event = { direction: 'asc', active: 'user__name' } as Sort;

      component.sortData(event);

      expect(component.sortEvent.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('handleOpenActivities', () => {
    it('should emit openActivities', () => {
      jest.spyOn(component.openActivities, 'emit');
      const enrollment = {} as Enrollment;

      component.handleOpenActivities(enrollment);

      expect(component.openActivities.emit).toHaveBeenCalledWith(enrollment);
    });
  });

  describe('handleReenroll', () => {
    it('should emit reenroll', () => {
      jest.spyOn(component.reenroll, 'emit');
      const enrollment = {} as Enrollment;

      component.handleReenroll(enrollment);

      expect(component.reenroll.emit).toHaveBeenCalledWith(enrollment);
    });
  });

  describe('handleDelete', () => {
    it('should emit removeEvent', () => {
      jest.spyOn(component.removeEvent, 'emit');
      const enrollment = {} as Enrollment;

      component.handleDelete(enrollment);

      expect(component.removeEvent.emit).toHaveBeenCalledWith(enrollment.id);
    });
  });

  describe('handleCancel', () => {
    it('should emit removeEvent', () => {
      jest.spyOn(component.cancelEnrollment, 'emit');
      const enrollment = {} as Enrollment;

      component.handleCancel(enrollment);

      expect(component.cancelEnrollment.emit).toHaveBeenCalledWith(enrollment);
    });
  });

  describe('displayDownloadCertificate', () => {
    const cases: any[] = [
      [true, { status: EnrollmentStatuses.COMPLETED, certificate_url: 'test_url' }],
      [false, { status: EnrollmentStatuses.COMPLETED, certificate_url: '' }],
      [false, { status: EnrollmentStatuses.REPROVED, certificate_url: 'test_url' }],
      [false, { status: EnrollmentStatuses.REPROVED, certificate_url: '' }],
    ];

    test.each(cases)('should return %p when enrollment is %p', (expectedResult, enrollment) => {
      const result = component.displayDownloadCertificate(enrollment);
      expect(result).toBe(expectedResult);
    });
  });
});
