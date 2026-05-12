import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { CustomCertificateDto, CustomCertificatesApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Course } from 'app/main/courses/model';

@Component({
  selector: 'app-course-form-settings',
  template: `
    <form [formGroup]="form" class="course-form-step" (ngSubmit)="onSubmit()">
      <div class="course-form-step__header">
        <div>
          <h2>{{ 'COURSE.FORM.TABS.CONFIGURATIONS' | transloco }}</h2>
          <p>{{ 'COURSE.FORM.NAVIGATION.CONFIGURATIONS' | transloco }}</p>
        </div>
        <div class="course-form-step__actions">
          <a mat-stroked-button [routerLink]="['/courses', course.id, 'form', 'images']">{{
            'GENERAL.PREVIOUS' | transloco
          }}</a>
          <button mat-flat-button color="primary" [disabled]="form.invalid || isLoadingCourse" type="submit">
            {{ 'GENERAL.SAVE_AND_ADVANCE' | transloco }}
          </button>
        </div>
      </div>

      <div class="course-form-step__content">
        <div class="course-form-step__body">
          <div class="settings-container w-full">
            <div class="flex w-full justify-between items-center">
              <span>{{ 'COURSE.FORM.INPUT.IS_ACTIVE' | transloco }}</span>
              <mat-slide-toggle color="accent" formControlName="is_active" aria-label="Ativo" id="toggle-form-active">
              </mat-slide-toggle>
            </div>

            <div class="flex w-full justify-between items-center">
              <span>{{ 'COURSE.FORM.INPUT.DISABLE_SENDING_CERTIFICATE' | transloco }}</span>
              <mat-slide-toggle
                color="accent"
                formControlName="disable_send_certificate"
                aria-label="disable sending certificate"
                id="toggle-disable-sending-certificate"
              >
              </mat-slide-toggle>
            </div>

            <div class="flex w-full justify-between items-center">
              <span>{{ 'COURSE.FORM.INPUT.ENABLE_NATIVE_NPS' | transloco }}</span>
              <mat-slide-toggle
                color="accent"
                formControlName="enable_native_nps"
                aria-label="Ativar NPS nativo"
                id="toggle-enable-native-nps"
              >
              </mat-slide-toggle>
            </div>

            <div class="flex w-full justify-between items-center py-4">
              <div class="flex flex-col gap-1">
                <span>{{ 'COURSE.FORM.INPUT.CERTIFICATE' | transloco }}</span>
              </div>
              <mat-form-field appearance="outline" class="w-72">
                <mat-select
                  formControlName="certificate_id"
                  [placeholder]="'COURSE.FORM.INPUT.CERTIFICATE_PLACEHOLDER' | transloco"
                >
                  <mat-option [value]="null">
                    {{ 'COURSE.FORM.INPUT.CERTIFICATE_PLACEHOLDER' | transloco }}
                  </mat-option>
                  @for (cert of certificates; track cert.id) {
                    <mat-option [value]="cert.id">{{ cert.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [
    `
      .course-form-step {
        display: flex;
        flex-direction: column;
        min-height: calc(100% + 6rem);
        margin: -3rem;
        background: var(--course-form-surface, #f7f1f8);
      }

      .course-form-step__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        height: var(--course-form-column-header-height, 160px);
        padding: 24px 48px;
        background: var(--course-form-surface, #f7f1f8);
        box-sizing: border-box;
      }

      .course-form-step__header > :first-child {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .course-form-step__header h2 {
        margin: 0 0 8px;
        font-size: 1.5rem;
        font-weight: 900;
      }

      .course-form-step__header p {
        margin: 0;
        color: rgb(32 25 40 / 68%);
      }

      .course-form-step__actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        align-self: center;
      }

      .course-form-step__body {
        padding: 48px;
      }

      .course-form-step__content {
        flex: 1;
        border-top: 1px solid var(--course-form-divider, var(--mat-sys-outline-variant));
      }

      .settings-container > * {
        @apply border-b last:border-b-0 border-default min-h-20 pr-4;
      }

      @media (width <= 768px) {
        .course-form-step {
          min-height: auto;
        }

        .course-form-step__header,
        .course-form-step__actions {
          flex-direction: column;
          align-items: stretch;
        }

        .course-form-step__header {
          height: auto;
          padding: 24px 16px;
        }

        .course-form-step__body {
          padding: 16px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatAnchor,
    MatButton,
    MatSlideToggle,
    MatFormFieldModule,
    MatSelectModule,
    RouterLink,
    TranslocoPipe,
  ],
})
export class CourseFormSettingsComponent implements OnInit {
  @Input() course!: Course;
  @Input() isLoadingCourse!: boolean;
  @Output() save = new EventEmitter<Partial<Course>>();

  form!: UntypedFormGroup;
  certificates: CustomCertificateDto[] = [];

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly certificatesApi: CustomCertificatesApi,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      is_active: [this.course.is_active],
      disable_send_certificate: [this.course.disable_send_certificate],
      enable_native_nps: [this.course.enable_native_nps ?? false],
      certificate_id: [this.course.certificate_id ?? null],
    });

    this.certificatesApi.list({ template: 'mission', per_page: 100 }).subscribe({
      next: (response) => {
        this.certificates = response.data;
      },
    });
  }

  onSubmit(): void {
    const { id } = this.course;
    this.save.emit({ id, ...this.form.getRawValue() });
  }
}
