import { Injectable } from '@angular/core';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { delay, Observable, of } from 'rxjs';
import { LedChannelItem } from '../models/led-channel-item';
import { LedEventItem } from '../models/led-event-item';
import { LedPulseItem } from '../models/led-pulse-item';
import { LedOverviewTabModel } from '../models/led-overview-tab';

@Injectable()
export class LedListService {
  getLedEnrollmentActivityData(_courseId: string): Observable<any> {
    return of({
      id: '1',
      points: 17,
      progress: 0.44,
      performance: 0.26,
      status: 'Não Iniciado',
      last_access: '2025-11-15T10:30:00.000-03:00',
      contents: [
        {
          id: '11',
          name: 'Políticas de Compliance',
          content_type: 'pdf',
          first_access: '2025-11-15T10:30:00.000-03:00',
          last_access: '2025-11-15T10:30:00.000-03:00',
          consumption: 1200,
          duration: 1200,
          status: 'Finalizado',
        },
        {
          id: '22',
          name: 'Teste de Conhecimento',
          content_type: 'question',
          first_access: '2025-11-15T10:30:00.000-03:00',
          last_access: '2025-11-16T10:30:00.000-03:00',
          consumption: 1900,
          duration: 3000,
          status: 'Em Andamento',
        },
        {
          id: '33',
          name: 'Análise Jurídica: LGPD',
          content_type: 'image',
          first_access: null,
          last_access: null,
          consumption: 0,
          duration: 2400,
          status: 'Não Iniciado',
        },
      ],
    }).pipe(delay(1000));
  }

  getLedOverviewData(_userId: string): Observable<LedOverviewTabModel> {
    return of({
      id: '1',
      overdue_training: 0,
      due_soon_training: 0,
      last_activity: 8,
      completed_enrollments: 14,
      total_enrollments: 19,
      completion_rate: 0.74,
      ranking_points: 3855,
      ranking_position: 2,
      chart: null,
    }).pipe(delay(1000));
  }

  getLedChannels(_userId: string): Observable<LedChannelItem[]> {
    return of([
      {
        id: '1',
        name: 'Técnicas de Venda',
        total_pulses: 5,
        consumed_pulses: 3,
      },
      {
        id: '2',
        name: 'Liderança e Gestão',
        total_pulses: 3,
        consumed_pulses: 2,
      },
      {
        id: '3',
        name: 'Tecnologia da Informação',
        total_pulses: 1,
        consumed_pulses: 0,
      },
      {
        id: '4',
        name: 'Recursos Humanos',
        total_pulses: 4,
        consumed_pulses: 4,
      },
    ]).pipe(delay(1000));
  }

  getLedPulses(_userId: string): Observable<LedPulseItem[]> {
    return of([
      {
        id: '1',
        name: '5 Estratégias de Venda Consultiva',
        last_date: '2025-11-15T10:30:00.000-03:00',
      },
      {
        id: '2',
        name: 'A Importância da Cultura de Feedback',
        last_date: '2025-10-22T08:15:30.750-03:00',
      },
      {
        id: '3',
        name: 'PDF: Relatório Anual de Vendas',
        last_date: '2025-10-08T14:45:22.500-03:00',
      },
    ]).pipe(delay(1000));
  }

  getLedEvents(_userId: string): Observable<LedEventItem[]> {
    return of([
      {
        id: '1',
        name: 'Webinar: O Futuro do Trabalho',
        start_date: '2025-10-22T08:15:30.750-03:00',
        end_date: '2025-10-22T08:15:30.750-03:00',
        presence: true,
        development_status: DevelopmentStatus.CLOSED,
      },
      {
        id: '2',
        name: 'Hackathon Interno',
        start_date: '2025-10-08T14:45:22.500-03:00',
        end_date: '2025-10-10T14:45:22.500-03:00',
        presence: false,
        development_status: DevelopmentStatus.CLOSED,
      },
      {
        id: '3',
        name: 'Treinamento de Vendas Q4',
        start_date: '2025-12-31T14:45:22.500-03:00',
        end_date: '2025-12-31T14:45:22.500-03:00',
        presence: null,
        development_status: DevelopmentStatus.DONE,
      },
    ]).pipe(delay(1000));
  }
}
