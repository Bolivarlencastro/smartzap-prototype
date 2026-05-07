import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { delay, Observable, of } from 'rxjs';
import { EventDialogComponent } from '../containers/events/event-dialog.component';
import { EventDialogData } from '../models/event-dialog';

@Injectable({
  providedIn: 'root',
})
export class EventDialogService {
  private dialogRef: MatDialogRef<EventDialogComponent>;

  constructor(private readonly dialog: MatDialog) {}

  openDialog() {
    this.dialogRef = this.dialog.open(EventDialogComponent, {
      width: '100%',
      maxWidth: '80vw',
      autoFocus: 'dialog',
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  fetchData(_eventId: string): Observable<EventDialogData> {
    return of({
      enrolled: [
        {
          id: '1',
          name: 'Gilberto Barros',
          avatar: 'https://i.pravatar.cc/40?u=2',
          jobPosition: 'Coordenadora de Vendas',
        },
        {
          id: '2',
          name: 'Ratinho Leeman',
          avatar: '',
          jobPosition: 'Gerente de Contas Sênior',
        },
        {
          id: '3',
          name: 'Jorge Aragão',
          avatar: 'https://i.pravatar.cc/40?u=14',
          jobPosition: 'Especialista de Produto',
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
    }).pipe(delay(1500));
  }
}
