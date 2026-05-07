import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CourseFormContentComponent } from './course-form-content.component';
import { courseMock } from 'app/shared/test/courses';
import { ExamStateService } from '../../services';
import { Content, Course, EVALUATIVE_TYPE_ID, SURVEY_TYPE_ID } from 'app/main/courses/model';
import {
  EvaluateQuizQuestionDialogComponent,
  SurveyQuizQuestionDialogComponent,
} from 'app/main/courses/modules/form/components';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

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
              componentInstance: {},
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
    component.contents = [];
    fixture.detectChanges();
  });

  describe('onAddBlock', () => {
    it('should open file picker for file blocks', () => {
      const fileInput = { click: jest.fn(), accept: '' } as unknown as HTMLInputElement;
      const block = component.contentBlocks.find((item) => item.id === 'video')!;

      component.onAddBlock(block, fileInput);

      expect(component.pendingFileBlock).toEqual(block);
      expect(fileInput.click).toHaveBeenCalled();
    });

    it('should emit createContent for interaction blocks', () => {
      const block = component.contentBlocks.find((item) => item.id === 'evaluative-quiz')!;
      const emitSpy = jest.spyOn(component.createContent, 'emit');

      component.onAddBlock(block);

      expect(emitSpy).toHaveBeenCalledWith({
        contentFormData: {
          type: 'EVALUATIVE_QUIZ',
          name: 'Novo quiz avaliativo',
          value: '',
          description: block.emptyDescription,
        },
        messagesContentEmbed: false,
      });
    });
  });

  describe('onFileSelected', () => {
    it('should emit createContent with selected file', () => {
      const file = new File(['video'], 'aula.mp4', { type: 'video/mp4' });
      const emitSpy = jest.spyOn(component.createContent, 'emit');
      const block = component.contentBlocks.find((item) => item.id === 'video')!;
      component.pendingFileBlock = block;

      component.onFileSelected({
        target: {
          files: [file],
          value: 'aula.mp4',
        },
      } as unknown as Event);

      expect(emitSpy).toHaveBeenCalledWith({
        contentFormData: {
          type: 'FILE',
          name: 'aula',
          value: file,
          description: block.emptyDescription,
        },
        messagesContentEmbed: false,
      });
    });
  });

  describe('inline editing', () => {
    it('should emit editContent when saving a selected block', () => {
      const content: Content = {
        id: 'content-1',
        description: 'Descricao antiga',
        dispatch_in: 1,
        dispatch_period: 'MORNING',
        learn_content: 'learn-1',
        lesson_id: 'lesson-1',
        name: 'Titulo antigo',
        order: 1,
        type_id: 'ct-video',
        type: { id: 'ct-video', name: 'video', description: 'Video', image_url: '' },
      };

      component.contents = [content];
      component.onSelectContent(content);
      component.draftName = 'Titulo novo';
      component.draftDescription = 'Descricao nova';

      const emitSpy = jest.spyOn(component.editContent, 'emit');
      component.onSaveSelectedContent();

      expect(emitSpy).toHaveBeenCalledWith({
        id: 'content-1',
        data: { name: 'Titulo novo', description: 'Descricao nova' },
      });
    });
  });

  describe('onCreateQuestion', () => {
    it('should open EvaluateQuizQuestionDialogComponent when type_id is EVALUATIVE_TYPE_ID', () => {
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

      component.onCreateQuestion(content);

      expect(matDialog.open).toHaveBeenCalledWith(EvaluateQuizQuestionDialogComponent, {
        panelClass: 'question-form-dialog',
        data: { action: 'new' },
        width: '60vw',
        autoFocus: 'dialog',
      });
      expect(examStateService.createQuestion).toHaveBeenCalled();
    });

    it('should open SurveyQuizQuestionDialogComponent when type_id is SURVEY_TYPE_ID', () => {
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

      component.onCreateQuestion(content);

      expect(matDialog.open).toHaveBeenCalledWith(SurveyQuizQuestionDialogComponent, {
        panelClass: 'question-form-dialog',
        data: { action: 'new' },
        width: '60vw',
        autoFocus: 'dialog',
      });
      expect(examStateService.createQuestion).toHaveBeenCalled();
    });
  });
});
