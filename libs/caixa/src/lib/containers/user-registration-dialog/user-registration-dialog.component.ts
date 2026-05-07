import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { CaixaSmartZapUserSignUpDto, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { UserRegistrationFacade } from '../../facades/user-registration.facade';
import { UserRegistrationViewModel } from '../../models';
import { UserRegistrationFormComponent } from '../../components/user-registration-form/user-registration-form.component';

@Component({
  selector: 'cx-user-registration-dialog',
  imports: [MatDialogContent, AsyncPipe, UserRegistrationFormComponent],
  template: `
    <div class="text-xl px-5 pt-5">Cadastre-se</div>

    <div mat-dialog-content>
      <div class="text-sm mb-5">Complete os campos abaixo para realizar seu cadastro na Escola de Negócios.</div>

      @if (viewModel$ | async; as viewModel) {
        <cx-user-registration-form
          [partners]="viewModel.partners"
          [viewMode]="viewModel.viewMode"
          [isSaving]="viewModel.isSaving"
          (userSignUp)="signUpUser($event)"
          (setPartnerType)="setPartnerType($event)"
          (partnerSearchChange)="onSearchPartner($event)"
        ></cx-user-registration-form>
      }
    </div>
  `,
})
export class UserRegistrationDialogComponent implements OnDestroy {
  protected readonly viewModel$: Observable<UserRegistrationViewModel>;

  constructor(private readonly facade: UserRegistrationFacade) {
    this.viewModel$ = facade.viewModel$;
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  onSearchPartner(term: string) {
    this.facade.searchPartner(term);
  }

  setPartnerType(partnerType: PartnerType) {
    this.facade.setPartnerType(partnerType);
  }

  signUpUser(userSignUpDto: CaixaSmartZapUserSignUpDto) {
    this.facade.signUpUser(userSignUpDto);
  }
}
