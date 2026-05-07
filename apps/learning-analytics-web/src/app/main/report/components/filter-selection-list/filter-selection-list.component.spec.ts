import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FilterSelectionListComponent } from './filter-selection-list.component';
import { By } from '@angular/platform-browser';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const options = [
  {
    id: '1',
    label: 'Test 1',
  },
  {
    id: '2',
    label: 'Test 2',
  },
  {
    id: '3',
    label: 'Test 3',
  },
  {
    id: '4',
    label: 'Test 4',
  },
];
const updatedOptions = [...options, { id: '5', label: 'New option' }];

describe('FilterSelectionListComponent', () => {
  let component: FilterSelectionListComponent;
  let fixture: ComponentFixture<FilterSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSelectionListComponent, getTranslocoTestingModule()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSelectionListComponent);
    component = fixture.componentInstance;
    component.items = options;
    component.optionsTotal = options.length;
    component.multiple = true;
    fixture.detectChanges();
  });

  it('should select all options with toggleAll', () => {
    component.toggleAll();
    expect(component.selectedCount).toBe(options.length);
  });

  it('should return an empty array when toggleAll is active', () => {
    component.toggleAll();
    expect(component.selectedItems.selected).toEqual([]);
  });

  it('should select all options manually', () => {
    component.selectionChange('1');
    component.selectionChange('2');
    component.selectionChange('3');
    component.selectionChange('4');
    expect(component.selectedCount).toEqual(component.selectedItems.selected.length);
  });

  it('should return an string array when options are selected manually', () => {
    component.selectionChange('1');
    component.selectionChange('2');
    component.selectionChange('3');
    component.selectionChange('4');
    expect(component.selectedItems.selected).toEqual(options.map((option) => option.id));
  });

  it('should select the new options, when toggleAll is active', () => {
    component.toggleAll();
    component.items = options;
    component.optionsTotal = updatedOptions.length;
    fixture.detectChanges();
    expect(component.isSelected('5')).toBeTruthy();
  });

  it('should clear the selection when one option is changed and toggleAll is active', () => {
    component.toggleAll();
    component.selectionChange('1');
    expect(component.selectedCount).toBe(0);
  });

  it('should clear the selection when toggleAll is active and a search occurs', fakeAsync(() => {
    component.toggleAll();
    const searchInput = fixture.debugElement.query(By.css('input'));
    const keyUp = new KeyboardEvent('keyup', { key: 'Test' });
    searchInput.nativeElement.dispatchEvent(keyUp);
    fixture.detectChanges();
    tick(500);
    expect(component.selectedCount).toBe(0);
  }));

  it('should keep the selection when toggleAll is inactive, a option is selected, and a search occurs', fakeAsync(() => {
    component.selectionChange('1');
    const searchInput = fixture.debugElement.query(By.css('input'));
    const keyUp = new KeyboardEvent('keyup', { key: 'Test 4' });
    searchInput.nativeElement.dispatchEvent(keyUp);
    fixture.detectChanges();
    tick(500);
    component.selectionChange('4');
    expect(component.selectedItems.selected).toEqual(['1', '4']);
  }));
});
