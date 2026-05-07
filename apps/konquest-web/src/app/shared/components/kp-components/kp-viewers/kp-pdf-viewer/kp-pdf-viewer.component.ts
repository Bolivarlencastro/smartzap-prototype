import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { TranslocoService, TranslocoPipe } from '@jsverse/transloco';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'kp-pdf-viewer',
  templateUrl: './kp-pdf-viewer.component.html',
  styleUrls: ['./kp-pdf-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxExtendedPdfViewerModule, AsyncPipe, TranslocoPipe],
})
export class KpPdfViewerComponent implements OnInit {
  @Output() started = new EventEmitter<void>();
  @Input() url!: string;

  isMobile$: Observable<boolean>;
  language = 'en-US';

  constructor(
    translate: TranslocoService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.language = translate.getActiveLang();
    this.isMobile$ = this.breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnInit(): void {
    this.started.emit();
  }
}
