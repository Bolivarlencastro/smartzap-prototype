import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[appProgressTextValue]' })
export class ProgressTextValueDirective implements OnInit {
  @Input() appProgressTextValue: string | number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    const percentage = this.convertToPercentage(+this.appProgressTextValue);
    this.renderer.setStyle(this.el.nativeElement, 'left', this.calculatePosition(+percentage));
    this.renderer.setProperty(this.el.nativeElement, 'innerText', `${percentage.toFixed(0)}%`);
  }

  private calculatePosition(percentage: number): string {
    let distance = '- 35px';

    if (percentage > 3 && percentage < 10) {
      distance = '- 25px';
    } else if (percentage <= 3) {
      distance = '+ 5px';
    }

    return `calc(${percentage}% ${distance})`;
  }

  private convertToPercentage(progress: number): number {
    if (!progress) {
      return 0;
    }
    return progress * 100;
  }
}
