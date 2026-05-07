import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Group } from 'app/main/group/groups/group.model';
import { GroupDetailActions, groupDetailFeature } from '../../store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatTabNav,
    MatTabLink,
    RouterLinkActive,
    MatTabNavPanel,
    RouterOutlet,
    TranslocoPipe,
    MatButtonModule,
    MatIconModule,
  ],
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  protected readonly navLinks: any[];
  protected readonly group: Signal<Group>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {
    this.navLinks = [
      { label: 'GROUP_DETAIL.TAB.LINKED_USERS', path: 'users' },
      { label: 'GROUP_DETAIL.TAB.LINKED_TRAILS', path: 'learning-trails' },
      { label: 'GROUP_DETAIL.TAB.LINKED_MISSIONS', path: 'missions' },
      { label: 'GROUP_DETAIL.TAB.LINKED_CHANNELS', path: 'channels' },
    ];

    this.group = toSignal(store.select(groupDetailFeature.selectGroup));
  }

  ngOnInit() {
    this.route.params.subscribe(({ id }) => this.store.dispatch(GroupDetailActions.getGroupDetail({ id })));
  }

  ngOnDestroy() {
    this.store.dispatch(GroupDetailActions.reset());
  }
}
