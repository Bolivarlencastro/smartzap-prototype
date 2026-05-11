import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'kp-certificates-header',
  templateUrl: './certificates-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, MatIconModule, MatButtonModule],
})
export class CertificatesHeaderComponent {
  readonly newItemEvent = output<void>();

  createCertificate() {
    this.newItemEvent.emit();
  }
}
