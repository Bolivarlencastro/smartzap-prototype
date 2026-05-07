import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollmentsComponent } from './enrollments.component';
import { EnrollmentsService } from './services/enrollments.service';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { KpUserOnboardingService } from '@keeps-platform-frontend-workspace/ui/kp-user-onboarding-service';

describe('EnrollmentsComponent', () => {
  let component: EnrollmentsComponent;
  let fixture: ComponentFixture<EnrollmentsComponent>;

  beforeEach(() => {
    TestBed.overrideComponent(EnrollmentsComponent, { add: { schemas: [NO_ERRORS_SCHEMA] } });

    TestBed.configureTestingModule({
      imports: [EnrollmentsComponent, getTranslocoTestingModule()],
      providers: [
        EnrollmentsService,
        provideRouter([]),
        {
          provide: KpUserOnboardingService,
          useValue: { openDialog: jest.fn() },
        },
      ],
    });
    fixture = TestBed.createComponent(EnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display nav label', () => {
    const navItem = { path: '', label: 'is not mobile', mobileLabel: 'is mobile' };
    component.isMobile = false;
    expect(component.displayNavLabel(navItem)).toBe('is not mobile');

    component.isMobile = true;
    expect(component.displayNavLabel(navItem)).toBe('is mobile');
  });
});
