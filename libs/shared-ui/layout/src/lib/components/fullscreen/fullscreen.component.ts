import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FullscreenService } from '../../services';

@Component({
  selector: 'fuse-fullscreen',
  templateUrl: './fullscreen.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'fuseFullscreen',
  standalone: false,
})
export class FuseFullscreenComponent {
  @Input() iconTpl: TemplateRef<any>;
  @Input() tooltip: string;

  constructor(private fullscreenService: FullscreenService) {}

  toggleFullscreen() {
    this.fullscreenService.toggleFullscreen();
  }
}
