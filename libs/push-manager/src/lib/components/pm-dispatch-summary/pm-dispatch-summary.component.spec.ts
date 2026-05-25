import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PmDispatchSummaryComponent } from './pm-dispatch-summary.component';

describe('PmDispatchSummaryComponent', () => {
  let component: PmDispatchSummaryComponent;
  let fixture: ComponentFixture<PmDispatchSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmDispatchSummaryComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PmDispatchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formattedCost', () => {
    it('should return empty string when estimatedCost is empty', () => {
      fixture.componentRef.setInput('estimatedCost', '');
      expect(component.formattedCost()).toBe('');
    });

    it('should format numeric string with pt-BR locale', () => {
      fixture.componentRef.setInput('estimatedCost', '145.5');
      expect(component.formattedCost()).toBe('R$ 145,50');
    });

    it('should return raw value when estimatedCost is not a valid number', () => {
      fixture.componentRef.setInput('estimatedCost', 'invalid');
      expect(component.formattedCost()).toBe('invalid');
    });
  });

  describe('hasSufficientBalance', () => {
    it('should show balance-available element when hasSufficientBalance is true', () => {
      fixture.componentRef.setInput('hasSufficientBalance', true);
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('.balance-available');
      expect(el).toBeTruthy();
    });

    it('should not show balance-unavailable when hasSufficientBalance is true', () => {
      fixture.componentRef.setInput('hasSufficientBalance', true);
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('.balance-unavailable');
      expect(el).toBeFalsy();
    });

    it('should show balance-unavailable element when hasSufficientBalance is false', () => {
      fixture.componentRef.setInput('hasSufficientBalance', false);
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('.balance-unavailable');
      expect(el).toBeTruthy();
    });

    it('should not show balance-available when hasSufficientBalance is false', () => {
      fixture.componentRef.setInput('hasSufficientBalance', false);
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('.balance-available');
      expect(el).toBeFalsy();
    });
  });
});
