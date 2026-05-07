import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { PanelData } from '../models/panel';

@Injectable()
export class PanelService {
  fetchPanelData(): Observable<PanelData> {
    return of({
      summary: {
        pushCount: 36450,
        totalInvestiment: 4350.75,
        roiEnrollment: 3.52,
      },
      upcomingAppointments: [
        {
          id: '1',
          campaign: 'Campanha Reativação Jan/26',
          date: '28/01/2026 14:00',
          contacts: 5000,
        },
        {
          id: '2',
          campaign: 'Lembrete: SEGURO DE AUTO',
          date: '30/01/2026 09:30',
          contacts: 3200,
        },
        {
          id: '3',
          campaign: 'Reciclagem para transporte público',
          date: '24/03/2026 07:00',
          contacts: 1489,
        },
      ],
      pushHistory: [
        {
          id: '1',
          courseName: 'SEGURO DE VIDA COMO INSTRUTOR',
          date: '15/01/2025',
          pushCount: 12450,
          totalCost: 'R$ 1.550,00',
        },
        {
          id: '2',
          courseName: 'Argumento de venda - Seguro Residencial',
          date: '23/12/2025',
          pushCount: 8200,
          totalCost: 'R$ 980,50',
        },
        {
          id: '3',
          courseName: 'Portabilidade em Previdência',
          date: '10/12/2025',
          pushCount: 6700,
          totalCost: 'R$ 720,43',
        },
        {
          id: '4',
          courseName: 'DÍVIDA ZERO',
          date: '5/12/2025',
          pushCount: 9100,
          totalCost: 'R$ 1.100,25',
        },
      ],
    }).pipe(delay(1500));
  }
}
