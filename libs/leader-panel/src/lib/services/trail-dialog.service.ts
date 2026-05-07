import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  EnrollmentStatuses,
  KEEPS_APP_SERVICES,
  KeepsAppServices,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { delay, Observable, of } from 'rxjs';
import { TrailDialogComponent } from '../containers/trails/trail-dialog.component';
import { TrailDialogData, TrailDialogLearnContent } from '../models/trail-dialog';

@Injectable({
  providedIn: 'root',
})
export class TrailDialogService {
  private dialogRef: MatDialogRef<TrailDialogComponent>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly workspaceService: WorkspaceService,
    @Inject(KEEPS_APP_SERVICES) private readonly keepsAppServices: KeepsAppServices,
  ) {}

  openDialog() {
    const services = this.keepsAppServices;
    const hasCourseTab = this.workspaceService.isServiceActive(services?.['mission']?.id);
    const hasPulseTab = this.workspaceService.isServiceActive(services?.['pulse']?.id);

    this.dialogRef = this.dialog.open(TrailDialogComponent, {
      width: '100%',
      maxWidth: '80vw',
      autoFocus: 'dialog',
      data: { hasCourseTab, hasPulseTab },
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  fetchData(_trailId: string): Observable<TrailDialogData> {
    return of({
      enrollments: [
        {
          id: '1',
          name: 'Gilberto Barros',
          avatar: 'https://i.pravatar.cc/40?u=2',
          jobPosition: 'Coordenadora de Vendas',
          normative: true,
          goal_date: '2025-12-25',
          status: EnrollmentStatuses.STARTED,
          progress: 0.75,
        },
        {
          id: '2',
          name: 'Ratinho Leeman',
          avatar: '',
          jobPosition: 'Gerente de Contas Sênior',
          required: true,
          goal_date: '2025-12-15',
          status: EnrollmentStatuses.ENROLLED,
          progress: 0.1,
        },
        {
          id: '3',
          name: 'Jorge Aragão',
          avatar: 'https://i.pravatar.cc/40?u=14',
          jobPosition: 'Especialista de Produto',
          goal_date: null,
          status: EnrollmentStatuses.COMPLETED,
          progress: 1,
        },
      ],
      notEnrolled: [
        {
          id: '1',
          name: 'Beatriz Lima',
          avatar: 'https://i.pravatar.cc/40?u=5',
          jobPosition: 'Coordenadora de Vendas',
        },
        {
          id: '2',
          name: 'Carlos Dias',
          avatar: '',
          jobPosition: 'Gerente de Contas Sênior',
        },
        {
          id: '3',
          name: 'Camila Alves',
          avatar: 'https://i.pravatar.cc/40?u=6',
          jobPosition: 'Especialista de Produto',
        },
      ],
      courseOnTrails: [
        {
          id: '1',
          name: 'Excelência em Atendimento ao Cliente',
          learn_content_type: 'course',
          progress: 0.58,
          performance: 0.15,
        },
        {
          id: '2',
          name: 'Financial Intelligence: Building Wealth',
          learn_content_type: 'course',
          progress: 0.42,
          performance: 0,
        },
      ] as TrailDialogLearnContent[],
      pulseOnTrails: [
        {
          id: '1',
          name: 'A Importância da Cultura de Feedback',
          learn_content_type: 'pulse',
          duration: 4159,
          performance: 0.59,
        },
      ] as TrailDialogLearnContent[],
    }).pipe(delay(1500));
  }
}
