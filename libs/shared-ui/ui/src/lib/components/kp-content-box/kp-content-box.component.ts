import { Component, Input } from '@angular/core';

import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'kp-content-box',
  templateUrl: './kp-content-box.component.html',
  styleUrls: ['./kp-content-box.component.scss'],
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent],
})
export class KpContentBoxComponent {
  @Input() boxTitle: string;
  @Input() boxSubtitle: string;
}
