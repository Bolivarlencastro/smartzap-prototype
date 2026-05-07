import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MissionAutocompleteItem } from './mission-autocomplete-item';
import { MissionAutocompleteComponent } from './mission-autocomplete.component';

describe('MissionAutocompleteComponent', () => {
  let component: MissionAutocompleteComponent;
  let fixture: ComponentFixture<MissionAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('autoCompleteOptionSelected', () => {
    it('should emit create new item when the provided with -1', () => {
      const emitSpy = jest.spyOn(component.createNewItem, 'emit');

      component.autoCompleteOptionSelected(-1);

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should call addItem when provided with an autocomplete option', () => {
      const emitSpy = jest.spyOn(component.addItem, 'emit');
      const mockItem: MissionAutocompleteItem = { id: 'test', name: 'test' };

      component.autoCompleteOptionSelected(mockItem);

      expect(emitSpy).toHaveBeenCalledWith(mockItem);
    });

    it('should clear the formControl value when adding an item', () => {
      const mockItem: MissionAutocompleteItem = { id: 'test', name: 'test' };
      const resetSpy = jest.spyOn(component.autocompleteFormControl, 'reset');
      component.autocompleteFormControl.setValue('test');

      component.autoCompleteOptionSelected(mockItem);

      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('onRemoveItem', () => {
    it('should emit removeItem', () => {
      const emitSpy = jest.spyOn(component.removeItem, 'emit');
      const mockItem: MissionAutocompleteItem = { id: 'test', name: 'test' };

      component.onRemoveItem(mockItem);

      expect(emitSpy).toHaveBeenCalledWith(mockItem);
    });
  });

  it('should emit filterItems when the autocompleteFormControl value changes', fakeAsync(() => {
    const filterSpy = jest.spyOn(component.filterItems, 'emit');
    const expectedFilter = 'test';

    component.autocompleteFormControl.setValue(expectedFilter);
    tick(201);

    expect(filterSpy).toHaveBeenCalledWith(expectedFilter);
  }));
});
