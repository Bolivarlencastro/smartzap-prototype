import {
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ControlContainer, FormControl, FormGroup, Validators } from '@angular/forms';
import { KpFilterDefContext, KpFilterOption } from '../models';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[kpFilterDef]',
  standalone: true,
})
export class KpFilterDefDirective {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static ngTemplateContextGuard(directive: KpFilterDefDirective, context: unknown): context is KpFilterDefContext {
    return true;
  }

  @Input() kpFilterDef: string;
  @Output() valueChanges = new EventEmitter<any>();

  protected contentView: EmbeddedViewRef<any>;
  private readonly parentContainer = inject(ControlContainer);
  private subscription: Subscription;

  constructor(protected templateRef: TemplateRef<any>) {}

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  registerAndRender(container: ViewContainerRef, context: KpFilterOption): void {
    const formControl = this.setFormControls(context);
    this.registerAutoComplete(context, formControl);
    this.setLengthValidators(context, formControl);
    this.contentView = container.createEmbeddedView(this.templateRef, { $implicit: context, control: formControl });
  }

  unregisterAndMarkForCheck(controlKeys: string[]): void {
    controlKeys.forEach((controlKey) => {
      this.parentFormGroup.removeControl(controlKey, { emitEvent: false });
    });

    this.parentFormGroup.updateValueAndValidity();
    this.subscription?.unsubscribe();
    this.contentView.markForCheck();
  }

  private setFormControls(option: KpFilterOption): FormControl | undefined {
    switch (option.rangeType) {
      case 'between':
        this.registerControl(option.rangeConfig?.fromKey);
        this.registerControl(option.rangeConfig?.toKey);
        return undefined;
      case 'less':
        this.registerControl(option.rangeConfig?.toKey);
        return undefined;
      case 'more':
        this.registerControl(option.rangeConfig?.fromKey);
        return undefined;
      default:
        return this.registerControl(option.filterKey);
    }
  }

  private registerControl(controlKey: string): FormControl {
    const control = new FormControl('', [Validators.required]);

    this.parentFormGroup.addControl(controlKey, control);
    return control;
  }

  private setLengthValidators(option: KpFilterOption, formControl: FormControl | undefined) {
    if ((option.type === 'autoComplete' || option.type === 'selectMultiple') && option.selectionLengthConfig) {
      if (option.selectionLengthConfig.min) {
        formControl.addValidators(Validators.minLength(option.selectionLengthConfig.min));
      }

      if (option.selectionLengthConfig.max) {
        formControl.addValidators(Validators.maxLength(option.selectionLengthConfig.max));
      }
      formControl.updateValueAndValidity();
    }
  }

  private registerAutoComplete(option: KpFilterOption, formControl: FormControl | undefined): void {
    if (option.type !== 'autoComplete' || !formControl) {
      return;
    }

    this.subscription = formControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => this.valueChanges.emit(value));
  }
}
