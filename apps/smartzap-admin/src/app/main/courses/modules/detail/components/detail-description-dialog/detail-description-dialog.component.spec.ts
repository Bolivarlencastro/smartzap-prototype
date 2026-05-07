import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@app/shared/test/transloco-testing.module';
import { KpEditorComponent } from '@keeps-platform-frontend-workspace/ui/kp-editor';
import { DetailDescriptionDialogComponent } from './detail-description-dialog.component';

describe('DetailDescriptionDialogComponent', () => {
  let component: DetailDescriptionDialogComponent;
  let fixture: ComponentFixture<DetailDescriptionDialogComponent>;
  let dialogRefSpy: jest.Mocked<MatDialogRef<DetailDescriptionDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<DetailDescriptionDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        KpEditorComponent,
        getTranslocoTestingModule(),
        MatButtonModule,
        NoopAnimationsModule,
        DetailDescriptionDialogComponent,
      ],
      declarations: [],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: 'Test data' },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should close the dialog with editor data on onClick', () => {
    component.description.set('Editor data');
    component.onSave();
    expect(dialogRefSpy.close).toHaveBeenCalledWith('Editor data');
  });
});
