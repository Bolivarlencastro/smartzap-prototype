import { Directive, ElementRef, Renderer2, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[kpTransformInDash]',
  standalone: true,
})
export class KpTransformInDashDirective implements AfterViewInit {
  private element: ElementRef;

  constructor(
    element?: ElementRef,
    private renderer?: Renderer2,
  ) {
    this.element = element;
  }

  @Input() status: any;

  ngAfterViewInit(): void {
    if (this.status !== 'COMPLETED') {
      this.renderer.setProperty(this.element.nativeElement, 'innerHTML', '-');
    }
  }
}
