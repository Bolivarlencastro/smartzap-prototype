import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatchEnrollmentsListComponent } from './batch-enrollments-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('BatchEnrollmentsListComponent', () => {
  let component: BatchEnrollmentsListComponent;
  let fixture: ComponentFixture<BatchEnrollmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchEnrollmentsListComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchEnrollmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onFilter', () => {
    it('should emit search', () => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');

      component.onFilter('search');

      expect(emitSpy).toHaveBeenCalledWith('search');
    });
  });

  describe('onToggleSelection', () => {
    it('should emit userSelectionToggle', () => {
      const emitSpy = jest.spyOn(component.userSelectionToggle, 'emit');

      component.onToggleSelection('mock_id');

      expect(emitSpy).toHaveBeenCalledWith('mock_id');
    });
  });

  describe('onToggleSelectAll', () => {
    it('should emit selectAllToggle', () => {
      const emitSpy = jest.spyOn(component.selectAllToggle, 'emit');

      component.onToggleSelectAll(true);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('onScroll', () => {
    it('should emit loadMore', () => {
      const emitSpy = jest.spyOn(component.loadMore, 'emit');

      component.onScroll();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('fileChange', () => {
    it('should dispatch fileSelected', () => {
      const emitSpy = jest.spyOn(component.fileSelected, 'emit');
      const mockFile = new File([''], 'test');

      component.fileChange({ files: [mockFile] } as any);

      expect(emitSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should not dispatch fileSelected when no file is provided', () => {
      const emitSpy = jest.spyOn(component.fileSelected, 'emit');

      component.fileChange({ files: [] } as any);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
