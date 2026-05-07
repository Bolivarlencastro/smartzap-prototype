import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {
  APPLICATION_TYPE,
  CAIXA_APPLICATION_TYPE,
  CaixaSmartZapUser,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { CourseEnrollmentFacade } from '../../facades/course-enrollment.facade';
import { CourseEnrollmentData, CourseEnrollmentViewModel } from '../../models';
import { CourseEnrollmentFormComponent } from '../../components/course-enrollment-form/course-enrollment-form.component';
import { UserLoginFacade } from '../../facades/user-login.facade';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'cx-course-enrollment-dialog',
  imports: [MatDialogModule, CourseEnrollmentFormComponent],
  template: `
    @let vm = viewModel();
    <div class="flex flex-col gap-5 p-5">
      <span class="text-xl">Inscreva-se no curso</span>
      @if (selectedUser()) {
        <span class="text-sm">Confirme os dados abaixo para inscrever-se no curso.</span>
      } @else {
        <span class="text-sm">Complete os dados abaixo para inscrever-se no curso.</span>
      }

      <cx-course-enrollment-form
        [user]="selectedUser()"
        [applicationType]="caixaAppType"
        [isSaving]="vm.isSaving"
        (enrollChange)="onSubmit($event)"
        (searchUser)="onSearchUser($event)"
        (clearUser)="onCleanUser()"
        (openPartnerSelection)="openPartnerSelection()"
      ></cx-course-enrollment-form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseEnrollmentDialogComponent implements OnDestroy {
  protected readonly viewModel: Signal<CourseEnrollmentViewModel>;
  protected readonly selectedUser: Signal<CaixaSmartZapUser>;

  constructor(
    private readonly facade: CourseEnrollmentFacade,
    private readonly loginFacade: UserLoginFacade,
    @Inject(APPLICATION_TYPE) protected caixaAppType: CAIXA_APPLICATION_TYPE,
  ) {
    this.viewModel = toSignal(facade.viewModel$);
    this.selectedUser = this.loginFacade.currentUser;
  }

  ngOnDestroy() {
    this.facade.reset();
  }

  onSubmit(courseEnrollmentData: CourseEnrollmentData) {
    this.facade.enrollOnCourse(courseEnrollmentData);
  }

  onSearchUser(cpf: string) {
    this.loginFacade.searchUser(cpf);
  }

  onCleanUser() {
    this.loginFacade.clearCurrentUser();
  }

  openPartnerSelection() {
    this.facade.openPartnerSelection();
  }
}
