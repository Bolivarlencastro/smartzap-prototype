import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[kpScrollToBottom]',
  standalone: true,
})
export class KpScrollToBottomDirective implements OnChanges {
  @Input() kpScrollToBottom: number;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpScrollToBottom']) {
      setTimeout(() => this.scrollToBottom());
    }
  }

  private scrollToBottom(): void {
    if (this.elementRef.nativeElement.scrollHeight !== this.elementRef.nativeElement.scrollTop) {
      this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
    }
  }
}
