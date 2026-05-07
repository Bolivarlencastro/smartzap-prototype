import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Renderer2, DOCUMENT } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MissionDetailActions, MissionDetailSelectors } from '../../store';
import { AsyncPipe } from '@angular/common';
import { RouteDetailDialogWrapper } from '@keeps-platform-frontend-workspace/ui/kp-route-detail-dialog-wrapper';
import { PresentialLiveDetailDialogComponent } from '../../../presential-live-detail-dialog/presential-live-detail-dialog.component';
import { MissionDetailDialogComponent } from '../mission-detail-dialog/mission-detail-dialog.component';

@Component({
  selector: 'app-mission-detail-dialog-container',
  template: `
    @if (isPresentialLiveMission$ | async) {
      <div>
        <app-presential-live-mission-detail-dialog></app-presential-live-mission-detail-dialog>
      </div>
    } @else {
      <app-mission-detail-dialog></app-mission-detail-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PresentialLiveDetailDialogComponent, MissionDetailDialogComponent, AsyncPipe],
})
export class MissionDetailDialogContainerComponent
  extends RouteDetailDialogWrapper<MissionDetailDialogContainerComponent>
  implements OnDestroy
{
  protected readonly isPresentialLiveMission$: Observable<boolean>;

  constructor(
    @Inject(DOCUMENT) protected override _document: Document,
    protected override _renderer2: Renderer2,
    protected override dialogRef: MatDialogRef<MissionDetailDialogContainerComponent>,
    protected store: Store,
  ) {
    super(_document, _renderer2, dialogRef);
    this.isPresentialLiveMission$ = this.store.select(MissionDetailSelectors.selectIsPresentialLiveMission);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(MissionDetailActions.dialogDestroy());
  }
}
