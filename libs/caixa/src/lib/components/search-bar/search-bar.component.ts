import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { MatOption, MatSelect } from '@angular/material/select';
import { CaixaCourseCategory } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'cx-search-bar',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatFormField,
    MatPrefix,
    MatInput,
    FormsModule,
    MatSelect,
    MatOption,
    KpCategoryLabelPipe,
    TranslocoPipe,
  ],
  template: `
    <form class="flex flex-col md:flex-row items-center caixa-search-bar gap-4" [formGroup]="searchForm">
      <mat-form-field class="w-full md:w-1/3 bg-[#0B2C65] rounded-md" subscriptSizing="dynamic" appearance="outline">
        <mat-select placeholder="Produtos" class="text-white" formControlName="category_id">
          <mat-option [value]="null">Todos</mat-option>
          @for (category of categories(); track category.id) {
            <mat-option [value]="category.id">{{ category.name | kpCategoryLabel | transloco }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field class="w-full bg-[#0B2C65] rounded-md" subscriptSizing="dynamic" appearance="outline">
        <mat-icon matPrefix class="text-white">search</mat-icon>
        <input
          inputmode="search"
          matInput
          class="text-white"
          formControlName="search"
          autocomplete="off"
          placeholder="Pesquisar curso..."
        />
      </mat-form-field>
    </form>
  `,
})
export class SearchBarComponent {
  searchForm = new FormGroup({ search: new FormControl<string>(''), category_id: new FormControl<string>('') });
  filter = output<{ search: string; category_id: string }>();
  categories = input<CaixaCourseCategory[]>();

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(({ search, category_id }) => this.filter.emit({ search, category_id })),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
