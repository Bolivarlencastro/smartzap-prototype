import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { RankingTab, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { GamificationActions, gamificationFeature } from '../../store';
import { getTranslocoScope } from '../../util/transloco-scope.factory';

@Component({
  selector: 'kp-rankings',
  imports: [CommonModule, MatTabsModule, RouterModule, MatDividerModule, TranslocoModule],
  providers: [getTranslocoScope()],
  template: `
    @if ((isLoading$ | async) === false) {
      @if (tabs$ | async; as tabs) {
        @if (tabs.length > 1) {
          <nav mat-tab-nav-bar [tabPanel]="tabPanel" fitInkBarToContent>
            @for (tab of tabs; track tab) {
              <a mat-tab-link [routerLink]="tab.path" routerLinkActive #rla="routerLinkActive" [active]="rla.isActive">
                {{ tab.label | transloco }}
              </a>
            }
          </nav>
          <mat-divider></mat-divider>
        }
        <mat-tab-nav-panel #tabPanel class="grow">
          <router-outlet></router-outlet>
        </mat-tab-nav-panel>
      }
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingsComponent implements OnDestroy {
  tabs$: Observable<RankingTab[]>;
  isLoading$: Observable<boolean>;
  private unsubscribe = new Subject<void>();

  constructor(
    private store: Store,
    private _userProfileService: UserProfileService,
  ) {
    store.dispatch(GamificationActions.loadSubModules());
    this.setAdminPermission();
    this.tabs$ = store.select(gamificationFeature.selectTabs);
    this.isLoading$ = store.select(gamificationFeature.selectIsLoading);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.store.dispatch(GamificationActions.resetState());
  }

  private setAdminPermission(): void {
    combineLatest([this._userProfileService.isAdmin$(), this._userProfileService.isSuperAdmin$()])
      .pipe(
        map(([isAdmin, isSuperAdmin]) => isAdmin || isSuperAdmin),
        takeUntil(this.unsubscribe),
      )
      .subscribe((hasAdminPermission) =>
        this.store.dispatch(GamificationActions.setAdminPermission({ hasAdminPermission })),
      );
  }
}
