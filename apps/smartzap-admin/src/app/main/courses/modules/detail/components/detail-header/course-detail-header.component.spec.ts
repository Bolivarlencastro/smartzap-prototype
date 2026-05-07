import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Course } from 'app/main/courses/model';
import { courseMock } from 'app/shared/test/courses';

import { CourseDetailHeaderComponent } from './course-detail-header.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('CourseDetailHeaderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, getTranslocoTestingModule()],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.debugElement.query(By.css('app-course-detail-header')).componentInstance).toBeTruthy();
  });

  it('should have name', () => {
    const courseName = fixture.debugElement.query(By.css('[data-test="course-detail-header.name"]')).nativeElement
      .textContent;
    expect(courseName).toContain(component.courseMock.name);
  });

  it('should have default background card', () => {
    const background = fixture.debugElement.query(By.css('.course-detail-header')).styles['background-image'];
    expect(background).toContain('default-card-bg');
  });

  it('should have show avatar placeholder', () => {
    const avatarImg = fixture.debugElement.query(By.css('[data-test="course-detail-header.avatar"]')).nativeElement;
    expect(avatarImg.src).toContain('avatar-placeholder');
  });

  it('should have user name', () => {
    const userName = fixture.debugElement.query(By.css('[data-test="course-detail-header.user_creator_name"]'))
      .nativeElement.textContent;
    expect(userName.trim()).toEqual(component.courseMock.user_creator.name);
  });
});

@Component({
  template: ` <app-course-detail-header [course]="courseMock"></app-course-detail-header> `,
  imports: [CourseDetailHeaderComponent],
})
class TestHostComponent {
  courseMock = {
    ...courseMock,
    name: 'course test',
    created: '2021-10-05T21:17:00.203605',
    user_creator: {
      name: 'Admin',
    },
    status: 'FINISHED',
  } as Course;
}
