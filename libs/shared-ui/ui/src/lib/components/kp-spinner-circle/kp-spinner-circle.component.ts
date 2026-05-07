import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'kp-spinner-circle',
  templateUrl: './kp-spinner-circle.component.html',
  imports: [MatProgressSpinner],
})
export class KpSpinnerCircleComponent implements AfterViewInit {
  @Input() color: string;
  @Input() backgroundColor: string;
  @Input() diameter: number;

  @ViewChild('behindCircleElement', { read: ElementRef, static: false })
  behindCircleElement: ElementRef<HTMLElement>;
  @ViewChild('circleElement', { read: ElementRef, static: false })
  circleElement: ElementRef<HTMLElement>;
  @ViewChild('content', { read: ElementRef, static: false })
  content: ElementRef<HTMLElement>;

  private _progress: number;

  @Input() set progress(progress: number) {
    // Check if is passing the value converted or not
    this._progress = progress === 0 || progress === 1 ? progress * 100 : progress;
  }

  get progress(): number {
    return this._progress;
  }

  ngAfterViewInit(): void {
    if (this.backgroundColor || this.color) {
      const behindCircle = this.behindCircleElement.nativeElement?.querySelector('circle');
      const circle = this.circleElement.nativeElement?.querySelector('circle');

      if (behindCircle && circle) {
        behindCircle.style.stroke = this.backgroundColor ?? this.color;
        circle.style.stroke = this.color;
      }
    }
  }
}
