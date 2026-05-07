import { Injectable } from '@angular/core';
import {
  Gamification,
  GamificationApi,
  GamificationField,
  GamificationItem,
  GamificationMenuResponse,
  GamificationSubModule,
  Service,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { combineLatest, map, Observable } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable({ providedIn: 'root' })
export class GamificationService {
  private readonly GAMIFICATION_ID = environment.apps.konquest.services.gamification.id;

  constructor(
    private messageService: KpMessageService,
    private gamificationAPI: GamificationApi,
    private workspaceService: WorkspaceService,
  ) {}

  fetchGamification(): Observable<Gamification | undefined> {
    return this.workspaceService.workspaceServices$.pipe(
      map((services) => this.findGamificationModule(services)),
      map((isModuleActivated) => this.buildData(isModuleActivated)),
    );
  }

  fetchGamificationSubModules(): Observable<Gamification> {
    return this.gamificationAPI.getGamificationSubModules().pipe(map((subModules) => this.buildSubModules(subModules)));
  }

  fetchGamificationMenu(): Observable<GamificationMenuResponse> {
    const combined$ = combineLatest([
      this.gamificationAPI.getGeneralRanking({ page: 1, per_page: 10 }),
      this.gamificationAPI.getStatisticsUser(),
    ]);

    return combined$.pipe(map(([ranking, statistics]) => ({ partialRanking: ranking.results, statistics })));
  }

  fetchPersonalScore(): Observable<number> {
    return this.gamificationAPI.getStatisticsUser().pipe(map((statistics) => statistics.total_points));
  }

  updateGamificationSubModules(item: GamificationItem, value: boolean): Observable<GamificationSubModule> {
    const data = { ranking: item.ranking, status: value };
    return this.gamificationAPI.updateGamificationSubModule(item.id, data).pipe(
      map(() => {
        this.messageService.success(this.getSuccessMessage(item.field, value));
        return { ...item, status: value };
      }),
    );
  }

  private getSuccessMessage(field: string, value: boolean): string {
    return `GAMIFICATION.SUCCESS_MESSAGE.${GamificationField[field]}.${value ? 'ENABLED' : 'DISABLED'}`;
  }

  private findGamificationModule(services: Service[]): boolean {
    return !!services?.find((service) => service.id === this.GAMIFICATION_ID);
  }

  private buildData(isModuleActivated: boolean): Gamification | undefined {
    if (isModuleActivated) {
      return undefined;
    }

    return { gamification: { status: false }, subModules: null };
  }

  private buildSubModules(subModules: GamificationSubModule[]): Gamification {
    return { gamification: { status: true }, subModules };
  }
}
