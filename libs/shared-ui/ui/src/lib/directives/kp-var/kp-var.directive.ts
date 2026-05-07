import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[kpVar]',
  standalone: true,
})
export class KpVarDirective {
  private context: {
    $implicit: unknown;
    kpVar: unknown;
  } = {
    $implicit: null,
    kpVar: null,
  };

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
  ) {}

  @Input()
  set kpVar(context: unknown) {
    this.context.$implicit = this.context.kpVar = context;

    if (!this.hasView) {
      this.vcRef.createEmbeddedView(this.templateRef, this.context);
      this.hasView = true;
    }
  }
}
