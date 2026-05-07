import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterGroupConfig } from '../../model/filter-group-config';
import { FilterGroupConnector, FilterGroupConnectors } from '../../model/filter-group-connector';
import { FilterGroupDefaultOperators, FilterGroupOperator } from '../../model/filter-group-operator';
import { FilterFormGroup } from '../../model/forms-models';
import { ReportFilterDialogService } from '../../services/report-filter-dialog.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { FilterGroupValueComponent } from '../filter-group-value/filter-group-value.component';
import { MatOption } from '@angular/material/core';
import { FilterDialogSelectorTemplateComponent } from '../filter-dialog-selector-template/filter-dialog-selector-template.component';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'kp-filter-group',
  templateUrl: './filter-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatSelectTrigger,
    FilterDialogSelectorTemplateComponent,
    MatOption,
    FilterGroupValueComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    TitleCasePipe,
    TranslocoPipe,
  ],
})
export class FilterGroupComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filterFormGroup: FormGroup<FilterFormGroup>;
  @Input() first: boolean;
  @Input() groupIndex: number;
  @Input() selectors: FilterGroupConfig[];
  @Output() removeFilterGroup = new EventEmitter<string | undefined>();
  @Input() currentSelector: FilterGroupConfig;

  get groupSelectors(): FilterGroupConfig[] {
    const currentSelector = this.currentSelector;
    return currentSelector ? [currentSelector, ...this.selectors] : this.selectors;
  }

  connectors: FilterGroupConnector[] = FilterGroupConnectors;
  operators = new BehaviorSubject<FilterGroupOperator[]>(FilterGroupDefaultOperators);
  private readonly _unsub = new Subject();

  constructor(private _dialogService: ReportFilterDialogService) {}

  ngOnInit() {
    this.connectors = this.getConnectorOptions(this.first);
    this.filterFormGroup
      .get('selector')
      .valueChanges.pipe(takeUntil(this._unsub))
      .subscribe((selector: string) => this.selectorChanged(selector));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['first']) {
      this.connectors = this.getConnectorOptions(this.first);
    }
  }

  ngOnDestroy() {
    this._unsub.complete();
  }

  remove() {
    this.removeFilterGroup.emit(this.currentSelector?.value);
  }

  private selectorChanged(nextSelectorValue: string): void {
    const nextSelector = this._dialogService.groupSelectorChanged(
      this.groupIndex,
      nextSelectorValue,
      this.currentSelector,
    );
    this.operators.next(nextSelector.operators ? nextSelector.operators : FilterGroupDefaultOperators);
  }

  private getConnectorOptions(firstGroup: boolean): FilterGroupConnector[] {
    return firstGroup
      ? FilterGroupConnectors
      : FilterGroupConnectors.filter((connector) => connector !== FilterGroupConnector.WHERE);
  }
}
