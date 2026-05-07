import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import {
  ComplianceDto,
  CycleCreateDto,
  CyclesFilterDto,
  Job,
  JobFunction,
  JobsApi,
  LearningObjectDto,
  RegulatoryComplianceApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { CycleCreateComponent } from '../containers';
import { CycleCreateFilter, CycleCreateFilterType } from '../models';
import { KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class CycleCreateService {
  cycleDialogRef: MatDialogRef<CycleCreateComponent>;

  constructor(
    private dialog: MatDialog,
    private messageService: KpMessageService,
    private jobsApi: JobsApi,
    private regulatoryComplianceApi: RegulatoryComplianceApi,
  ) {}

  openCycleDialog() {
    this.cycleDialogRef = this.dialog.open(CycleCreateComponent, {
      width: '400px',
      autoFocus: false,
      disableClose: true,
    });

    return this.cycleDialogRef.afterClosed();
  }

  closeDialog(): void {
    this.cycleDialogRef?.close();
  }

  openEditConfirmDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
      disableClose: true,
    });

    const instance = dialogRef.componentInstance;
    instance.confirmTitle = marker('REGULATORY_COMPLIANCE.EDIT_NORMATIVE_CYCLE');
    instance.confirmMessage = marker('REGULATORY_COMPLIANCE.EDIT_NORMATIVE_CYCLE_MESSAGE');
    instance.negativeButtonLabel = marker('REGULATORY_COMPLIANCE.CLOSE');
    instance.positiveButtonLabel = marker('REGULATORY_COMPLIANCE.EDIT');

    return dialogRef.afterClosed();
  }

  openDeleteConfirmDialog(selectedCount?: number): Observable<boolean> {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
      disableClose: true,
    });

    const instance = dialogRef.componentInstance;
    instance.negativeButtonLabel = marker('REGULATORY_COMPLIANCE.CLOSE');
    instance.positiveButtonLabel = marker('REGULATORY_COMPLIANCE.DELETE');

    if (selectedCount > 1) {
      instance.confirmTitle = marker('REGULATORY_COMPLIANCE.DELETE_MULTIPLE_NORMATIVE_CYCLE');
      instance.confirmMessage = marker('REGULATORY_COMPLIANCE.DELETE_MULTIPLE_NORMATIVE_CYCLE_MESSAGE');
    } else {
      instance.confirmTitle = marker('REGULATORY_COMPLIANCE.DELETE_NORMATIVE_CYCLE');
      instance.confirmMessage = marker('REGULATORY_COMPLIANCE.DELETE_NORMATIVE_CYCLE_MESSAGE');
    }

    return dialogRef.afterClosed();
  }

  getNormativeCycles(filter: CyclesFilterDto) {
    return this.regulatoryComplianceApi.getCycles(filter);
  }

  saveNormativeCycle(cycle: CycleCreateDto, currentCycleId: string) {
    if (currentCycleId) {
      return this.editNormativeCycle(currentCycleId, cycle);
    }

    return this.createNormativeCycle(cycle);
  }

  loadCycle(cycleId: string) {
    return this.regulatoryComplianceApi.getCycleDetails(cycleId);
  }

  private createNormativeCycle(cycle: CycleCreateDto) {
    return this.regulatoryComplianceApi
      .createCycle(cycle)
      .pipe(
        tap({ next: () => this.messageService.success(marker('REGULATORY_COMPLIANCE.CREATE_CYCLE_SUCCESS_MESSAGE')) }),
      );
  }

  private editNormativeCycle(id: string, cycle: CycleCreateDto) {
    return this.regulatoryComplianceApi
      .updateCycle(id, cycle)
      .pipe(
        tap({ next: () => this.messageService.success(marker('REGULATORY_COMPLIANCE.EDIT_CYCLE_SUCCESS_MESSAGE')) }),
      );
  }

  deleteNormativeCycles(cycleIds: string[]) {
    const deleteRequest =
      cycleIds.length > 1
        ? this.regulatoryComplianceApi.batchDeleteCycles(cycleIds)
        : this.regulatoryComplianceApi.deleteCycle(cycleIds.at(0));

    return deleteRequest.pipe(
      tap(() => this.messageService.success(marker('REGULATORY_COMPLIANCE.DELETE_CYCLE_SUCCESS_MESSAGE'))),
    );
  }

  loadJobAndPositions() {
    return forkJoin({
      jobs: this.jobsApi.fetchJobs().pipe(map((items) => this.mapToKpAcOption(items))),
      jobFunctions: this.jobsApi.fetchJobFunctions().pipe(map((items) => this.mapToKpAcOption(items))),
    });
  }

  filterItems(filter: CycleCreateFilter) {
    const { search, type } = filter;

    const filterMap = new Map<CycleCreateFilterType, (search: string) => Observable<KpAutocompleteOption[]>>([
      ['compliances', this.filterCompliances],
      ['learningObjects', this.filterLearningObjects],
    ]);

    return filterMap.get(type)(search);
  }

  private filterCompliances = (search: string) => {
    return this.regulatoryComplianceApi
      .getCompliances({ search })
      .pipe(map((results) => this.mapToKpAcOption(results.items)));
  };

  private filterLearningObjects = (search: string) => {
    return this.regulatoryComplianceApi
      .getLearningObjects({ search })
      .pipe(map((results) => this.mapLearningObjectToAcOption(results.items)));
  };

  private mapToKpAcOption(
    items: Job[] | JobFunction[] | ComplianceDto[] | LearningObjectDto[],
  ): KpAutocompleteOption[] {
    return items.map((item) => ({ value: item.id, label: item.name }));
  }

  private mapLearningObjectToAcOption(items: LearningObjectDto[]): KpAutocompleteOption[] {
    return items.map((item) => ({ value: item.id, label: item.name, icon: item.learningObjectTypeId }));
  }
}
