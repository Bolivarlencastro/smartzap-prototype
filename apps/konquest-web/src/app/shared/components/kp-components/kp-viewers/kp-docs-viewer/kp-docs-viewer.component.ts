import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmbedContentType } from '@core/model';
import { LowerCasePipe, NgClass } from '@angular/common';
import { KpSafeUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-safe-url';
import { KpDocsUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-docs-url';

@Component({
  selector: 'kp-docs-viewer',
  templateUrl: './kp-docs-viewer.component.html',
  styleUrls: ['./kp-docs-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LowerCasePipe, KpSafeUrlPipe, KpDocsUrlPipe],
})
export class KpDocsViewerComponent implements OnInit {
  @Input() url!: string;
  @Input() contentType!: EmbedContentType;
  @Output() started = new EventEmitter<void>();

  private readonly contentRegex = /(https?:\/\/)?(www.)?(\/.*)?keepsdev.com/gm;

  ngOnInit(): void {
    this.started.emit();
  }

  get usingOfficeViewer(): boolean {
    return this.contentRegex.test(this.url);
  }
}
