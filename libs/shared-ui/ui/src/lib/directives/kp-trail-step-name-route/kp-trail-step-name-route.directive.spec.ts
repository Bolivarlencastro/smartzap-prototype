import { ElementRef, Renderer2 } from '@angular/core';
import { KpTrailStepNameRouteDirective } from './kp-trail-step-name-route.directive';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('KpTrailStepNameRouteDirective', () => {
  let directive: KpTrailStepNameRouteDirective;
  let elementRefMock: Partial<ElementRef>;
  let renderer2Mock: Partial<Renderer2>;
  let mockNativeElement: HTMLElement;
  let addEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    mockNativeElement = document.createElement('div');
    elementRefMock = { nativeElement: mockNativeElement };
    renderer2Mock = { addClass: jest.fn() };
    addEventListenerSpy = jest.spyOn(mockNativeElement, 'addEventListener');
    directive = new KpTrailStepNameRouteDirective(elementRefMock as ElementRef, renderer2Mock as Renderer2);
  });

  describe('shouldOpenDetail', () => {
    it('should not add the class and event listener to the element when the user is not enrolled in the trail', () => {
      directive.context = { step: { type: 'pulse' }, isEnrolledInTrail: false };
      directive.ngAfterViewInit();

      expect(renderer2Mock.addClass).not.toHaveBeenCalled();
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should not add the class and event listener to the element when the step is not a published mission', () => {
      directive.context = {
        step: { type: 'mission', development_status: DevelopmentStatus.IN_PROGRESS },
        isEnrolledInTrail: true,
      };
      directive.ngAfterViewInit();

      expect(renderer2Mock.addClass).not.toHaveBeenCalled();
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should add the class and event listener to the element when the user is enrolled in the trail and the step is a published mission', () => {
      directive.context = {
        step: { type: 'mission', development_status: DevelopmentStatus.DONE },
        isEnrolledInTrail: true,
      };
      directive.ngAfterViewInit();

      expect(renderer2Mock.addClass).toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it('should add the class and event listener to the element when the user is enrolled in the trail and the step is a pulse', () => {
      directive.context = { step: { type: 'pulse' }, isEnrolledInTrail: true };
      directive.ngAfterViewInit();

      expect(renderer2Mock.addClass).toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalled();
    });
  });
});
