import { Component, Input } from '@angular/core';

@Component({
  selector: 'kp-text-circle',
  templateUrl: './kp-text-circle.component.html',
  styleUrls: ['./kp-text-circle.component.scss'],
  standalone: true,
})
export class KpTextCircleComponent {
  @Input() value = '';
  @Input() color = '#DC67CE'; // pink
}
