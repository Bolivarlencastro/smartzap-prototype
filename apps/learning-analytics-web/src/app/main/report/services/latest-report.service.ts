import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatbotAnalyticsComponent } from '@keeps-platform-frontend-workspace/chatbot-analytics';
import { AuthService, ChatbotDialogData, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LatestReportFilter } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class LatestReportService {
  constructor(
    private _authService: AuthService,
    private _userProfileService: UserProfileService,
    private _dialog: MatDialog,
  ) {}

  updateFilter(filter: LatestReportFilter): LatestReportFilter {
    if (this._userProfileService.isAnalyticsLeader()) {
      return { ...filter, user_creator_id: this._authService.userId };
    }
    return filter;
  }

  openChatbotDialog(data: ChatbotDialogData) {
    this._dialog.open(ChatbotAnalyticsComponent, {
      autoFocus: false,
      width: '90vw',
      maxWidth: '1100px',
      height: '90vh',
      data,
    });
  }
}
