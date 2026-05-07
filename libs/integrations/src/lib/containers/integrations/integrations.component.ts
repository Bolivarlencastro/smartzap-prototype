import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { IntegrationsListComponent } from '../../components/integrations-list/integrations-list.component';
import { Integration, IntegrationGroup, IntegrationToggleEvent } from '../../models/integrations-model';
import { integrationsFeature } from '../../store';
import { IntegrationsActions, TokensDialogActions } from '../../store/actions';

@Component({
  selector: 'kp-integrations',
  imports: [CommonModule, IntegrationsListComponent],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <kp-integrations-list
      class="block p-4 md:p-6"
      [integrationGroups]="integrations$ | async"
      (integrationToggle)="toggleIntegration($event)"
      (configureToken)="openTokenConfigureDialog()"
      (openInstructions)="openInstructions($event)"
    ></kp-integrations-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationsComponent implements OnDestroy {
  protected readonly integrations$: Observable<IntegrationGroup[]>;
  private readonly onDestroy = new Subject<void>();

  constructor(private store: Store) {
    store.dispatch(IntegrationsActions.loadIntegrations());
    this.integrations$ = store.select(integrationsFeature.selectIntegrations);
  }

  toggleIntegration(event: IntegrationToggleEvent) {
    this.store.dispatch(
      IntegrationsActions.toggleIntegration({ integration: event.integration, enabled: event.enabled }),
    );
  }

  openInstructions(integration: Integration) {
    this.store.dispatch(IntegrationsActions.openInstructions({ integration }));
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  openTokenConfigureDialog(): void {
    this.store.dispatch(TokensDialogActions.openDialog());
  }
}
