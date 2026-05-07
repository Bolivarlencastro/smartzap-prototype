import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Mission } from '../../components/kp-mission-model/model';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TrailStepItem } from '../../components/kp-learning-trail-detail-steps/model';

export interface KpTrailStepNameRoute {
  step: TrailStepItem;
  isEnrolledInTrail: boolean;
}

@Directive({
  selector: '[kpTrailStepNameRoute]',
  standalone: true,
})
export class KpTrailStepNameRouteDirective implements AfterViewInit {
  @Input('kpTrailStepNameRoute') context: KpTrailStepNameRoute;
  @Output() missionDetailEvent = new EventEmitter<Mission>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    if (this.shouldOpenDetail()) {
      this.renderer.addClass(this.el.nativeElement, 'cursor-pointer');
      this.el.nativeElement.addEventListener('click', this.onClick.bind(this));
    }
  }

  private shouldOpenDetail(): boolean {
    const step = this.context?.step;

    if (!this.context?.isEnrolledInTrail) {
      return false;
    }

    if (step?.type === 'mission') {
      return step.development_status === DevelopmentStatus.DONE;
    }

    return true;
  }

  private onClick(): void {
    this.missionDetailEvent.emit(this.context?.step?.step?.mission);
  }
}
