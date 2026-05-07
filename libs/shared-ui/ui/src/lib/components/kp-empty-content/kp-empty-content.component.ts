import { Component, Input, OnInit } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoService } from '@jsverse/transloco';

const EMPTY_MESSAGE = marker('UI.GENERAL.EMPTY_LIST_MESSAGE');

@Component({
  selector: 'kp-empty-content',
  templateUrl: './kp-empty-content.component.html',
  styleUrls: ['./kp-empty-content.component.scss'],
  standalone: true,
})
export class KpEmptyContentComponent implements OnInit {
  @Input() message = '';

  constructor(private translateService: TranslocoService) {}

  ngOnInit(): void {
    if (!this.message) {
      this.translateService.selectTranslate(EMPTY_MESSAGE).subscribe((msg) => (this.message = msg));
    }
  }
}
