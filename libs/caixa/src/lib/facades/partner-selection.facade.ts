import { Injectable, Signal } from '@angular/core';
import { PartnerSelectionViewModel } from '../models';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { PartnerSelectionActions, partnerSelectionFeature } from '../store';
import { CaixaPartner, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class PartnerSelectionFacade {
  readonly viewModel: Signal<PartnerSelectionViewModel>;

  constructor(private readonly store: Store) {
    this.viewModel = toSignal(this.store.select(partnerSelectionFeature.selectViewModel));
  }

  setPartnerType(partnerType: PartnerType) {
    this.store.dispatch(PartnerSelectionActions.setPartnerType({ partnerType }));
  }

  reset() {
    this.store.dispatch(PartnerSelectionActions.reset());
  }

  searchPartner(search: string) {
    this.store.dispatch(PartnerSelectionActions.searchPartner({ search }));
  }

  selectPartner(partner: CaixaPartner) {
    this.store.dispatch(PartnerSelectionActions.selectPartner({ partner }));
  }
}
