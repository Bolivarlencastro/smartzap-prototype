import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpUploadDialogComponent, KpUploadDialogItem } from './kp-upload-dialog.component';

describe('KpUploadDialogComponent', () => {
  let component: KpUploadDialogComponent;
  let fixture: ComponentFixture<KpUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpUploadDialogComponent, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onClickRemove', () => {
    it('should emit the remove event', () => {
      const mockItem: KpUploadDialogItem = { id: 'mock_id', name: 'mock_name' };
      const removeSpy = jest.spyOn(component.remove, 'emit');

      component.onClickRemove(mockItem);

      expect(removeSpy).toHaveBeenCalledWith(mockItem);
    });
  });
});
