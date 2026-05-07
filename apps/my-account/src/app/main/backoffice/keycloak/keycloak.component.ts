import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { environment } from 'environments/environment';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { KeycloakUser } from './keycloak';
import { MatIconAnchor, MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import Keycloak from 'keycloak-js';

const API = `${environment.keycloakConfig.url}/admin/realms`;
const REALM = environment.keycloakConfig.realm;

interface DatatableUser extends KeycloakUser {
  status: 'PENDENTE' | 'ERROR' | 'NAO_ENCONTRADO' | 'ATUALIZADO';
}

@Component({
  selector: 'app-keycloak',
  templateUrl: './keycloak.component.html',
  imports: [
    MatIconAnchor,
    MatIcon,
    MatTooltip,
    MatIconButton,
    MatButton,
    MatSlideToggle,
    FormsModule,
    MatDivider,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
  ],
})
export class KeycloakComponent {
  temporary: boolean;
  displayedColumns: string[];
  dataSource: Partial<DatatableUser>[];

  @ViewChild('fileUpload') fileUpload!: ElementRef;

  constructor(
    private _http: HttpClient,
    private _keycloak: Keycloak,
    private _progressService: FuseLoadingService,
  ) {
    this.displayedColumns = ['email', 'status'];
    this.dataSource = [];
    this.temporary = false;
  }

  onFileSelected({ target }: Event) {
    const file: File | undefined = (<HTMLInputElement>target)?.files?.[0];

    if (file) {
      const fr = new FileReader();

      fr.onload = () => {
        this.processCSV((fr.result as string) + '');
      };

      fr.readAsText(file);
    }
  }

  processCSV = (allText: string) => {
    const record_num = 2; // or however many elements there are in each row
    const allTextLines = allText.split(/\r\n|\n/);
    allTextLines[0].split(',').splice(0, record_num);
    const lines = [];

    for (const line of allTextLines.splice(1, allTextLines.length)) {
      if (!line.length) continue;
      const item = line.split(',');
      lines.push({
        temporary: false,
        password: item[1]?.trim(),
        email: item[0]?.trim(),
        status: 'PENDENTE',
      } as DatatableUser);
    }

    this.dataSource = lines;
  };

  execute() {
    this.updatePassword(this.dataSource);
  }

  reset() {
    this.fileUpload.nativeElement.value = '';
    this.dataSource = [];
  }

  updatePassword = (lines: any[]) => {
    this._progressService.show();
    for (const [i, line] of lines.entries()) {
      this.getUsers(line.email)
        .pipe(
          filter((users: any) => {
            const exist = users.length && users.map((x: DatatableUser) => x.email?.trim()).includes(line.email?.trim());
            if (!exist) this.dataSource[i].status = 'NAO_ENCONTRADO';
            return exist;
          }),
          map((users: any[]) => {
            const index = users.findIndex((x) => x.email?.trim() === line.email?.trim());
            return users[index];
          }),
          switchMap((user: any) => this.resetPassword(user.id, line.password, this.temporary)),
          catchError((error) => {
            console.error(error);
            this.dataSource[i].status = 'ERROR';
            this._progressService.hide();
            this.reset();
            return [];
          }),
        )
        .subscribe(() => {
          this.fileUpload.nativeElement.value = '';
          this.dataSource[i].status = 'ATUALIZADO';
          this._progressService.hide();
        });
    }
  };

  getUsers = (email: string) => {
    return this._http.get(`${API}/${REALM}/users`, {
      params: { email },
      headers: { Authorization: `Bearer ${this._keycloak.token}` },
    });
  };

  resetPassword = (id: string, value: string, temporary = false) => {
    return this._http.put(
      `${API}/${REALM}/users/${id?.trim()}/reset-password`,
      {
        temporary,
        value: value?.trim(),
      },
      { headers: { Authorization: `Bearer ${this._keycloak.token}` } },
    );
  };
}
