import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Course } from '@app/main/courses/model';
import { CourseReports } from '@app/shared/model';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { CourseListComponent } from './course-list.component';

const ownerCourse: Course = {
  id: 'course-1',
  description: 'Descricao do curso',
  category_id: '1',
  lang: 'pt-BR',
  name: 'Nome do curso',
  content_performance_weight: 1,
  quiz_performance_weight: 1,
  disable_send_certificate: false,
  is_active: true,
  status: 'FINISHED',
  user_creator: { id: 'user-1', name: 'Owner' },
};

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent, getTranslocoTestingModule()],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    component.courses = [ownerCourse];
    component.reportButtons = CourseReports;
    component.currentUserId = 'user-1';
    component.isAdmin = false;
    component.isLoading = false;
    fixture.detectChanges();
  });

  it('should emit sort event', () => {
    const spy = jest.spyOn(component.sort, 'emit');
    const sort: Sort = { active: 'name', direction: 'desc' };

    component.handleSort(sort);

    expect(spy).toHaveBeenCalledWith(sort);
  });

  it('should allow edition for the owner', () => {
    expect(component.canEdit(ownerCourse)).toBe(true);
    expect(component.canUseEdit(ownerCourse)).toBe(true);
  });

  it('should emit edit action with the selected course', () => {
    const spy = jest.spyOn(component.actionSelected, 'emit');

    component.emitAction('edit', ownerCourse);

    expect(spy).toHaveBeenCalledWith({ action: 'edit', course: ownerCourse, reportType: undefined });
  });

  it('should block transfer for creating courses', () => {
    const creatingCourse = { ...ownerCourse, status: 'CREATING' };

    expect(component.canTransfer(creatingCourse)).toBe(false);
  });

  it('should disable edit usage for processing courses without hiding the button rule', () => {
    const processingCourse = { ...ownerCourse, status: 'PROCESSING' };

    expect(component.canUseEdit(processingCourse)).toBe(false);
  });
});
