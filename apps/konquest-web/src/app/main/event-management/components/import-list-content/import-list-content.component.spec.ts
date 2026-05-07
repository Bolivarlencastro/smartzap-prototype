import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionInformationDate } from '@app/main/mission/mission.model';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { ImportListContentComponent } from './import-list-content.component';

describe('ImportListContentComponent', () => {
  let component: ImportListContentComponent;
  let fixture: ComponentFixture<ImportListContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportListContentComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('File Selected Event', () => {
    it('should emit fileSelected event', () => {
      component.selectedDate.set({ id: '123' } as MissionInformationDate);
      const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });
      const emitSpy = jest.spyOn(component.fileSelected, 'emit');

      const mockInput = {
        files: [mockFile],
        value: 'test.csv',
      } as unknown as HTMLInputElement;

      component.fileInput = { nativeElement: mockInput } as ElementRef<HTMLInputElement>;

      component.onFileChange();

      expect(emitSpy).toHaveBeenCalledWith({
        selectedDateId: '123',
        file: mockFile,
      });
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
});
