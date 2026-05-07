import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CycleEnrollmentsComponent, CyclesListComponent, RegulatoryComplianceComponent } from './containers';
import { regulatoryComplianceCanActivate, regulatoryComplianceCanMatch } from './guards/regulatory-compliance';

const routes: Routes = [
  {
    path: '',
    component: RegulatoryComplianceComponent,
    children: [
      { path: '', redirectTo: 'management', pathMatch: 'full' },
      { path: 'creation', component: CyclesListComponent },
      { path: 'management', component: CycleEnrollmentsComponent },
    ],
    canMatch: [regulatoryComplianceCanMatch],
    canActivate: [regulatoryComplianceCanActivate],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegulatoryComplianceRoutingModule {}
