import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { map, startWith } from 'rxjs';
import { ContactsForm, CreationViewModel, ScheduleForm, TemplateForm } from '../../models/creation';
import { CreationActions, creationFeature } from '../../store';
import { ContactsStepComponent } from '../contacts-step/contacts-step.component';
import { ReviewStepComponent } from '../review-step/review-step.component';
import { ScheduleStepComponent } from '../schedule-step/schedule-step.component';
import { TemplateStepComponent } from '../template-step/template-step.component';

@Component({
  imports: [
    MatIcon,
    TranslocoPipe,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    TemplateStepComponent,
    ContactsStepComponent,
    ScheduleStepComponent,
    ReviewStepComponent,
    NgxSkeletonLoaderModule,
  ],
  template: `
    @let vm = this.vm();

    <div class="flex items-center gap-1">
      <button matIconButton (click)="goToPanel()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>{{ 'PUSH_MANAGER.CREATION.BACK_TO_PANEL' | transloco }}</span>
    </div>

    @if (vm?.loading) {
      <div class="flex flex-col gap-4 mt-5">
        <ngx-skeleton-loader
          count="1"
          animation="pulse"
          [theme]="{ height: '2rem', 'border-radius': '0.5rem', 'margin-bottom': '0' }"
        ></ngx-skeleton-loader>

        <ngx-skeleton-loader
          count="1"
          animation="pulse"
          [theme]="{ height: '20rem', 'border-radius': '1rem', 'margin-bottom': '0' }"
        ></ngx-skeleton-loader>
      </div>
    } @else {
      <mat-stepper linear animationDuration="0" (selectionChange)="revalidateIfStale($event)">
        <mat-step [stepControl]="templateForm">
          <ng-template matStepLabel>{{ 'PUSH_MANAGER.CREATION.TEMPLATE.LABEL' | transloco }}</ng-template>
          <pm-template-step [form]="templateForm" [templates]="vm?.templates" />
        </mat-step>
        <mat-step [stepControl]="scheduleForm">
          <ng-template matStepLabel>{{ 'PUSH_MANAGER.CREATION.SCHEDULE.LABEL' | transloco }}</ng-template>
          <pm-schedule-step [form]="scheduleForm" [courses]="vm?.courses" />
        </mat-step>
        <mat-step [stepControl]="contactsForm">
          <ng-template matStepLabel>{{ 'PUSH_MANAGER.CREATION.CONTACTS.LABEL' | transloco }}</ng-template>
          <pm-contacts-step
            [form]="contactsForm"
            [templateId]="templateId()"
            [templateVariables]="templateVariables()"
          />
        </mat-step>
        <mat-step>
          <ng-template matStepLabel>{{ 'PUSH_MANAGER.CREATION.REVIEW.LABEL' | transloco }}</ng-template>
          <pm-review-step
            [templateForm]="templateForm"
            [scheduleForm]="scheduleForm"
            [contactsForm]="contactsForm"
            [templates]="vm?.templates"
          />
        </mat-step>
      </mat-stepper>
    }
  `,
  styles: `
    :host {
      @apply p-9;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreationComponent implements OnDestroy {
  vm: Signal<CreationViewModel>;

  templateForm: FormGroup<TemplateForm>;
  contactsForm: FormGroup<ContactsForm>;
  scheduleForm: FormGroup<ScheduleForm>;
  readonly templateId: Signal<string>;
  readonly templateVariables: Signal<string>;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly store: Store,
  ) {
    store.dispatch(CreationActions.loadData());
    this.vm = toSignal(store.select(creationFeature.selectViewModel));

    this.initForms();

    this.templateId = toSignal(this.templateForm.get('templateId').valueChanges.pipe(startWith(null as string)));

    this.templateVariables = toSignal(
      this.templateForm.get('variables').valueChanges.pipe(
        startWith(this.templateForm.get('variables').value),
        map((vars) => JSON.stringify(vars)),
      ),
    );
  }

  ngOnDestroy() {
    this.store.dispatch(CreationActions.reset());
  }

  goToPanel() {
    this.router.navigate(['/push-manager/panel']);
  }

  revalidateIfStale(event: StepperSelectionEvent) {
    if (event.selectedIndex !== 3) {
      return;
    }

    const file = this.contactsForm.get('contacts')?.value;
    const templateId = this.templateForm.get('templateId')?.value;
    const templateVariables = JSON.stringify(this.templateForm.get('variables').getRawValue() ?? {});

    const validatedWith = this.vm()?.validatedWith;
    const isStale =
      !validatedWith ||
      validatedWith.templateId !== templateId ||
      validatedWith.templateVariables !== templateVariables;

    if (isStale) {
      this.store.dispatch(
        CreationActions.validateCampaign({ template_id: templateId, file, template_variables: templateVariables }),
      );
    }
  }

  private initForms() {
    this.templateForm = this.fb.group<TemplateForm>({
      templateId: new FormControl(null, Validators.required),
      variables: this.fb.group({}),
    });

    this.contactsForm = this.fb.group<ContactsForm>({
      contacts: new FormControl(null, Validators.required),
    });

    this.scheduleForm = this.fb.group<ScheduleForm>({
      courseId: new FormControl(null),
      courseName: new FormControl(null),
      campaign: new FormControl(null),
      date: new FormControl(null, Validators.required),
      hour: new FormControl(null, Validators.required),
    });
  }
}
