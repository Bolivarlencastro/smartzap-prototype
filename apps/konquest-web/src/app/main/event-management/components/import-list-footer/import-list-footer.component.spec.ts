import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { ImportListFooterComponent } from './import-list-footer.component';

describe('ImportListFooterComponent', () => {
  let component: ImportListFooterComponent;
  let fixture: ComponentFixture<ImportListFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportListFooterComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportListFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('File Selected Event', () => {
    it('should emit fileSelected event', () => {
      const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });
      const emitSpy = jest.spyOn(component.fileSelected, 'emit');

      const mockInput = {
        files: [mockFile],
        value: 'test.csv',
      } as unknown as HTMLInputElement;

      component.fileInput = { nativeElement: mockInput } as ElementRef<HTMLInputElement>;

      component.onFileChange();

      expect(emitSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should not emit fileSelected event when file is not exist', () => {
      const emitSpy = jest.spyOn(component.fileSelected, 'emit');

      const mockInput = {
        files: [],
      } as unknown as HTMLInputElement;

      component.fileInput = { nativeElement: mockInput } as ElementRef<HTMLInputElement>;

      component.onFileChange();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  it('should emit continueImport event', () => {
    const emitSpy = jest.spyOn(component.continueImport, 'emit');

    component.onContinue();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit confirmImport event', () => {
    const emitSpy = jest.spyOn(component.confirmImport, 'emit');

    component.onConfirm();

    expect(emitSpy).toHaveBeenCalled();
  });
});
