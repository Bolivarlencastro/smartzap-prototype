import { Injectable } from '@angular/core';
import { SmartzapApi } from '@core/api';
import { Content } from '@core/model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

interface Answerer {
  questionId: string;
  optionId: string[];
  isTextInputType?: boolean;
}

interface AnswererBodyModel {
  user_id: string;
  questions: { id: string; options?: string[]; text_response?: string }[];
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private _url = '/view/content';

  constructor(
    private _http: SmartzapApi,
    private _authService: AuthService,
  ) {}

  fetchContent(id: string): Observable<Content> {
    return this._http.get<Content>(`${this._url}/${id}`);
  }

  createAnswerer({ questionId, optionId, isTextInputType }: Answerer): any {
    const body: AnswererBodyModel = { user_id: this._authService.userId, questions: null };

    if (isTextInputType) {
      body.questions = [
        {
          id: questionId,
          text_response: optionId?.[0],
        },
      ];
    } else {
      body.questions = [
        {
          id: questionId,
          options: optionId,
        },
      ];
    }

    return this._http.post(`/view/answers`, body);
  }
}
