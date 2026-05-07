import { Injectable } from '@angular/core';
import { CaixaApi } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {
  constructor(private readonly http: CaixaApi) {}

  loadUserEnrollments(userId: string) {
    return this.http.getUserEnrollments(userId);
  }
}
