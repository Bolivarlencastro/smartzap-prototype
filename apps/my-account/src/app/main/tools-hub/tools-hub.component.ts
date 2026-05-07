import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { ToolsHubHeaderComponent } from './components/tools-hub-header/tools-hub-header.component';
import { ToolsHubListComponent } from './components/tools-hub-list/tools-hub-list.component';
import { ToolsHubActions, toolsHubFeature } from './store';

@Component({
  selector: 'app-tools-hub',
  imports: [TranslocoModule, ToolsHubHeaderComponent, ToolsHubListComponent],
  template: `
    <app-tools-hub-header (create)="onCreate()"></app-tools-hub-header>
    <app-tools-hub-list
      class="grow"
      [items]="items()"
      [loading]="loading()"
      (edit)="onEdit($event)"
      (remove)="onRemove($event)"
    ></app-tools-hub-list>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsHubComponent implements OnDestroy {
  items: Signal<CustomMenuItem[]>;
  loading: Signal<boolean>;

  constructor(private store: Store) {
    this.store.dispatch(ToolsHubActions.loadData());
    this.items = toSignal(store.select(toolsHubFeature.selectItems));
    this.loading = toSignal(store.select(toolsHubFeature.selectLoading));
  }

  ngOnDestroy() {
    this.store.dispatch(ToolsHubActions.reset());
  }

  onCreate() {
    this.store.dispatch(ToolsHubActions.openConfigDialog({}));
  }

  onEdit(item: CustomMenuItem) {
    this.store.dispatch(ToolsHubActions.openConfigDialog({ item }));
  }

  onRemove(id: string) {
    this.store.dispatch(ToolsHubActions.remove({ id }));
  }
}
