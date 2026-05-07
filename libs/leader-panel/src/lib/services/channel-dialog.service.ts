import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { delay, Observable, of } from 'rxjs';
import { ChannelDialogComponent } from '../containers/channels/channel-dialog.component';
import { ChannelDialogData } from '../models/channel-dialog';

@Injectable({
  providedIn: 'root',
})
export class ChannelDialogService {
  private dialogRef: MatDialogRef<ChannelDialogComponent>;

  constructor(private readonly dialog: MatDialog) {}

  openDialog() {
    this.dialogRef = this.dialog.open(ChannelDialogComponent, {
      width: '100%',
      maxWidth: '80vw',
      autoFocus: 'dialog',
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  fetchData(_channelId: string): Observable<ChannelDialogData> {
    return of({
      enrolled: [
        {
          id: '1',
          name: 'Gilberto Barros',
          avatar: 'https://i.pravatar.cc/40?u=2',
          jobPosition: 'Coordenadora de Vendas',
          total_pulse: 3,
          pulse_count: 3,
        },
        {
          id: '2',
          name: 'Ratinho Leeman',
          avatar: '',
          jobPosition: 'Gerente de Contas Sênior',
          total_pulse: 3,
          pulse_count: 1,
        },
        {
          id: '3',
          name: 'Jorge Aragão',
          avatar: 'https://i.pravatar.cc/40?u=14',
          jobPosition: 'Especialista de Produto',
          total_pulse: 3,
          pulse_count: 2,
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
      pulses: [
        {
          id: '1',
          name: 'Weekly Team Update',
          channel_name: 'Sales Communication Channel',
          type: 'video',
          duration: 180,
          views: 145,
          consumption_rate: 0.82,
          content_type_name: 'Image',
        },
        {
          id: '2',
          name: 'Product Launch Announcement',
          channel_name: 'Marketing Strategy Channel',
          type: 'spreadsheet',
          duration: 300,
          views: 198,
          consumption_rate: 0.74,
          content_type_name: 'Question',
        },
      ],
    }).pipe(delay(1500));
  }
}
