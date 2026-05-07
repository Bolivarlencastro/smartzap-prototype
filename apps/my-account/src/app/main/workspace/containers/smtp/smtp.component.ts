import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SMTPFilterForm, SMTPService } from './smtp.service';

@Component({
  selector: 'app-smtp',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="text-2xl mb-8">Connection & Authentication</div>
    <form [formGroup]="form" class="flex flex-col gap-3">
      <div class="flex items-center">
        <div class="label">Habilitar notificação por email</div>
        <mat-slide-toggle
          [checked]="enableEmailNotifications()"
          (change)="onToggleEmailNotifications($event)"
        ></mat-slide-toggle>
      </div>

      <div class="flex items-center">
        <div class="label">Usar SMTP próprio</div>
        <mat-slide-toggle
          [checked]="useOwnSMTP()"
          [disabled]="!enableEmailNotifications()"
          (change)="onToggleUseOwnSMTP($event)"
        ></mat-slide-toggle>
      </div>

      <div class="flex items-center">
        <div class="label">Secure</div>
        <mat-slide-toggle formControlName="secure"></mat-slide-toggle>
      </div>

      <div class="flex items-center">
        <div class="label">Reject Unauthorized</div>
        <mat-slide-toggle formControlName="rejectUnauthorized"></mat-slide-toggle>
      </div>

      <div class="flex items-center">
        <div class="label">Host <span class="text-red-500">*</span></div>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <input matInput formControlName="host" />
        </mat-form-field>
      </div>

      <div class="flex items-center">
        <div class="label">Port</div>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <input type="number" matInput formControlName="port" placeholder="SMTP port (default to 25)" />
        </mat-form-field>
      </div>

      <div class="flex items-center">
        <div class="label">Sender Email</div>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <input matInput formControlName="senderEmail" />
        </mat-form-field>
      </div>

      <div class="flex items-center">
        <div class="label">Username <span class="text-red-500">*</span></div>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <input matInput formControlName="user" />
        </mat-form-field>
      </div>

      <div class="flex items-center">
        <div class="label">Password <span class="text-red-500">*</span></div>
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" />
          <button class="mr-2" mat-icon-button matSuffix (click)="onTogglePasswordVisibility()" type="button">
            <mat-icon>{{ hidePassword ? 'visibility' : 'visibility_off' }}</mat-icon>
          </button>
        </mat-form-field>
      </div>

      <div class="authentication-notice flex items-center gap-2 p-2">
        <mat-icon class="text-primary">info</mat-icon>
        <span class="text-sm text-primary"
          >When testing the connection an e-mail will be sent to the current user.</span
        >
      </div>

      <div class="mt-4 flex gap-2 submit-buttons">
        <button type="button" mat-flat-button color="primary" [disabled]="disbleSubmit" (click)="onSubmit()">
          Save
        </button>
        <button
          type="button"
          mat-flat-button
          color="primary"
          [disabled]="disableTestConnection"
          (click)="onTestConnection()"
        >
          Test connection
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        padding: 1rem;
      }

      mat-form-field {
        width: 60vw;
        max-width: 600px;
      }

      .label {
        width: 230px;
        flex-shrink: 0;
      }

      .authentication-notice {
        @apply dark:bg-[var(--kp-primary-300)];

        border-top: 3px solid var(--kp-primary-500);
        background-color: var(--kp-primary-100);
        width: 60vw;
        max-width: 600px;
      }

      .authentication-notice,
      .submit-buttons {
        margin-left: 230px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SMTPComponent implements OnInit {
  form: FormGroup<SMTPFilterForm>;
  hidePassword = true;

  enableEmailNotifications = signal(false);
  useOwnSMTP = signal(false);
  isConnectionTested = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  get disbleSubmit(): boolean {
    return (
      !this.enableEmailNotifications() ||
      !this.useOwnSMTP() ||
      this.form.invalid ||
      this.form.pristine ||
      !this.isConnectionTested()
    );
  }

  get disableTestConnection(): boolean {
    return !this.enableEmailNotifications() || !this.useOwnSMTP() || this.form.invalid || this.isConnectionTested();
  }

  constructor(
    private fb: FormBuilder,
    private smtpService: SMTPService,
  ) {
    this.form = this.buildForm(fb);
    this.listenFormChanges();
    this.configFormState();
  }

  ngOnInit(): void {
    this.patchForm();
  }

  onTogglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    this.smtpService.save(this.form.value).subscribe();
  }

  onTestConnection() {
    this.smtpService.testConnection(this.form.value).subscribe(() => this.isConnectionTested.set(true));
  }

  onToggleEmailNotifications(event: MatSlideToggleChange) {
    const value = event.checked;
    this.enableEmailNotifications.set(value);
    this.smtpService.updateEmailSendingStatus(value).subscribe();
  }

  onToggleUseOwnSMTP(event: MatSlideToggleChange) {
    const value = event.checked;
    this.useOwnSMTP.set(value);
    this.smtpService.updateUseOwnSMTPStatus(value).subscribe();
  }

  private buildForm(fb: FormBuilder): FormGroup<SMTPFilterForm> {
    return fb.group({
      host: new FormControl(null, Validators.required),
      port: new FormControl(null),
      user: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      senderEmail: new FormControl(null, Validators.email),
      secure: new FormControl(false),
      rejectUnauthorized: new FormControl(false),
    });
  }

  private patchForm() {
    this.smtpService.fetchSMTPData().subscribe((res) => {
      this.enableEmailNotifications.set(res.enable_email_notifications);
      this.useOwnSMTP.set(res.use_own_smtp);

      this.form.patchValue({
        host: res.host,
        port: res.port,
        user: res.user,
        senderEmail: res.sender_email,
        secure: res.secure || false,
        rejectUnauthorized: res.reject_unauthorized || false,
      });
    });
  }

  private listenFormChanges() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.isConnectionTested()) {
        this.isConnectionTested.set(false);
      }
    });
  }

  private configFormState() {
    effect(() => {
      const enableEmailNotifications = this.enableEmailNotifications();
      const useOwnSMTP = this.useOwnSMTP();

      const controlsToToggle = ['host', 'port', 'user', 'password', 'senderEmail', 'secure', 'rejectUnauthorized'];

      if (enableEmailNotifications) {
        controlsToToggle.forEach((control) => {
          if (useOwnSMTP) {
            this.form.get(control).enable();
          } else {
            this.form.get(control).disable();
          }
        });
      } else {
        controlsToToggle.forEach((control) => this.form.get(control).disable());
      }

      this.form.updateValueAndValidity();
    });
  }
}
