import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpSnackbarTemplateComponent } from './kp-snackbar-template.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

describe('KpSnackbarTemplateComponent', () => {
  let component: KpSnackbarTemplateComponent;
  let fixture: ComponentFixture<KpSnackbarTemplateComponent>;
  let mockSnackBarRef: jest.Mocked<MatSnackBarRef<unknown>>;

  beforeEach(async () => {
    mockSnackBarRef = { dismissWithAction: jest.fn() } as unknown as jest.Mocked<MatSnackBarRef<unknown>>;

    await TestBed.configureTestingModule({
      imports: [KpSnackbarTemplateComponent],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: '' },
        {
          provide: MatSnackBarRef,
          useValue: mockSnackBarRef,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KpSnackbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dismiss the snackbar on action click', () => {
    component.dismiss();

    expect(mockSnackBarRef.dismissWithAction).toHaveBeenCalled();
  });
});
