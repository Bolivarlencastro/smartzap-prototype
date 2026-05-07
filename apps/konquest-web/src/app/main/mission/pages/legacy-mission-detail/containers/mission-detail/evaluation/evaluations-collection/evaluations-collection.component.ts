import { DatePipe, LowerCasePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Evaluation } from '@core/model/evaluation.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpContentBoxDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-box-dialog';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

export interface MatTableEvaluation {
  _elementRef: ElementRef;
}

@Component({
  selector: 'app-evaluations-collection',
  templateUrl: './evaluations-collection.component.html',
  styleUrls: ['./evaluations-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSort,
    MatSortHeader,
    MatTooltip,
    NgClass,
    MatIcon,
    LowerCasePipe,
    DatePipe,
    TranslocoPipe,
  ],
})
export class EvaluationsCollectionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() evaluations!: Evaluation[];
  @Input() isLoading = false;

  missionId!: string;
  displayedColumns: string[] = ['user', 'comment', 'evaluation', 'questions-rating-avg', 'nps', 'created-date', 'menu'];
  sortedData: Evaluation[] = [];

  ngDestroyed$ = new Subject();

  @ViewChild('comment', { static: true })
  commentTemplate: any;

  @ViewChild(MatTable)
  table!: MatTableEvaluation;

  readonly defaultUserAvatar = environment.defaultUserAvatar;

  constructor(
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._route.parent?.params.subscribe((params) => {
      this.missionId = params['id'];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evaluations'] && this.evaluations) {
      this.sortedData = this.evaluations.slice();
    }
  }

  ngOnDestroy() {
    this.ngDestroyed$.unsubscribe();
  }

  showComment(comment: string) {
    this._dialog.open(KpContentBoxDialogComponent, {
      maxWidth: 600,
      data: {
        confirmTitle: marker('MISSION.DETAIL.EVALUATIONS.COMMENT_DIALOG_TITLE'),
        customTemplate: this.commentTemplate,
        context: { $implicit: comment },
      },
    });
  }

  sortDate(sort: Sort) {
    const data = this.evaluations.slice();
    this.sortedData = [...data].sort((a, b) => (a < b ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1));
  }
}
