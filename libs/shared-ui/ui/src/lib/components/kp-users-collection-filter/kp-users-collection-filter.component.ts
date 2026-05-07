import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { KpExportFormat, KpExportMenuComponent } from '../kp-export-menu';

@Component({
  selector: 'kp-users-collection-filter',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    KpExportMenuComponent,
  ],
  template: `
    <div class="flex gap-4 items-center">
      <button mat-icon-button (click)="onOpenFilters()">
        <mat-icon>filter_list</mat-icon>
      </button>
      <mat-form-field color="primary" appearance="outline" subscriptSizing="dynamic" class="w-80">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput [formControl]="searchControl" [placeholder]="placeholder" />
      </mat-form-field>

      <kp-export-menu class="ml-auto" (export)="onTableExport($event)" [disabled]="exportDisabled"></kp-export-menu>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpUsersCollectionFilterComponent implements OnDestroy {
  @Input() placeholder!: string;
  @Input() exportDisabled!: boolean;
  @Output() openFilter = new EventEmitter<void>();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() exportTable = new EventEmitter<KpExportFormat>();
  protected readonly searchControl = new FormControl('');
  private readonly unsubscribe = new Subject<void>();

  constructor() {
    this.registerFormValueChanges();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onTableExport(format: KpExportFormat): void {
    this.exportTable.emit(format);
  }

  onOpenFilters() {
    this.openFilter.emit();
  }

  private registerFormValueChanges(): void {
    this.searchControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(200), takeUntil(this.unsubscribe))
      .subscribe((value) => this.searchTermChanged.emit(value ?? undefined));
  }
}
