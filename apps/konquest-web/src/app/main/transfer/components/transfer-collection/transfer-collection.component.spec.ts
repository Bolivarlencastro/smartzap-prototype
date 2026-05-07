import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { TransferCollectionComponent } from './transfer-collection.component';

describe('TransferCollectionComponent', () => {
  let component: TransferCollectionComponent;
  let fixture: ComponentFixture<TransferCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferCollectionComponent, getTranslocoTestingModule()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('handleDelete', () => {
    it('should emit deleteTransfer', () => {
      const transfer = { id: '1' } as any;
      jest.spyOn(component.deleteTransfer, 'emit');

      component.handleDelete(transfer);

      expect(component.deleteTransfer.emit).toHaveBeenCalledWith(transfer);
    });
  });

  describe('handleSort', () => {
    it('should emit sort', () => {
      const sort = { active: 'name', direction: 'asc' } as Sort;
      jest.spyOn(component.sort, 'emit');

      component.handleSort(sort);

      expect(component.sort.emit).toHaveBeenCalledWith(sort);
    });
  });
});
