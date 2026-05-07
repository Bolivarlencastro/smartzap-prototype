import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { KpSettingToggleComponent } from './kp-setting-toggle.component';

describe('KpSettingToggleComponent', () => {
  let component: KpSettingToggleComponent;
  let fixture: ComponentFixture<KpSettingToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpSettingToggleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpSettingToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onToggleChange', () => {
    it('should update the checked property on the component', () => {
      component.onToggleChange({ checked: true } as MatSlideToggleChange);

      expect(component.checked).toBe(true);
    });

    it('should emit toggleChange', () => {
      const toggleSpy = jest.spyOn(component.toggleChange, 'emit');

      component.onToggleChange({ checked: true } as MatSlideToggleChange);

      expect(toggleSpy).toHaveBeenCalledWith({ checked: true });
    });
  });
});
