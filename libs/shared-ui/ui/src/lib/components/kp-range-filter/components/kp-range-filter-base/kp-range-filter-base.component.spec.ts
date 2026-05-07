import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { RangeFilterType } from '../../models';
import { KpRangeFilterBaseComponent } from './kp-range-filter-base.component';

describe('KpRangeFilterBaseComponent', () => {
  let component: KpRangeFilterBaseComponent;
  let fixture: ComponentFixture<KpRangeFilterBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpRangeFilterBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpRangeFilterBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpRangeFilterBaseComponent);
    component = fixture.componentInstance;
    component.parentFormGroup = new FormGroup({
      gteValue: new FormControl(),
      lteValue: new FormControl(),
    });
    component.gteFcName = 'gteValue';
    component.lteFcName = 'lteValue';
    component.label = 'Performance';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form on initialize', () => {
    fixture.componentRef.setInput(
      'parentFormGroup',
      new FormGroup({
        gteValue: new FormControl('10'),
        lteValue: new FormControl('50'),
      }),
    );

    component.initialize();

    expect(component.gteFC.value).toBe('10');
    expect(component.lteFC.value).toBe('50');
  });

  it('should handle menu opened', () => {
    fixture.componentRef.setInput(
      'parentFormGroup',
      new FormGroup({
        gteValue: new FormControl('22'),
        lteValue: new FormControl('64'),
      }),
    );

    component.menuOpened();

    expect(component.gteFC.value).toBe('22');
    expect(component.lteFC.value).toBe('64');
    expect(component.selectedOption()).toBe(RangeFilterType.BETWEEN);
    expect(component.gteFC.hasValidator(Validators.required)).toBe(true);
    expect(component.lteFC.hasValidator(Validators.required)).toBe(true);
  });

  it('should change selection and configure validators', () => {
    const event = { value: RangeFilterType.LESS_THAN } as MatSelectChange;

    component.selectionChanged(event);

    expect(component.selectedOption()).toBe(RangeFilterType.LESS_THAN);
    expect(component.gteFC.value).toBe(null);
    expect(component.lteFC.value).toBe(null);
    expect(component.gteFC.hasValidator(Validators.required)).toBe(false);
    expect(component.lteFC.hasValidator(Validators.required)).toBe(true);
  });

  describe('applyFilter', () => {
    it('should apply filter and emit setFilter event when values changed', () => {
      const emitSpy = jest.spyOn(component.setFilter, 'emit');
      fixture.componentRef.setInput(
        'parentFormGroup',
        new FormGroup({
          gteValue: new FormControl('1'),
          lteValue: new FormControl('2'),
        }),
      );
      component.gteFC.setValue('9');
      component.lteFC.setValue('18');

      component.apply();

      expect(emitSpy).toHaveBeenCalled();
      expect(component.parentFormGroup.value).toEqual({ gteValue: '9', lteValue: '18' });
    });

    it('should not apply filter when values not changed', () => {
      const emitSpy = jest.spyOn(component.setFilter, 'emit');
      fixture.componentRef.setInput(
        'parentFormGroup',
        new FormGroup({
          gteValue: new FormControl('1'),
          lteValue: new FormControl('2'),
        }),
      );
      component.menuOpened();
      component.apply();

      expect(emitSpy).not.toHaveBeenCalled();
      expect(component.parentFormGroup.value).toEqual({ gteValue: '1', lteValue: '2' });
    });
  });

  it('should clean filter', () => {
    const emitSpy = jest.spyOn(component.setFilter, 'emit');
    component.gteFC.setValue('77');
    component.lteFC.setValue('100');

    component.reset();

    expect(component.gteFC.value).toBe(null);
    expect(component.lteFC.value).toBe(null);
    expect(component.parentFormGroup.value).toEqual({ gteValue: null, lteValue: null });
    expect(emitSpy).toHaveBeenCalled();
  });
});
