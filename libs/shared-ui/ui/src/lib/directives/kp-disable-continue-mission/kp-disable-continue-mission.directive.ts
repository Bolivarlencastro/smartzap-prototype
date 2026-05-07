import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

interface MissionEnrollment {
  mission_model: string;
  status: string;
  hidden: boolean;
  mission_status: string;
}

@Directive({
  selector: '[kpDisableContinueMission]',
  standalone: true,
})
export class KpDisableContinueMissionDirective implements AfterViewInit {
  @Input() element: MissionEnrollment;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.updateButtonState();
  }

  private updateButtonState(): void {
    const shouldHidden =
      this.element.hidden || !this.element.status || ['LIVE', 'PRESENTIAL'].includes(this.element.mission_model);
    if (shouldHidden) {
      this.renderer.addClass(this.el.nativeElement, 'hidden');
      return;
    }

    const shouldDisable =
      [
        'EXPIRED',
        'INACTIVATED',
        'PENDING_VALIDATION',
        'REPROVED',
        'REQUEST_EXTENSION',
        'GIVE_UP',
        'COMPLETED',
        'REFUSED',
      ].includes(this.element.status) ||
      (this.element.mission_status && this.element.mission_status !== 'DONE');
    if (shouldDisable) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    }
  }
}
