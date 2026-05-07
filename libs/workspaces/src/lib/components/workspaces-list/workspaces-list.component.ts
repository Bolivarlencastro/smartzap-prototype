import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KpWorkspaceCardComponent } from '@keeps-platform-frontend-workspace/ui/kp-workspace-card';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { WorkspaceAccentColorDirective } from './workspace-accent-color.directive';
import { WorkspaceInitialPipe, WorkspaceLogoPipe, WorkspaceReferencePipe } from './workspace-presentation.pipes';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subject, Subscription, switchMap, timer } from 'rxjs';
import { WorkspaceViewMode } from '../../store/models/workspaces.model';

@Component({
  selector: 'kp-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrls: ['./workspaces-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  imports: [
    NgxSkeletonLoaderModule,
    KpWorkspaceCardComponent,
    MatTableModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    ClipboardModule,
    WorkspaceAccentColorDirective,
    WorkspaceLogoPipe,
    WorkspaceReferencePipe,
    WorkspaceInitialPipe,
    TranslocoPipe,
  ],
})
export class WorkspacesListComponent implements OnDestroy {
  readonly displayedColumns = ['logo', 'name', 'reference'];
  private copiedReference: string | null = null;
  private readonly copiedReferenceReset$ = new Subject<void>();
  private readonly copiedReferenceResetSubscription: Subscription;
  @Input() isLoading: boolean;
  @Output() workspaceSelected = new EventEmitter<WorkspaceBasicDto>();
  @Input() workspaces: WorkspaceBasicDto[];
  @Input() viewMode: WorkspaceViewMode = 'grid';

  constructor() {
    this.copiedReferenceResetSubscription = this.copiedReferenceReset$
      .pipe(switchMap(() => timer(1000)))
      .subscribe(() => {
        this.copiedReference = null;
      });
  }

  selectWorkspace(workspace: WorkspaceBasicDto): void {
    this.workspaceSelected.emit(workspace);
  }

  trackByWorkspaceId(_index: number, workspace: WorkspaceBasicDto): string {
    return workspace?.id;
  }

  isReferenceCopied(reference: string): boolean {
    return this.copiedReference === reference;
  }

  stopRowSelection(event: Event): void {
    event.stopPropagation();
  }

  onWorkspaceReferenceCopied(reference: string, copied: boolean): void {
    if (!copied || !reference) {
      return;
    }
    this.showCopyFeedback(reference);
  }

  ngOnDestroy(): void {
    this.copiedReferenceResetSubscription.unsubscribe();
  }

  private showCopyFeedback(reference: string): void {
    this.copiedReference = reference;
    this.copiedReferenceReset$.next();
  }
}
