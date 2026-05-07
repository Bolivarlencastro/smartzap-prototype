import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { prototypeNavigation } from '@core/prototype/prototype-fixtures';
import { ActivityService, ContentService, ProgressBarService } from '@core/services';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ActivityContentTypes, Tracker } from '@keeps-platform-frontend-workspace/ui/kp-viewer';
import { environment } from 'environments/environment';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  standalone: false,
})
export class ContentComponent implements OnInit {
  prototypeMode = environment.prototypeMode;
  prototypeHomePath = environment.prototypeHomePath;
  prototypeNavigation = prototypeNavigation;
  redirectUrl = this.getReturnPhone(this._activatedRoute.snapshot.queryParamMap);
  supportUrl = environment.keepsSupport;
  activityId: string;
  type = ActivityContentTypes;
  data: any;
  isSurveyQuiz: boolean;
  workspaceIconUrl: string;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _progressBarService: ProgressBarService,
    private readonly _activityService: ActivityService,
    private readonly _examService: ContentService,
    private readonly _workspaceService: WorkspaceService,
  ) {}

  ngOnInit(): void {
    this._activatedRoute.data
      .pipe(
        map((response) => response['data']),
        tap((data) => {
          this.data = data;
          this.isSurveyQuiz = data.exam_type === 'SURVEY';
        }),
      )
      .subscribe();

    this.activityId = this._activityService.getActivityId();
    this.workspaceIconUrl = this._workspaceService.getCurrentWorkspace()?.icon_url;
  }

  close() {
    window.close();
  }

  get isPrototypeFallback(): boolean {
    return !!this.data?.prototype?.isFallback;
  }

  onTracker(tracker: Tracker) {
    this._activityService.registry(tracker).subscribe();
  }

  onAnswerer(data: any): void {
    this._progressBarService.show();

    this._examService
      .createAnswerer(data)
      .pipe(
        tap((answer) => this.updateQuizObject(answer)),
        tap(() => this._progressBarService.hide()),
      )
      .subscribe();
  }

  updateQuizObject(answer: any) {
    const quiz = this.data;
    let { user_answers } = quiz;
    user_answers = [...user_answers, ...answer];
    this.data = { ...quiz, user_answers };
  }

  onReturn(url: string): void {
    if (this.activityId) {
      this._activityService.leave().subscribe();
    }
    this._activityService.return(url);
  }

  private getReturnPhone(paramMap: ParamMap): string {
    const phone = paramMap.get('phone');
    return phone && phone !== 'None' ? `https://wa.me/${phone}` : environment.whatsappUrlRedirect;
  }
}
