import { KpScrollToBottomDirective } from './kp-scroll-to-bottom.directive';
import { ElementRef } from '@angular/core';

describe('KpScrollToBottomDirective', () => {
  let directive: KpScrollToBottomDirective;
  let elementRef: jest.Mocked<ElementRef>;

  beforeEach(() => {
    elementRef = {
      nativeElement: {
        scrollHeight: 1000,
        scrollTop: 0,
      },
    } as jest.Mocked<ElementRef>;

    directive = new KpScrollToBottomDirective(elementRef);
    jest.useFakeTimers();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should scroll to bottom when kpScrollToBottom input changes', () => {
    directive.kpScrollToBottom = 1;

    directive.ngOnChanges({
      kpScrollToBottom: {
        currentValue: 1,
        previousValue: 0,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    jest.advanceTimersByTime(0);

    expect(elementRef.nativeElement.scrollTop).toBe(1000);
  });

  it('should not scroll if already at the bottom', () => {
    elementRef.nativeElement.scrollTop = 1000;

    directive.kpScrollToBottom = 2;

    directive.ngOnChanges({
      kpScrollToBottom: {
        currentValue: 2,
        previousValue: 1,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    jest.advanceTimersByTime(0);

    expect(elementRef.nativeElement.scrollTop).toBe(1000);
  });
});
