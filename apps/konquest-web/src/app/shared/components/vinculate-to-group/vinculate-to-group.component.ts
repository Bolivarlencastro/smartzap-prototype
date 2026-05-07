import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { Group } from '@app/main/group/groups/group.model';
import { VinculateToGroupActions, vinculateToGroupFeature } from '@app/shared/store';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';

@Component({
  selector: 'app-vinculate-to-group',
  imports: [
    CommonModule,
    MatDialogModule,
    TranslocoModule,
    MatRadioModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    KpGlobalSearchInputComponent,
  ],
  templateUrl: './vinculate-to-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VinculateToGroupComponent {
  groups$: Observable<Group[]>;
  loading$: Observable<boolean>;
  selectedGroup: string;

  constructor(
    private dialogRef: MatDialogRef<VinculateToGroupComponent>,
    private store: Store,
  ) {
    store.dispatch(VinculateToGroupActions.loadGroups());
    this.groups$ = store.select(vinculateToGroupFeature.selectGroups);
    this.loading$ = store.select(vinculateToGroupFeature.selectLoading);
  }

  searchTerm(search: string): void {
    this.selectedGroup = null;
    this.store.dispatch(VinculateToGroupActions.search({ search }));
  }

  onSubmit(): void {
    this.dialogRef.close(this.selectedGroup);
  }
}
