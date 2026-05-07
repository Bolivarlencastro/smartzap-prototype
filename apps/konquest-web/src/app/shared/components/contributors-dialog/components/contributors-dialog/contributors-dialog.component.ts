import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContributorDialogActions, contributorsFeature } from '../../store';
import { Observable } from 'rxjs';
import { User } from '@core/model';
import { Contributor } from '@core/model/contributor.model';
import { MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ContributorsFilterComponent } from '../contributors-filter/contributors-filter.component';
import { ContributorsListComponent } from '../contributors-list/contributors-list.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-contributors-dialog',
  template: `
    <h1 mat-dialog-title class="text-2xl">{{ 'CONTRIBUTORS_DIALOG.TITLE' | transloco }}</h1>
    <div mat-dialog-content class="flex flex-col gap-2">
      <app-contributors-filter
        (filterEvent)="onFilter($event)"
        (optionSelected)="addContributor($event)"
        [users]="filteredUsers$ | async"
      ></app-contributors-filter>
      <app-contributors-list
        [contributors]="contributors$ | async"
        (removeContributor)="removeContributor($event)"
      ></app-contributors-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    ContributorsFilterComponent,
    ContributorsListComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class ContributorsDialogComponent {
  protected readonly filteredUsers$: Observable<User[]>;
  protected readonly contributors$: Observable<Contributor[]>;

  constructor(private store: Store) {
    this.filteredUsers$ = this.store.select(contributorsFeature.selectFilteredContributors);
    this.contributors$ = this.store.select(contributorsFeature.selectAll);
  }

  onFilter(search: string) {
    this.store.dispatch(ContributorDialogActions.filterContributors({ search }));
  }

  addContributor(user: User) {
    this.store.dispatch(ContributorDialogActions.addContributor({ userId: user.id }));
  }

  removeContributor(contributor: Contributor) {
    this.store.dispatch(ContributorDialogActions.removeContributor({ userId: contributor.user.id }));
  }
}
