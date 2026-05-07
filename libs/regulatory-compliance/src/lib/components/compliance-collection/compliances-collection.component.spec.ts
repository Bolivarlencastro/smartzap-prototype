import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceListItemToggleEvent, CompliancesCollectionComponent } from './compliances-collection.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ComplianceListItem } from '../../models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('ComplianceListComponent', () => {
  let component: CompliancesCollectionComponent;
  let fixture: ComponentFixture<CompliancesCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompliancesCollectionComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CompliancesCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('toggleAllRows', () => {
    it('should emit the toggleSelectAll event', () => {
      const emitSpy = jest.spyOn(component.toggleSelectAll, 'emit');

      component.toggleAllRows({ checked: true } as MatCheckboxChange);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('onItemSelectionChange', () => {
    it('should emit the toggleItemSelection event', () => {
      const emitSpy = jest.spyOn(component.toggleItemSelection, 'emit');
      const expectedEvent: ComplianceListItemToggleEvent = { id: 'mock_id', selected: true };

      component.onItemSelectionChange(true, { id: 'mock_id' } as ComplianceListItem);

      expect(emitSpy).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('onBatchDelete', () => {
    it('should emit the batchDelete event', () => {
      const emitSpy = jest.spyOn(component.batchDelete, 'emit');

      component.onBatchDelete();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('saveItemChanges', () => {
    it('should emit editItem', () => {
      const mockCompliance: ComplianceListItem = { id: 'mock_id', name: 'original_name' } as ComplianceListItem;
      const expectedCompliance = { id: 'mock_id', name: 'new_name' } as ComplianceListItem;
      const emitSpy = jest.spyOn(component.editItem, 'emit');

      component.saveItemChanges('new_name', mockCompliance);

      expect(emitSpy).toHaveBeenCalledWith(expectedCompliance);
    });
  });

  describe('onDeleteItem', () => {
    it('should emit the deleteItem event', () => {
      const emitSpy = jest.spyOn(component.deleteItem, 'emit');

      component.onDeleteItem({ id: 'mock_id' } as ComplianceListItem);

      expect(emitSpy).toHaveBeenCalledWith('mock_id');
    });
  });

  describe('onScroll', () => {
    it('should emit the loadMoreItems event', () => {
      const emitSpy = jest.spyOn(component.loadMoreItems, 'emit');

      component.onScroll();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
