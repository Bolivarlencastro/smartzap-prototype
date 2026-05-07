import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatInput } from '@angular/material/input';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatPrefix } from '@angular/material/form-field';

export interface GlobalSearchInputForm {
  search: FormControl<string>;
}

@Component({
  selector: 'kp-global-search-input',
  templateUrl: './kp-global-search-input.component.html',
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatIcon, MatPrefix, NgClass, MatInput, TranslocoPipe],
})
export class KpGlobalSearchInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input() searchTerm: string;
  @Input() iconClass: string;
  @Input() inputClass = 'text-xl';
  @Input() placeholder = 'UI.GLOBAL_SEARCH.DEFAULT_PLACEHOLDER';
  @Output() filterEvent = new EventEmitter<string>();

  private _unsubscribeAll: Subject<any>;
  protected readonly form: FormGroup<GlobalSearchInputForm>;

  constructor(private _formBuilder: FormBuilder) {
    this._unsubscribeAll = new Subject();
    this.form = this.buildForm(_formBuilder);
  }

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value) => value !== this.searchTerm),
        tap((value) => this.filterEvent.emit(value)),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['searchTerm']) {
      this.form.get('search').setValue(this.searchTerm);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  get search(): AbstractControl<string> {
    return this.form.get('search');
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<GlobalSearchInputForm> {
    return formBuilder.group<GlobalSearchInputForm>({
      search: new FormControl(''),
    });
  }
}
