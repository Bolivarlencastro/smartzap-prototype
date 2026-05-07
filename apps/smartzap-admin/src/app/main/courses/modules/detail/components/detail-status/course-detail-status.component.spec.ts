import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Course } from 'app/main/courses/model';
import { courseMock } from 'app/shared/test/courses';
import { CourseDetailStatusComponent } from './course-detail-status.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('CourseDetailStatusComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, getTranslocoTestingModule(), MatIconTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.debugElement.query(By.css('app-course-detail-status')).componentInstance).toBeTruthy();
  });

  it('should have three icons', () => {
    const icons = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(icons.length).toBeGreaterThanOrEqual(3);
  });

  it('should have duration', () => {
    const duration = fixture.debugElement.queryAll(By.css('[data-test="course-detail-status.status"]'))[0].nativeElement
      .textContent;
    expect(duration).toContain('1 min');
  });
});

@Component({
  template: ` <app-course-detail-status [course]="courseMock"></app-course-detail-status> `,
  imports: [CourseDetailStatusComponent],
})
class TestHostComponent {
  courseMock: Course = {
    allow_content_anticipation: false,
    allow_drop_out: false,
    disable_send_certificate: false,
    ...courseMock,
    name: 'course test',
    created: '2021-10-05T21:17:00.203605',
    user_creator: {
      name: 'Admin',
    },
    duration: '100',
    total_users_enrolled: 3,
    total_users_completed: 2,
  };
}
