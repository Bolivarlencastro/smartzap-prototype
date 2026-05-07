import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CourseFormContentComponent } from './course-form-content.component';
import { courseMock } from 'app/shared/test/courses';
import { ExamStateService } from '../../services';
import { Content, Course, EVALUATIVE_TYPE_ID, Lesson, SURVEY_TYPE_ID } from 'app/main/courses/model';
import {
  EvaluateQuizQuestionDialogComponent,
  SurveyQuizQuestionDialogComponent,
} from 'app/main/courses/modules/form/components';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { provideRouter } from '@angular/router';
import { KpContentFormDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

describe('CourseFormContentComponent', () => {
  let component: CourseFormContentComponent;
  let fixture: ComponentFixture<CourseFormContentComponent>;
  let matDialog: MatDialog;
  let examStateService: ExamStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFormContentComponent, getTranslocoTestingModule()],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({
              beforeClosed: jest.fn().mockReturnValue(of({})),
              afterClosed: jest.fn().mockReturnValue(of(null)),
            }),
          },
        },
        { provide: ExamStateService, useValue: { createQuestion: jest.fn().mockReturnValue(of({})) } },
      ],
    }).compileComponents();
    matDialog = TestBed.inject(MatDialog);
    examStateService = TestBed.inject(ExamStateService);

    fixture = TestBed.createComponent(CourseFormContentComponent);
    component = fixture.componentInstance;
    component.course = courseMock as Course;
    component.lessons = [];
    fixture.detectChanges();
  });

  describe('onCreateContent', () => {
    const lesson: Lesson = {
      id: 'lesson-1',
      name: 'Lesson 1',
      description: '',
      order: 1,
      course_id: 'course-1',
      contents: [],
    };

    it('should open KpContentFormDialogComponent with correct data', () => {
      component.messagesContentEmbed = true;
      component.onCreateContent(lesson);
      expect(matDialog.open).toHaveBeenCalledWith(KpContentFormDialogComponent, {
        data: { app: 'smartzap', messagesContentEmbed: true },
        autoFocus: 'dialog',
      });
    });

    it('should emit createContent with lesson_id, contentFormData and messagesContentEmbed when dialog closes with a value', (done) => {
      const contentFormData = { type: 'LINK', name: 'test', value: 'url' };
      component.messagesContentEmbed = true;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(contentFormData)),
      } as any);

      component.createContent.subscribe((event) => {
        expect(event).toEqual({ lesson_id: lesson.id, contentFormData, messagesContentEmbed: true });
        done();
      });

      component.onCreateContent(lesson);
    });

    it('should not emit createContent when dialog is dismissed', () => {
      const emitSpy = jest.spyOn(component.createContent, 'emit');
      component.messagesContentEmbed = false;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(null)),
      } as any);

      component.onCreateContent(lesson);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit createContent when lesson has no id', () => {
      const lessonWithoutId: Lesson = { ...lesson, id: undefined };
      const emitSpy = jest.spyOn(component.createContent, 'emit');
      component.messagesContentEmbed = false;
      jest.spyOn(matDialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ type: 'LINK', name: 'test' })),
      } as any);

      component.onCreateContent(lessonWithoutId);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('onCreateQuestion', () => {
    it('should open EvaluateQuizQuestionDialogComponent when type_id is EVALUATIVE_TYPE_ID', (done) => {
      const content: Content = {
        description: '',
        dispatch_in: 1,
        dispatch_period: '',
        learn_content: '',
        lesson_id: '',
        name: '',
        order: 1,
        type_id: EVALUATIVE_TYPE_ID,
      };

      const expectedOptions = {
        panelClass: 'question-form-dialog',
        data: { action: 'new' },
        width: '60vw',
        autoFocus: 'dialog',
      };

      component.onCreateQuestion(content);

      expect(matDialog.open).toHaveBeenCalledWith(EvaluateQuizQuestionDialogComponent, expectedOptions);
      expect(examStateService.createQuestion).toHaveBeenCalled();
      done();
    });

    it('should open SurveyQuizQuestionDialogComponent when type_id is not EVALUATIVE_TYPE_ID', (done) => {
      const content: Content = {
        description: '',
        dispatch_in: 1,
        dispatch_period: '',
        learn_content: '',
        lesson_id: '',
        name: '',
        order: 1,
        type_id: SURVEY_TYPE_ID,
      };

      const expectedOptions = {
        panelClass: 'question-form-dialog',
        data: { action: 'new' },
        width: '60vw',
        autoFocus: 'dialog',
      };

      component.onCreateQuestion(content);

      expect(matDialog.open).toHaveBeenCalledWith(SurveyQuizQuestionDialogComponent, expectedOptions);
      expect(examStateService.createQuestion).toHaveBeenCalled();
      done();
    });
  });
});
