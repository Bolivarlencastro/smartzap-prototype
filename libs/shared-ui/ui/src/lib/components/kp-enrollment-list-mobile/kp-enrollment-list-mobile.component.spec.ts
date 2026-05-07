import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KpEnrollmentListMobileComponent } from './kp-enrollment-list-mobile.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Enrollment } from '../kp-mission-model/model';

const enrollments = [
  {
    end_date: '',
    performance: 1,
    start_date: '',
    progress: 1,
    status: EnrollmentStatuses.COMPLETED,
  },
];

describe('KpEnrollmentListMobileComponent', () => {
  let component: KpEnrollmentListMobileComponent;
  let fixture: ComponentFixture<KpEnrollmentListMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpEnrollmentListMobileComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(KpEnrollmentListMobileComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('enrollments', enrollments);
    fixture.detectChanges();
  });

  it('should emit filter event when the filter changes', () => {
    const spy = jest.spyOn(component.filterEvent, 'emit');
    const expectedStatus = ['mock_status_1'];

    component.filterFormGroup.get('status').setValue(expectedStatus);

    component.onFilterChange();
    expect(spy).toHaveBeenCalledWith({ status: expectedStatus });
  });

  it('should emit search change event', () => {
    const spy = jest.spyOn(component.searchChange, 'emit');

    component.onSearchChange('mock_search');

    expect(spy).toHaveBeenCalledWith('mock_search');
  });

  it('should on scroll', () => {
    const spy = jest.spyOn(component.scrolled, 'emit');
    component.onScroll();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit event to open external provider', () => {
    const spy = jest.spyOn(component.externalProvider, 'emit');
    const item = enrollments[0] as Enrollment;
    component.onOpenExternalProvider(item);
    expect(spy).toHaveBeenCalledWith(item);
  });

  it('should emit event to execute action', () => {
    const spy = jest.spyOn(component.executeAction, 'emit');
    const item = { status: EnrollmentStatuses.ENROLLED } as Enrollment;
    component.onExecuteAction(item);
    expect(spy).toHaveBeenCalledWith({ item, action: 'viewMission' });
  });

  describe('get item action', () => {
    const cases: any[] = [
      [{ learning_trail: {} }, 'viewTrail'],
      [{ learning_trail: {}, status: EnrollmentStatuses.COMPLETED }, 'generateCertificate'],
      [{ status: EnrollmentStatuses.ENROLLED }, 'viewMission'],
      [{ status: EnrollmentStatuses.STARTED }, 'continue'],
      [{ status: EnrollmentStatuses.REPROVED, required: true }, 'viewMission'],
      [{ status: EnrollmentStatuses.REPROVED, required: false }, 'reEnroll'],
      [{ status: EnrollmentStatuses.EXPIRED }, 'extendDeadline'],
      [{ status: EnrollmentStatuses.PENDING_VALIDATION }, 'generateCertificate'],
      [{ status: EnrollmentStatuses.COMPLETED }, 'generateCertificate'],
      [{ status: EnrollmentStatuses.GIVE_UP }, 'retake'],
      [{ status: EnrollmentStatuses.ENROLLMENT_REPROVED }, undefined],
      [{ status: EnrollmentStatuses.INACTIVATED }, undefined],
      [{ status: EnrollmentStatuses.REFUSED }, undefined],
      [{ status: EnrollmentStatuses.REQUEST_EXTENSION }, undefined],
    ];

    test.each(cases)('should get item action', (item, action) => {
      expect(component.getAction(item)).toBe(action);
    });
  });

  describe('display action button', () => {
    const cases: EnrollmentStatuses[] = [
      EnrollmentStatuses.ENROLLED,
      EnrollmentStatuses.STARTED,
      EnrollmentStatuses.REPROVED,
      EnrollmentStatuses.EXPIRED,
      EnrollmentStatuses.PENDING_VALIDATION,
      EnrollmentStatuses.COMPLETED,
      EnrollmentStatuses.GIVE_UP,
    ];

    test.each(cases)('should display action button if enrollment status is %p', (status) => {
      expect(component.displayActionButton(status)).toBe(true);
    });
  });

  describe('hide action button', () => {
    const cases: EnrollmentStatuses[] = [
      EnrollmentStatuses.ENROLLMENT_REPROVED,
      EnrollmentStatuses.INACTIVATED,
      EnrollmentStatuses.REFUSED,
      EnrollmentStatuses.REQUEST_EXTENSION,
    ];

    test.each(cases)('should hide action button if enrollment status is %p', (status) => {
      expect(component.displayActionButton(status)).toBe(false);
    });
  });

  it('should enable action button', () => {
    expect(component.disableActionButton(EnrollmentStatuses.PENDING_VALIDATION)).toBe(true);
  });

  describe('disable action button', () => {
    const cases: EnrollmentStatuses[] = [
      EnrollmentStatuses.ENROLLED,
      EnrollmentStatuses.STARTED,
      EnrollmentStatuses.REPROVED,
      EnrollmentStatuses.EXPIRED,
      EnrollmentStatuses.COMPLETED,
      EnrollmentStatuses.GIVE_UP,
    ];

    test.each(cases)('should disable action button if enrollment status is %p', (status) => {
      expect(component.disableActionButton(status)).toBe(false);
    });
  });
});
