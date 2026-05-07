import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';
import { KpFilterKeySelectComponent } from './kp-filter-key-select.component';

describe('KpFilterSelectComponent', () => {
  let component: KpFilterKeySelectComponent;
  let fixture: ComponentFixture<KpFilterKeySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpFilterKeySelectComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpFilterKeySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onSelectionChange', () => {
    it('should emit optionChange event', () => {
      const emitSpy = jest.spyOn(component.optionChange, 'emit');

      component.onSelectionChange('mock_key');

      expect(emitSpy).toHaveBeenCalledWith('mock_key');
    });
  });
});
