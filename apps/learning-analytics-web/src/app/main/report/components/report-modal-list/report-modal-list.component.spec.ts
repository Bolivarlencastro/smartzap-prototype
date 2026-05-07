import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { ReportModalListComponent } from './report-modal-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReportModalListComponent', () => {
  let component: ReportModalListComponent;
  let fixture: ComponentFixture<ReportModalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReportModalListComponent, getTranslocoTestingModule()],
      providers: [provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(ReportModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toogle all rows', () => {
    fixture.componentRef.setInput('items', [
      { id: '1', label: 'Item 1' },
      { id: '2', label: 'Item 2' },
    ]);
    fixture.detectChanges();

    const spy = jest.spyOn(component.selection, 'select');
    component.toggleAllRows();
    expect(spy).toHaveBeenCalledWith(...component.dataSource.data);
  });

  it('should clear selection', () => {
    fixture.componentRef.setInput('items', [
      { id: '1', label: 'Item 1' },
      { id: '2', label: 'Item 2' },
    ]);
    fixture.detectChanges();

    component.toggleAllRows();
    const spy = jest.spyOn(component.selection, 'clear');
    component.toggleAllRows();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit the search event and clear the current selection', () => {
    const emitSpy = jest.spyOn(component.searchChanged, 'emit');
    const clearSpy = jest.spyOn(component.selection, 'clear');

    component.onSearch('test');

    expect(emitSpy).toHaveBeenCalledWith('test');
    expect(clearSpy).toHaveBeenCalled();
  });
});
