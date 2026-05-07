import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import { Observable, take, tap } from 'rxjs';

export interface SMTPData {
  use_own_smtp: boolean;
  enable_email_notifications: boolean;
  host: string;
  port: number;
  user: string;
  sender_email: string;
  secure: boolean;
  reject_unauthorized: boolean;
}

export interface SMTPModel<S, N, B> {
  host: S;
  port: N;
  user: S;
  password: S;
  senderEmail: S;
  secure: B;
  rejectUnauthorized: B;
}

export type SMTPFilter = SMTPModel<string, number, boolean>;
export type SMTPFilterForm = SMTPModel<FormControl<string>, FormControl<number>, FormControl<boolean>>;

@Injectable({ providedIn: 'root' })
export class SMTPService {
  constructor(
    private http: MyAccountV2API,
    private messageService: KpMessageService,
  ) {}

  fetchSMTPData(): Observable<SMTPData> {
    return this.http.get<SMTPData>('/smtp/config').pipe(take(1));
  }

  testConnection(data: Partial<SMTPFilter>) {
    return this.http.post('/smtp/config/test', data).pipe(
      take(1),
      tap({
        next: () => this.messageService.success('Conexão bem-sucedida!'),
        error: () => this.messageService.error('Falha na conexão.'),
      }),
    );
  }

  save(data: Partial<SMTPFilter>) {
    return this.http.post('/smtp/config', data).pipe(
      take(1),
      tap({
        next: () => this.messageService.success('Configurações salvas!'),
        error: () => this.messageService.error('Erro ao salvar.'),
      }),
    );
  }

  updateEmailSendingStatus(enabled: boolean) {
    return this.http.post('/smtp/config/email-sending-status', { enabled }).pipe(
      take(1),
      tap({
        next: () => this.messageService.success('Configurações salvas!'),
        error: () => this.messageService.error('Erro ao salvar.'),
      }),
    );
  }

  updateUseOwnSMTPStatus(useCustomSmtp: boolean) {
    return this.http.post('/smtp/config/custom-smtp-status', { useCustomSmtp }).pipe(
      take(1),
      tap({
        next: () => this.messageService.success('Configurações salvas!'),
        error: () => this.messageService.error('Erro ao salvar.'),
      }),
    );
  }
}
