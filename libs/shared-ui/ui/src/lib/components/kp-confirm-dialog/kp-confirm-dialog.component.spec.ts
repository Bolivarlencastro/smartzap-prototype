import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpConfirmDialogComponent } from './kp-confirm-dialog.component';

describe('KpConfirmDialogComponent', () => {
  let component: KpConfirmDialogComponent;
  let fixture: ComponentFixture<KpConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpConfirmDialogComponent, getTranslocoTestingModule()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should disable the submit button if description is shorter than minLenght', () => {
    component.minLenght = 10;
    component.description = 'Test';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('#button-confirm-ok');
    expect(button.disabled).toBe(true);
  });
});
