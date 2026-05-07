import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from 'app/main/courses/model';
import { CourseDetailActionsComponent } from './course-detail-actions.component';
import { getTranslocoTestingModule } from '@app/shared/test/transloco-testing.module';

describe('CourseDetailActionsComponent', () => {
  let component: CourseDetailActionsComponent;
  let fixture: ComponentFixture<CourseDetailActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailActionsComponent, getTranslocoTestingModule()],
    }).compileComponents();
    fixture = TestBed.createComponent(CourseDetailActionsComponent);
    component = fixture.componentInstance;
    component.course = {} as Course;
    fixture.detectChanges();
  });

  describe('handleRemove', () => {
    it('should emit remove', () => {
      jest.spyOn(component.remove, 'emit');

      component.handleRemove();

      expect(component.remove.emit).toHaveBeenCalled();
    });
  });

  describe('handleTransfer', () => {
    it('should emit transfer', () => {
      jest.spyOn(component.transfer, 'emit');

      component.handleTransfer();

      expect(component.transfer.emit).toHaveBeenCalled();
    });
  });

  describe('handleEdit', () => {
    it('should emit edit', () => {
      jest.spyOn(component.edit, 'emit');

      component.handleEdit();

      expect(component.edit.emit).toHaveBeenCalled();
    });
  });

  describe('handlePublish', () => {
    it('should emit publish', () => {
      jest.spyOn(component.publish, 'emit');

      component.handlePublish();

      expect(component.publish.emit).toHaveBeenCalled();
    });
  });

  describe('handleGenerateReport', () => {
    it('should emit generateReport', () => {
      jest.spyOn(component.generateReport, 'emit');
      const reportType = 'reportType';

      component.handleGenerateReport(reportType);

      expect(component.generateReport.emit).toHaveBeenCalled();
    });
  });
});
