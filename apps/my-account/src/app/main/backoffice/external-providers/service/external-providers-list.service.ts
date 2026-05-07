import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoursesApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { EditProviderFormComponent } from '../components/edit-form/edit-provider-form.component';
import { ProviderDto } from '../model/external-providers.dto';

@Injectable({
  providedIn: 'root',
})
export class ExternalProvidersListService {
  constructor(
    private dialog: MatDialog,
    private missionApi: CoursesApi,
  ) {}

  openDialogDelete() {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent);
    const title = 'Deletar Provedor';
    const confirmMessage = 'Você realmente deseja deletar esse Provedor?';
    dialogRef.componentInstance.confirmTitle = title;
    dialogRef.componentInstance.confirmMessage = confirmMessage;

    return dialogRef.afterClosed();
  }

  openDialogEdit(provider: ProviderDto) {
    this.dialog.open(EditProviderFormComponent, { width: '700px', data: provider });
  }

  deleteProvider(deletId: string) {
    return this.missionApi.deleteProvider(deletId);
  }

  updateProvider(id: string, formData: FormData) {
    return this.missionApi.updateProvider(id, formData);
  }
  loadProvider() {
    return this.missionApi.loadProviders();
  }
}
