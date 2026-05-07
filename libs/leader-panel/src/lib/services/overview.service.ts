import { Inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { OverviewSummary, OverviewTeamSummary, OverviewTeamSummaryItem } from '../models/overview';
import { KEEPS_APP_SERVICES, KeepsAppServices, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';

const ITEM_PROPERTIES: Partial<OverviewTeamSummaryItem> = {
  job_position: 'Vendedor Sênior',
  required_progress: '1 Atradado(s)',
  next_due_date: 'Vencido há 12d',
  last_activity: 'Há 19 dias',
  engagement: null,
  general_status: null,
};

@Injectable()
export class OverviewService {
  constructor(
    @Inject(KEEPS_APP_SERVICES) private readonly keepsAppServices: KeepsAppServices,
    private readonly workspaceService: WorkspaceService,
  ) {}

  getActivatedServices(): { hasGamification: boolean; hasNormative: boolean } {
    const services = this.keepsAppServices;
    return {
      hasGamification: this.workspaceService.isServiceActive(services?.['gamification']?.id),
      hasNormative: this.workspaceService.isServiceActive(services?.['regulatory_compliance']?.id),
    };
  }

  getOverviewSummary(): Observable<OverviewSummary> {
    return of({
      totalEnrollments: 57,
      activeLedRate: 0.793,
      completionRate: null,
      averageHoursPerLed: 7.81,
      requiredCoursesProgress: 0.2,
    }).pipe(delay(1000));
  }

  getOverviewTeamSummary(): Observable<OverviewTeamSummary> {
    return of({
      requiredEnrollments: [
        {
          id: '1',
          avatar: null,
          name: 'João Carlos da Silva',
          subtitle: 'Compliance Training 2024',
          data: '2025-10-03',
          ...ITEM_PROPERTIES,
        },
        {
          id: '2',
          avatar:
            'https://media-stage.keepsdev.com/myaccount/myaccount/user-avatar/31def203-d7c0-446e-aa16-16328002881d.png',
          name: 'Fernanda Rocha',
          subtitle: 'Compliance Training 2024',
          data: '2025-11-01',
          ...ITEM_PROPERTIES,
        },
        {
          id: '3',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/2127d42f-e3e3-4946-80f0-a4c2a1cc2b9d.jpg',
          name: 'Pedro Henrique',
          subtitle: 'Leadership Experience: Unleashing Your Full Potential',
          data: '2025-12-30',
          ...ITEM_PROPERTIES,
        },
        {
          id: '4',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/ef6600f1-f9b2-493b-9e7c-a171ce3105e2.jpg',
          name: 'Matilde Aritana',
          subtitle: 'Leadership Experience: Unleashing Your Full Potential',
          data: '2026-01-01',
          ...ITEM_PROPERTIES,
        },
        {
          id: '5',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/82614ce2-29cb-4ee8-8d26-9de91661003d.png',
          name: 'Maria Souza',
          subtitle: 'Compliance Training 2024',
          data: '2026-01-14',
          ...ITEM_PROPERTIES,
        },
      ],
      optionalEnrollments: [
        {
          id: '1',
          avatar: null,
          name: 'João Carlos da Silva',
          subtitle: 'Compliance Training 2024',
          data: '2025-10-03',
          ...ITEM_PROPERTIES,
        },
        {
          id: '2',
          avatar:
            'https://media-stage.keepsdev.com/myaccount/myaccount/user-avatar/31def203-d7c0-446e-aa16-16328002881d.png',
          name: 'Fernanda Rocha',
          subtitle: 'Compliance Training 2024',
          data: '2025-11-01',
          ...ITEM_PROPERTIES,
        },
        {
          id: '3',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/2127d42f-e3e3-4946-80f0-a4c2a1cc2b9d.jpg',
          name: 'Pedro Henrique',
          subtitle: 'Leadership Experience: Unleashing Your Full Potential',
          data: '2025-12-30',
          ...ITEM_PROPERTIES,
        },
        {
          id: '4',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/ef6600f1-f9b2-493b-9e7c-a171ce3105e2.jpg',
          name: 'Matilde Aritana',
          subtitle: 'Leadership Experience: Unleashing Your Full Potential',
          data: '2026-01-01',
          ...ITEM_PROPERTIES,
        },
        {
          id: '5',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/82614ce2-29cb-4ee8-8d26-9de91661003d.png',
          name: 'Maria Souza',
          subtitle: 'Compliance Training 2024',
          data: '2026-01-14',
          ...ITEM_PROPERTIES,
        },
      ],
      inactiveLed: [
        {
          id: '1',
          avatar: null,
          name: 'João Carlos da Silva',
          subtitle: 'Analista de RH',
          data: '2025-10-22',
          ...ITEM_PROPERTIES,
        },
        {
          id: '2',
          avatar:
            'https://media-stage.keepsdev.com/myaccount/myaccount/user-avatar/31def203-d7c0-446e-aa16-16328002881d.png',
          name: 'Fernanda Rocha',
          subtitle: 'Assistente de Vendas',
          data: '2025-11-01',
          ...ITEM_PROPERTIES,
        },
        {
          id: '3',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/2127d42f-e3e3-4946-80f0-a4c2a1cc2b9d.jpg',
          name: 'Pedro Henrique',
          subtitle: 'Estagiário de Marketing',
          data: '2025-11-10',
          ...ITEM_PROPERTIES,
        },
        {
          id: '4',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/ef6600f1-f9b2-493b-9e7c-a171ce3105e2.jpg',
          name: 'Matilde Aritana',
          subtitle: 'Vendedor Júnior',
          data: '2025-11-20',
          ...ITEM_PROPERTIES,
        },
        {
          id: '5',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/82614ce2-29cb-4ee8-8d26-9de91661003d.png',
          name: 'Maria Souza',
          subtitle: 'Analista de Vendas',
          data: '2025-11-30',
          ...ITEM_PROPERTIES,
        },
      ],
      expiringRegulations: [
        {
          id: '1',
          avatar: null,
          name: 'João Carlos da Silva',
          subtitle: 'Analista de RH',
          data: '2025-10-01',
          description: 'Compliance Trainig 2025',
          ...ITEM_PROPERTIES,
        },
        {
          id: '2',
          avatar:
            'https://media-stage.keepsdev.com/myaccount/myaccount/user-avatar/31def203-d7c0-446e-aa16-16328002881d.png',
          name: 'Fernanda Rocha',
          subtitle: 'Assistente de Vendas',
          data: '2025-11-11',
          description: 'Compliance Trainig 2025',
          ...ITEM_PROPERTIES,
        },
      ],
      teamRanking: [
        {
          id: '1',
          avatar: null,
          name: 'João Carlos da Silva',
          subtitle: 'Analista de RH',
          data: '2800',
          ...ITEM_PROPERTIES,
        },
        {
          id: '2',
          avatar:
            'https://media-stage.keepsdev.com/myaccount/myaccount/user-avatar/31def203-d7c0-446e-aa16-16328002881d.png',
          name: 'Fernanda Rocha',
          subtitle: 'Assistente de Vendas',
          data: '2650',
          ...ITEM_PROPERTIES,
        },
        {
          id: '3',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/2127d42f-e3e3-4946-80f0-a4c2a1cc2b9d.jpg',
          name: 'Pedro Henrique',
          subtitle: 'Estagiário de Marketing',
          data: '2500',
          ...ITEM_PROPERTIES,
        },
        {
          id: '4',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/ef6600f1-f9b2-493b-9e7c-a171ce3105e2.jpg',
          name: 'Matilde Aritana',
          subtitle: 'Vendedor Júnior',
          data: '1',
          ...ITEM_PROPERTIES,
        },
        {
          id: '5',
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/82614ce2-29cb-4ee8-8d26-9de91661003d.png',
          name: 'Maria Souza',
          subtitle: 'Analista de Vendas',
          data: '0',
          ...ITEM_PROPERTIES,
        },
      ],
    }).pipe(delay(2500));
  }
}
