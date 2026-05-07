import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpSpinnerCircleComponent } from './kp-spinner-circle.component';

describe('KpSpinnerCircleComponent', () => {
  let component: KpSpinnerCircleComponent;
  let fixture: ComponentFixture<KpSpinnerCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpSpinnerCircleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpSpinnerCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngAfterViewInit', () => {
    it('should use backgroundColor in behind circle stroke if defined', () => {
      component.backgroundColor = 'red';

      component.ngAfterViewInit();

      const circleElement = component.behindCircleElement.nativeElement.querySelector('circle');
      expect(circleElement.style.stroke).toEqual(component.backgroundColor);
    });

    it('should use color in behind circle stroke if backgroundColor is not defined', () => {
      component.color = '#000000';
      component.backgroundColor = undefined;

      component.ngAfterViewInit();

      const circleElement = component.behindCircleElement.nativeElement.querySelector('circle');
      expect(circleElement.style.stroke).toEqual(component.color);
    });
  });
});
