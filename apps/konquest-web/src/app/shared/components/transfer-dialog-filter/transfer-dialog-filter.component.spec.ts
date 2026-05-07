import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TransferDialogFilterRecipient } from './transfer-dialog-filter-recipient';

import { TransferDialogFilterComponent } from './transfer-dialog-filter.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('TransferDialogFilterComponent', () => {
  let component: TransferDialogFilterComponent;
  let fixture: ComponentFixture<TransferDialogFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferDialogFilterComponent, getTranslocoTestingModule()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDialogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit filterChange', fakeAsync(() => {
    const filterChangeSpy = jest.spyOn(component.filterChange, 'emit');
    const expectedFilter = 'filter_test';

    component.searchFormControl.setValue(expectedFilter);
    tick(260);

    expect(filterChangeSpy).toHaveBeenCalledWith(expectedFilter);
  }));

  it('should emit recipientSelected', () => {
    const mockRecipient: TransferDialogFilterRecipient = { id: '123', name: 'test', avatar: '' };
    const recipientSelectedSpy = jest.spyOn(component.recipientSelected, 'emit');

    component.autoCompleteOptionSelected(mockRecipient);

    expect(recipientSelectedSpy).toHaveBeenCalledWith(mockRecipient);
  });

  describe('removeRecipient', () => {
    it('should emit clearRecipient', () => {
      const clearRecipientSpy = jest.spyOn(component.clearRecipient, 'emit');

      component.removeRecipient();

      expect(clearRecipientSpy).toHaveBeenCalled();
    });

    it('should reset the search formControl', () => {
      component.searchFormControl.setValue('test');

      component.removeRecipient();

      expect(component.searchFormControl.value).toBe(null);
    });
  });
});
