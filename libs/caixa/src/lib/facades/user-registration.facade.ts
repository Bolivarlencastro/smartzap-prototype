import { Injectable } from '@angular/core';
import { CaixaSmartZapUserSignUpDto, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserRegistrationActions } from '../store/actions';
import { userRegistrationFeature } from '../store/features';
import { UserRegistrationViewModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationFacade {
  readonly viewModel$: Observable<UserRegistrationViewModel>;

  constructor(private readonly store: Store) {
    this.viewModel$ = store.select(userRegistrationFeature.selectViewModel);
  }

  setPartnerType(partnerType: PartnerType) {
    this.store.dispatch(UserRegistrationActions.setPartnerType({ partnerType }));
  }

  reset() {
    this.store.dispatch(UserRegistrationActions.reset());
  }

  searchPartner(search: string) {
    this.store.dispatch(UserRegistrationActions.searchPartner({ search }));
  }

  signUpUser(userSignUpDto: CaixaSmartZapUserSignUpDto) {
    this.store.dispatch(UserRegistrationActions.signUpUser({ userSignUpDto }));
  }
}
