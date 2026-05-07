import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Evaluation, EvaluationQuestion, EvaluationSummary, EvaluationSummaryNps } from '@core/model/evaluation.model';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { Store } from '@ngrx/store';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Mission } from 'app/main/mission/mission.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Pagination } from '@core/model';
import { EvaluationsFilterActions, MissionDetailActions } from '../store/actions';
import { MissionDetailSelectors } from '../store/selectors';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { EvaluationsCollectionComponent } from './evaluations-collection/evaluations-collection.component';
import { format } from 'date-fns';
import { KpExporterService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { EvaluationsChartComponent } from './evaluations-chart/evaluations-chart.component';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';

enum ExportType {
  PDF = 'pdf',
}

@Component({
  selector: 'mission-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  imports: [
    MatIconButton,
    MatIcon,
    MatTooltip,
    EvaluationsChartComponent,
    KpTableLayoutComponent,
    EvaluationsCollectionComponent,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
    KeyValuePipe,
    TranslocoPipe,
    KpPerformancePipe,
  ],
})
export class MissionEvaluationsComponent implements OnDestroy, OnInit {
  missionId!: string;

  mission$: Observable<Mission | null>;
  questions$!: Observable<EvaluationQuestion[]>;
  evaluations$!: Observable<Pagination<Evaluation>>;
  isLoading$!: Observable<boolean>;
  summary$!: Observable<EvaluationSummary>;
  evaluations!: Evaluation[];

  evaluationPage = 1;
  evaluationPerPage = 5;

  @ViewChild(EvaluationsCollectionComponent)
  evaluationsCollection!: EvaluationsCollectionComponent;

  constructor(
    private _route: ActivatedRoute,
    private store: Store,
    private _translateService: TranslocoService,
    private _router: Router,
  ) {
    this.mission$ = this.store.select(MissionDetailSelectors.selectCourse);
    this.summary$ = this.store.select(MissionDetailSelectors.selectEvaluationSummary);
  }

  navigateBack() {
    this._router.navigate(['/management/courses']);
  }

  ngOnInit() {
    this._route.parent?.params.subscribe((params) => {
      const missionId = params['id'];
      this.missionId = missionId;
      this.store.dispatch(MissionDetailActions.loadEvaluationSummary({ id: missionId }));
    });

    this.updateEnrollmentLearningTrailList();

    this.isLoading$ = this.store.select(MissionDetailSelectors.selectIsLoading);

    this.evaluations$ = this.store.select(MissionDetailSelectors.selectEvaluations).pipe(
      tap((response: Pagination<Evaluation>) => {
        if (response.results) {
          this.evaluations = response.results;
        }
      }),
    );

    this.questions$ = this.store.select(MissionDetailSelectors.selectEvaluationQuestions);

    this.store.dispatch(MissionDetailActions.loadEvaluationQuestions());
  }

  getCountByPoint(summary: EvaluationSummaryNps | undefined, index: number): number {
    return summary?.count_by_point?.[index] || 0;
  }

  ngOnDestroy() {
    this.store.dispatch(MissionDetailActions.cleanCache());
  }

  openFiltersModal() {
    this.store.dispatch(EvaluationsFilterActions.openFilterDialog({ id: this.missionId }));
  }

  applyInputFilter(search: string) {
    this.evaluationPage = 1;
    this.store.dispatch(
      MissionDetailActions.loadEvaluations({
        filters: {
          per_page: this.evaluationPerPage,
          page: 1,
          mission__id: this.missionId,
          search,
        },
      }),
    );
  }

  onChangePage(paginator: PageEvent) {
    this.evaluationPerPage = paginator.pageSize;
    this.evaluationPage = paginator.pageIndex + 1;

    this.updateEnrollmentLearningTrailList();
  }

  onDataTableExport(exportFormat: string): void {
    const fileName = this._translateService.translate(marker('MISSION.DETAIL.EVALUATIONS.PDF_TABLE_NAME'));

    if (exportFormat === ExportType.PDF) {
      const table: HTMLTableElement = this.evaluationsCollection.table._elementRef.nativeElement;
      const pdf = new jsPDF('l', 'pt', 'a4');

      autoTable(pdf, {
        head: [
          Array.from(table.tHead.children[0].children).reduce((result: string[], th: Element, index: number) => {
            if (index === 2 || index === 6) return result;
            const isSorted = th.innerHTML.includes('mat-sort-header-content');
            return [...result, isSorted ? th.querySelector('.mat-sort-header-content')?.innerHTML : th.innerHTML];
          }, []),
        ],
        body: this.evaluations.map(
          ({ user, created_date, rating_avg, nps, questions_rating_avg, comment }) =>
            [
              user?.email || user?.name,
              format(created_date, 'P'),
              rating_avg?.toString(),
              nps,
              questions_rating_avg?.toString(),
              comment,
            ] as string[],
        ),
      });

      pdf.save(`${fileName}.pdf`);
      return;
    }

    KpExporterService.exportAsTabulatedData(fileName, 'evaluations-table');
  }

  /**
   * Update enrollment learning trails stream
   */
  private updateEnrollmentLearningTrailList(): void {
    this.store.dispatch(
      MissionDetailActions.loadEvaluations({
        filters: {
          per_page: this.evaluationPerPage,
          page: this.evaluationPage,
          mission__id: this.missionId,
        },
      }),
    );
  }
}
