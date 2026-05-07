import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { ToolConfigDialogComponent } from './tool-config-dialog.component';

describe('ToolConfigDialogComponent', () => {
  let component: ToolConfigDialogComponent;
  let fixture: ComponentFixture<ToolConfigDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<ToolConfigDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<ToolConfigDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [ToolConfigDialogComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: '123',
            name: 'Test Tool',
            url: 'https://example.com',
            icon: 'code',
          },
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should patch form on init', () => {
    expect(component.editionMode()).toBe(true);
    expect(component.form.value).toEqual({
      name: 'Test Tool',
      url: 'https://example.com',
      icon: 'code',
    });
  });

  it('should pass the form data when closing the dialog', () => {
    const closeSpy = jest.spyOn(mockDialogRef, 'close');
    component.onSave();
    expect(closeSpy).toHaveBeenCalledWith({ id: '123', name: 'Test Tool', url: 'https://example.com', icon: 'code' });
  });
});
