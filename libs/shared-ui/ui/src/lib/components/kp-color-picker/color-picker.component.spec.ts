import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit colorChange', () => {
    const emitSpy = jest.spyOn(component.colorChange, 'emit');
    const expectedColor = '#e7e1ff';

    component.onChangeColor(expectedColor);

    expect(emitSpy).toHaveBeenCalledWith(expectedColor);
  });
});
