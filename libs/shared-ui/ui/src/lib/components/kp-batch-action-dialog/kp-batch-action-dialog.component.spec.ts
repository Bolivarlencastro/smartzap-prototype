import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NGX_MASK_CONFIG, NgxMaskDirective } from 'ngx-mask';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpBatchActionDialogComponent } from './kp-batch-action-dialog.component';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/locale';
import { KEEPS_DATE_FORMATS } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('KpBatchActionDialogComponent', () => {
  let component: KpBatchActionDialogComponent;
  let fixture: ComponentFixture<KpBatchActionDialogComponent>;
  let matDialogRef: MatDialogRef<KpBatchActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpBatchActionDialogComponent, getTranslocoTestingModule(), NgxMaskDirective, MatNativeDateModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { action: 'APPROVE_ENROLLMENT', total: 5 } },
        { provide: NGX_MASK_CONFIG, useValue: {} },
        {
          provide: DateAdapter,
          useClass: DateFnsAdapter,
        },
        { provide: MAT_DATE_LOCALE, useValue: enUS },
        { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<KpBatchActionDialogComponent>>;
    fixture = TestBed.createComponent(KpBatchActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.initialForm).toBeDefined();
    expect(component.submitForm).toBeDefined();
    expect(component.initialForm.value).toBeNull();
    expect(component.submitForm.value).toBe('');
  });

  it('should validate initialForm with data action', () => {
    component.config.id = 'APPROVE_ENROLLMENT';

    component.initialForm.setValue(null);
    fixture.detectChanges();
    expect(component.initialForm.valid).toBeFalsy();
    expect(component.initialForm.errors).toEqual({ required: true });

    component.initialForm.setValue(50);
    fixture.detectChanges();
    expect(component.initialForm.valid).toBeTruthy();
  });

  it('should go to next step', () => {
    expect(component.step).toBe('initial');

    component.nextStep();
    expect(component.step).toBe('submit');
  });

  it('should close dialog with data on submit', () => {
    component.initialForm.setValue(50);
    component.submit();

    expect(matDialogRef.close).toHaveBeenCalledWith({ performance: 0.5 });
  });

  it('should validate submitForm with reference value', () => {
    component.config.id = 'APPROVE_ENROLLMENT';
    component.language = 'en';

    component.submitForm.setValue('reject');
    expect(component.submitForm.valid).toBeFalsy();
    expect(component.submitForm.errors).toEqual({ noMatch: true });

    component.submitForm.setValue('complete');
    expect(component.submitForm.valid).toBeTruthy();
  });
});
