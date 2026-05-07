import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ContentStep } from '@app/main/learning-trail/model/learning-trail';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { of } from 'rxjs';
import { LearningTrailStepContentComponent } from './learning-trail-step-content.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('LearningTrailStepContentComponent', () => {
  let component: LearningTrailStepContentComponent;
  let fixture: ComponentFixture<LearningTrailStepContentComponent>;
  let matDialog: MatDialog;
  let matDialogRef: MatDialogRef<KpConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        NoopAnimationsModule,
        MatInputModule,
        MatIconTestingModule,
        LearningTrailStepContentComponent,
        MatIconTestingModule,
      ],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn(() => matDialogRef) } },
        {
          provide: MatDialogRef,
          useValue: {
            afterClosed: jest.fn(() => of(true)),
            componentInstance: { confirmTitle: '', confirmMessage: '' },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningTrailStepContentComponent);
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit loadContents when name changes', fakeAsync(() => {
    component.ngOnInit();
    const spy = jest.spyOn(component.loadContents, 'emit');
    component.formGroup.patchValue({ name: 'TEST' });
    fixture.detectChanges();
    tick(410);

    expect(spy).toHaveBeenCalledWith('test');
  }));

  it('should map and sort learningTrail steps on changes', () => {
    const mockLearningTrail = {
      steps: [
        { id: '1', order: 2 },
        { id: '2', order: 1 },
      ],
    };
    fixture.componentRef.setInput('learningTrail', mockLearningTrail);
    fixture.detectChanges();

    expect(component.contents).toEqual([
      { learningTrailContentId: '2', order: 1 },
      { learningTrailContentId: '1', order: 2 },
    ]);
  });

  it('should emit createContent when onCreateContent is called', () => {
    const spy = jest.spyOn(component.createContent, 'emit');
    component.contents = [{}, {}];
    component.formGroup.patchValue({ name: { name: 'content-name' } });

    component.onCreateContent();
    expect(spy).toHaveBeenCalledWith({ name: 'content-name', order: 3 });
    expect(component.formGroup.get('name').value).toBe(null);
    expect(component.stepSelected).toBe(2);
  });

  it('should emit removeContent when onRemoveContent is called and confirmed', () => {
    const emitSpy = jest.spyOn(component.removeContent, 'emit');
    const afterClosedSpy = jest.spyOn(matDialogRef, 'afterClosed');
    const openSpy = jest.spyOn(matDialog, 'open');
    const mockContentStep: ContentStep = { learningTrailContentId: '1' };

    component.onRemoveContent(mockContentStep);
    fixture.detectChanges();

    expect(matDialogRef.componentInstance.confirmMessage).toBe('LEARNING_TRAIL.STEP.DELETE_CONTENT_MESSAGE');
    expect(matDialogRef.componentInstance.confirmTitle).toBe('LEARNING_TRAIL.STEP.DELETE_CONTENT_TITLE');
    expect(openSpy).toHaveBeenCalled();
    expect(afterClosedSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('1');
  });

  it('should emit dropContentEvent when drop is called', () => {
    const spy = jest.spyOn(component.dropContentEvent, 'emit');
    const event = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<any[]>;
    component.contents = [
      { learningTrailContentId: '1', order: 1 },
      { learningTrailContentId: '2', order: 2 },
    ];

    component.drop(event);
    expect(spy).toHaveBeenCalledWith({
      contents: component.contents,
      id: '2',
      order: 1,
    });
  });

  it('should emit previous when onPrevious is called', () => {
    const spy = jest.spyOn(component.previous, 'emit');
    component.onPrevious();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit next when onNext is called', () => {
    const spy = jest.spyOn(component.next, 'emit');
    component.onNext();
    expect(spy).toHaveBeenCalled();
  });

  it('should set stepSelected when setStep is called', () => {
    component.setStep(2);
    expect(component.stepSelected).toBe(2);
  });
});
