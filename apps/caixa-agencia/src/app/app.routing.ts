import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { caixaRoutes } from '@keeps-platform-frontend-workspace/caixa';

@NgModule({
  imports: [RouterModule.forRoot(caixaRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
