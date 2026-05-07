import { KpTransformInDashDirective } from './kp-transform-in-dash.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('KpTransformInDashDirective', () => {
  let directive: KpTransformInDashDirective;
  let elementRef: jest.Mocked<ElementRef>;
  let renderer: jest.Mocked<Renderer2>;

  beforeEach(() => {
    elementRef = { nativeElement: {} } as jest.Mocked<ElementRef>;
    renderer = {
      setProperty: jest.fn(),
    } as any;

    directive = new KpTransformInDashDirective(elementRef, renderer);
  });

  it('should set innerHTML to "-" if status is not "COMPLETED"', () => {
    directive.status = 'IN_PROGRESS';
    directive.ngAfterViewInit();

    expect(renderer.setProperty).toHaveBeenCalledWith(elementRef.nativeElement, 'innerHTML', '-');
  });

  it('should not set innerHTML to "-" if status is "COMPLETED"', () => {
    directive.status = 'COMPLETED';
    directive.ngAfterViewInit();

    expect(renderer.setProperty).not.toHaveBeenCalled();
  });
});
