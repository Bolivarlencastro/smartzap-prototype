import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterOutlet } from '@angular/router';
import { LearningTrailNavMenuComponent } from '../components/learning-trail-nav-menu/learning-trail-nav-menu.component';
import { Store } from '@ngrx/store';
import { learningTrailCreateFeature } from '../store/features/learning-trail-create.feature';
import { Observable } from 'rxjs';
import { LearningTrailCreateActions } from '../store';
import { LearningTrail } from 'app/main/learning-trail/model/learning-trail';

@Component({
  selector: 'app-learning-trail-create',
  imports: [
    CommonModule,
    MatDrawer,
    MatDrawerContainer,
    TranslocoModule,
    MatDrawerContent,
    RouterOutlet,
    LearningTrailNavMenuComponent,
  ],
  template: ` <div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-hidden">
    <mat-drawer-container class="flex-auto sm:h-full">
      <mat-drawer mode="side" opened>
        <div class="py-6 px-6">
          <h2 class="text-2xl font-black mb-2">{{ 'LEARNING_TRAIL.CREATE.NAVIGATION.NAV_MENU_TITLE' | transloco }}</h2>
          <p>{{ 'LEARNING_TRAIL.CREATE.NAVIGATION.NAV_MENU_SUBTITLE' | transloco }}</p>
        </div>
        <app-learning-trail-nav-menu
          [learningTrailDefined]="!!(learningTrailDefined$ | async)"
        ></app-learning-trail-nav-menu>
      </mat-drawer>
      <mat-drawer-content class="p-12">
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  </div>`,
  styleUrl: './learning-trail-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailCreateComponent implements OnDestroy {
  protected readonly learningTrailDefined$: Observable<LearningTrail>;

  constructor(private store: Store) {
    this.learningTrailDefined$ = this.store.select(learningTrailCreateFeature.selectLearningTrail);
  }

  ngOnDestroy() {
    this.store.dispatch(LearningTrailCreateActions.resetStore());
  }
}
