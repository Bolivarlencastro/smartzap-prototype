import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpFilterRangeBaseComponent } from './kp-filter-range-base.component';
import { KpFilterOption } from '../../models';

describe('KpFilterRangeContainerComponent', () => {
  let component: KpFilterRangeBaseComponent;
  let fixture: ComponentFixture<KpFilterRangeBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpFilterRangeBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpFilterRangeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('isRange', () => {
    it('should return true if the selected option rangeType is between', () => {
      component.selectedOption = { rangeType: 'between' } as KpFilterOption;

      expect(component.isRange).toBe(true);
    });
  });

  describe('singleControlName', () => {
    it('should return the filterKey when rangeType is not defined or equals', () => {
      component.selectedOption = { filterKey: 'age' } as KpFilterOption;
      expect(component.singleControlName).toBe('age');

      component.selectedOption = { filterKey: 'age', rangeType: 'equals' } as KpFilterOption;
      expect(component.singleControlName).toBe('age');
    });

    it('should return the fromKey when rangeType is less', () => {
      component.selectedOption = {
        filterKey: 'age',
        rangeType: 'more',
        rangeConfig: { fromKey: 'age_lte' },
      } as KpFilterOption;

      expect(component.singleControlName).toBe('age_lte');
    });

    it('should return the toKey when rangeType is more', () => {
      component.selectedOption = {
        filterKey: 'age',
        rangeType: 'less',
        rangeConfig: { toKey: 'age_gte' },
      } as KpFilterOption;

      expect(component.singleControlName).toBe('age_gte');
    });
  });
});
