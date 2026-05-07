import { KpVarDirective } from './kp-var.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('KpVarDirective', () => {
  let directive: KpVarDirective;
  let templateRef: jest.Mocked<TemplateRef<any>>;
  let viewContainerRef: jest.Mocked<ViewContainerRef>;

  beforeEach(() => {
    templateRef = {
      elementRef: {} as any,
    } as jest.Mocked<TemplateRef<any>>;

    viewContainerRef = {
      createEmbeddedView: jest.fn(),
    } as any;

    directive = new KpVarDirective(templateRef, viewContainerRef);
  });

  it('should set context and create embedded view', () => {
    const contextValue = 'test value';

    directive.kpVar = contextValue;

    expect(directive['context'].$implicit).toBe(contextValue);
    expect(directive['context'].kpVar).toBe(contextValue);
    expect(viewContainerRef.createEmbeddedView).toHaveBeenCalledWith(templateRef, directive['context']);
  });

  it('should only create the view once', () => {
    const contextValue1 = 'test value 1';
    const contextValue2 = 'test value 2';

    directive.kpVar = contextValue1;
    directive.kpVar = contextValue2;

    expect(viewContainerRef.createEmbeddedView).toHaveBeenCalledTimes(1);
  });
});
