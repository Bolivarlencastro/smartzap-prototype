import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { QuestionBankComponent } from './question-bank.component';
import { QuestionBankActions } from '../../store/question-bank/question-bank.actions';
import { questionBankFeature } from '../../store/question-bank/question-bank.feature';
import { QuestionBankOutput } from '../../models/quiz';

const mockQuestion: QuestionBankOutput = {
  id: 'q1',
  question: 'O que é Angular?',
  options: [
    { id: 'o1', option: 'Um framework', correct_answer: true },
    { id: 'o2', option: 'Uma biblioteca', correct_answer: false },
  ],
  tags: [],
  created_date: '2024-01-01',
};

const mockQuestion2: QuestionBankOutput = {
  id: 'q2',
  question: 'O que é NgRx?',
  options: [
    { id: 'o3', option: 'Gerenciamento de estado', correct_answer: true },
    { id: 'o4', option: 'Um servidor HTTP', correct_answer: false },
  ],
  tags: [],
  created_date: '2024-01-02',
};

describe('QuestionBankComponent', () => {
  let component: QuestionBankComponent;
  let fixture: ComponentFixture<QuestionBankComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let dialogRef: jest.Mocked<MatDialogRef<QuestionBankComponent>>;
  let dialog: jest.Mocked<MatDialog>;
  let userProfileService: jest.Mocked<UserProfileService>;

  function buildConfirmDialogRef(confirmed: boolean) {
    return {
      componentInstance: {} as KpConfirmDialogComponent,
      afterClosed: jest.fn().mockReturnValue(of(confirmed)),
    };
  }

  beforeEach(async () => {
    dialogRef = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<QuestionBankComponent>>;
    dialog = { open: jest.fn().mockReturnValue(buildConfirmDialogRef(false)) } as unknown as jest.Mocked<MatDialog>;
    userProfileService = {
      isContentCreator: jest.fn().mockReturnValue(false),
    } as unknown as jest.Mocked<UserProfileService>;

    await TestBed.configureTestingModule({
      imports: [QuestionBankComponent, getTranslocoTestingModule()],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatDialog, useValue: dialog },
        { provide: UserProfileService, useValue: userProfileService },
        provideMockStore(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(questionBankFeature.selectQuestions, []);
    store.overrideSelector(questionBankFeature.selectLoading, false);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(QuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should dispatch loadQuestionBank with no filters on init', () => {
      expect(dispatchSpy).toHaveBeenCalledWith(QuestionBankActions.loadQuestionBank({}));
    });
  });

  describe('search', () => {
    it('should dispatch loadQuestionBank with title filter after debounce', fakeAsync(() => {
      component['searchControl'].setValue('Angular');
      tick(300);

      expect(dispatchSpy).toHaveBeenCalledWith(QuestionBankActions.loadQuestionBank({ filters: { title: 'Angular' } }));
    }));

    it('should dispatch loadQuestionBank with no filter when search is cleared', fakeAsync(() => {
      component['searchControl'].setValue('Angular');
      tick(300);
      dispatchSpy.mockClear();

      component['searchControl'].setValue('');
      tick(300);

      expect(dispatchSpy).toHaveBeenCalledWith(QuestionBankActions.loadQuestionBank({ filters: undefined }));
    }));

    it('should not dispatch before debounce time elapses', fakeAsync(() => {
      dispatchSpy.mockClear();
      component['searchControl'].setValue('Ang');
      tick(100);

      expect(dispatchSpy).not.toHaveBeenCalled();
      tick(200);
    }));
  });

  describe('correctAnswersText()', () => {
    it('should return the text of correct options joined by comma', () => {
      const question: QuestionBankOutput = {
        id: 'q1',
        question: 'Questão?',
        options: [
          { id: 'o1', option: 'Certa', correct_answer: true },
          { id: 'o2', option: 'Errada', correct_answer: false },
          { id: 'o3', option: 'Também certa', correct_answer: true },
        ],
        tags: [],
        created_date: '2024-01-01',
      };

      expect(component['correctAnswersText'](question)).toBe('Certa, Também certa');
    });

    it('should return an empty string when there are no correct answers', () => {
      const question: QuestionBankOutput = {
        ...mockQuestion,
        options: [{ id: 'o1', option: 'Errada', correct_answer: false }],
      };

      expect(component['correctAnswersText'](question)).toBe('');
    });
  });

  describe('isSelected()', () => {
    it('should return false when no question is selected', () => {
      expect(component['isSelected']('q1')).toBe(false);
    });

    it('should return true after toggleSelection adds the id', () => {
      component['toggleSelection']('q1');

      expect(component['isSelected']('q1')).toBe(true);
    });
  });

  describe('toggleSelection()', () => {
    it('should add the id to the selection set', () => {
      component['toggleSelection']('q1');

      expect(component['selectedCount']()).toBe(1);
    });

    it('should remove the id when toggled again', () => {
      component['toggleSelection']('q1');
      component['toggleSelection']('q1');

      expect(component['selectedCount']()).toBe(0);
    });

    it('should handle multiple independent selections', () => {
      component['toggleSelection']('q1');
      component['toggleSelection']('q2');

      expect(component['selectedCount']()).toBe(2);
      expect(component['isSelected']('q1')).toBe(true);
      expect(component['isSelected']('q2')).toBe(true);
    });
  });

  describe('selectedCount', () => {
    it('should start at 0', () => {
      expect(component['selectedCount']()).toBe(0);
    });

    it('should reflect the number of selected questions', () => {
      component['toggleSelection']('q1');
      component['toggleSelection']('q2');

      expect(component['selectedCount']()).toBe(2);
    });
  });

  describe('onCancel()', () => {
    it('should close the dialog without passing data', () => {
      component['onCancel']();

      expect(dialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('onAddQuestions()', () => {
    beforeEach(() => {
      store.overrideSelector(questionBankFeature.selectQuestions, [mockQuestion, mockQuestion2]);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should close the dialog with the selected questions', () => {
      component['toggleSelection'](mockQuestion.id);

      component['onAddQuestions']();

      expect(dialogRef.close).toHaveBeenCalledWith([mockQuestion]);
    });

    it('should close the dialog with all selected questions', () => {
      component['toggleSelection'](mockQuestion.id);
      component['toggleSelection'](mockQuestion2.id);

      component['onAddQuestions']();

      expect(dialogRef.close).toHaveBeenCalledWith([mockQuestion, mockQuestion2]);
    });

    it('should close with an empty array when nothing is selected', () => {
      component['onAddQuestions']();

      expect(dialogRef.close).toHaveBeenCalledWith([]);
    });
  });

  describe('onDelete()', () => {
    it('should open the confirm dialog', () => {
      component['onDelete'](mockQuestion);

      expect(dialog.open).toHaveBeenCalledWith(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    });

    it('should dispatch deleteQuestionFromBank when confirmed', () => {
      dialog.open.mockReturnValue(buildConfirmDialogRef(true) as any);

      component['onDelete'](mockQuestion);

      expect(dispatchSpy).toHaveBeenCalledWith(QuestionBankActions.deleteQuestionFromBank({ id: mockQuestion.id }));
    });

    it('should not dispatch deleteQuestionFromBank when cancelled', () => {
      dialog.open.mockReturnValue(buildConfirmDialogRef(false) as any);
      dispatchSpy.mockClear();

      component['onDelete'](mockQuestion);

      expect(dispatchSpy).not.toHaveBeenCalledWith(QuestionBankActions.deleteQuestionFromBank({ id: mockQuestion.id }));
    });

    it('should remove the deleted question from the selection when confirmed', () => {
      dialog.open.mockReturnValue(buildConfirmDialogRef(true) as any);
      component['toggleSelection'](mockQuestion.id);

      component['onDelete'](mockQuestion);

      expect(component['isSelected'](mockQuestion.id)).toBe(false);
    });

    it('should keep the selection intact when cancelled', () => {
      dialog.open.mockReturnValue(buildConfirmDialogRef(false) as any);
      component['toggleSelection'](mockQuestion.id);

      component['onDelete'](mockQuestion);

      expect(component['isSelected'](mockQuestion.id)).toBe(true);
    });
  });
});
