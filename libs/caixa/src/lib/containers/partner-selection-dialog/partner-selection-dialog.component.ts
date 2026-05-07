import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { PartnerSelectionViewModel } from '../../models';
import { PartnerSelectionFacade } from '../../facades/partner-selection.facade';
import { PartnerSelectionFormComponent } from '../../components/partner-selection-form/partner-selection-form.component';
import { CaixaPartner, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'cx-partner-selection-dialog',
  imports: [PartnerSelectionFormComponent, MatDialogContent],
  template: `
    @let vm = viewModel();
    <div class="text-xl px-5 pt-5">Definir CCA/Lotérica</div>

    <div mat-dialog-content>
      <cx-partner-selection-form
        [viewMode]="vm.viewMode"
        [partners]="vm.partners"
        (partnerSearchChange)="onSearchPartner($event)"
        (setPartnerType)="onSetPartnerType($event)"
        (partnerSelected)="onPartnerSelected($event)"
      ></cx-partner-selection-form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerSelectionDialogComponent implements OnDestroy {
  protected readonly viewModel: Signal<PartnerSelectionViewModel>;

  constructor(private readonly facade: PartnerSelectionFacade) {
    this.viewModel = facade.viewModel;
  }

  ngOnDestroy() {
    this.facade.reset();
  }

  protected onSearchPartner(search: string) {
    this.facade.searchPartner(search);
  }

  protected onSetPartnerType(partnerType: PartnerType) {
    this.facade.setPartnerType(partnerType);
  }

  protected onPartnerSelected(partner: CaixaPartner) {
    this.facade.selectPartner(partner);
  }
}
