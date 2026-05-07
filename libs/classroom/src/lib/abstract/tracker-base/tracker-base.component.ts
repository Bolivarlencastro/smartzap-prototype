import { Directive, ViewChild } from '@angular/core';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import {
  ActivityTrackerComponent,
  KpPlayerActivityTrackerWrapperComponent,
  LOADING_DELAY,
} from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';

@Directive()
export abstract class TrackerBaseComponent {
  @ViewChild('tracker')
  tracker!:
    | KpContentActivityTrackerWrapperComponent
    | KpPlayerActivityTrackerWrapperComponent
    | ActivityTrackerComponent;

  /**
   * Garante que o setInterval do tracker seja destruído sempre que um conteúdo é carregado
   * já que a estratégia de navegação padrão do angular não destrói o componente
   * ao navegar de, por exemplo: /video/123 para /video/321.
   */
  protected clear(): void {
    if (this.tracker) {
      this.tracker.clear();
    }
  }

  protected initTracker(): void {
    setTimeout(() => {
      this.tracker.init();
    }, LOADING_DELAY);
  }
}
