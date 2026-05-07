import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../utils';
import { ManagementFilterComponent } from './management-filter.component';

describe('ManagementFilterComponent', () => {
  let component: ManagementFilterComponent;
  let fixture: ComponentFixture<ManagementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementFilterComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit saveFilter event', () => {
    const emitSpy = jest.spyOn(component.saveFilter, 'emit');
    const value = {
      category: ['1', '2'],
      status: ['PROCESSING'],
      created_date_gte: new Date(),
      created_date_lte: new Date(),
    };
    component.filterForm.setValue(value);

    component.onFilter();

    expect(emitSpy).toHaveBeenCalledWith(value);
  });

  it('should emit search event', () => {
    const emitSpy = jest.spyOn(component.searchChange, 'emit');
    const term = 'test';

    component.onSearch(term);

    expect(emitSpy).toHaveBeenCalledWith(term);
  });
});
