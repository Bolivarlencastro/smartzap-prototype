import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { KeepsUtils, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, debounceTime, filter, switchMap } from 'rxjs';
import { TransferUserEnrollmentService } from './services/transfer-user-enrollment.service';

@Component({
  selector: 'app-transfer-user-enrollments',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [TransferUserEnrollmentService],
  templateUrl: './transfer-user-enrollments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferUserEnrollmentsComponent implements OnInit {
  sourceUser$: Observable<UserProfile[]>;
  targetUser$: Observable<UserProfile[]>;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transferEnrollmentService: TransferUserEnrollmentService,
    private messageService: KpMessageService,
  ) {
    this.form = this.fb.group({
      sourceUser: ['', KeepsUtils.objectKeyValidator('id', true)],
      targetUser: ['', KeepsUtils.objectKeyValidator('id', true)],
    });
  }

  ngOnInit(): void {
    this.initAutoComplete();
  }

  initAutoComplete() {
    this.sourceUser$ = this.form.get('sourceUser').valueChanges.pipe(
      debounceTime(250),
      filter((value) => typeof value === 'string'),
      switchMap((search: string) => this.transferEnrollmentService.fetchUsers(search)),
    );

    this.targetUser$ = this.form.get('targetUser').valueChanges.pipe(
      debounceTime(250),
      filter((value) => typeof value === 'string'),
      switchMap((search: string) => this.transferEnrollmentService.fetchUsers(search)),
    );
  }

  displayWithFn(user: UserProfile) {
    return user?.id;
  }

  onSubmit() {
    const body = {
      source_user_id: this.form.get('sourceUser').value.id,
      target_user_id: this.form.get('targetUser').value.id,
    };
    this.transferEnrollmentService.transferEnrollments(body).subscribe(
      () => {
        this.messageService.success('Matrícula transferida com sucesso!');
      },
      () => {
        this.messageService.error('Ocorreu algum erro durante a transferência!');
      },
    );
    this.form.reset();
  }
}
