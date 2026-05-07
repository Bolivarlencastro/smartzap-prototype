import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KEEPS_APP_SERVICES, KeepsAppServices, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { delay, Observable, of } from 'rxjs';
import { PulseDialogComponent } from '../containers/pulses/pulse-dialog.component';
import { PulseDialogData, PulseDialogLearnContent } from '../models/pulse-dialog';

@Injectable({
  providedIn: 'root',
})
export class PulseDialogService {
  private dialogRef: MatDialogRef<PulseDialogComponent>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly workspaceService: WorkspaceService,
    @Inject(KEEPS_APP_SERVICES) private readonly keepsAppServices: KeepsAppServices,
  ) {}

  openDialog() {
    const services = this.keepsAppServices;
    const hasTrailTab = this.workspaceService.isServiceActive(services?.['learning_trail']?.id);

    this.dialogRef = this.dialog.open(PulseDialogComponent, {
      width: '100%',
      maxWidth: '80vw',
      autoFocus: 'dialog',
      data: hasTrailTab,
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  fetchData(_pulseId: string): Observable<PulseDialogData> {
    return of({
      consumedBy: [
        {
          id: '1',
          name: 'Gilberto Barros',
          avatar: 'https://i.pravatar.cc/40?u=2',
          jobPosition: 'Coordenadora de Vendas',
          view_date: '2025-08-25',
        },
        {
          id: '2',
          name: 'Ratinho Leeman',
          avatar: '',
          jobPosition: 'Gerente de Contas Sênior',
          view_date: '2025-12-15',
        },
        {
          id: '3',
          name: 'Jorge Aragão',
          avatar: 'https://i.pravatar.cc/40?u=14',
          jobPosition: 'Especialista de Produto',
          view_date: '2025-07-10',
        },
      ],
      notConsumed: [
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
      associatedTrails: [
        {
          id: '1',
          name: 'Excelência em Atendimento ao Cliente',
          learn_content_type: 'trail',
        } as PulseDialogLearnContent,
      ],
    }).pipe(delay(1500));
  }
}
