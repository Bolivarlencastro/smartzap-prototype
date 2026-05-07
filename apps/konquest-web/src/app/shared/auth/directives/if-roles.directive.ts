import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Directive({ selector: '[ifRoles]' })
export class IfRolesDirective {
  @Input('ifRoles') set roles(roles: string[]) {
    const hasRoles = this.userProfileService.hasRoles(roles || []);
    if (hasRoles) {
      this.container.createEmbeddedView(this.template);
      return;
    }
    this.container.clear();
  }

  constructor(
    private template: TemplateRef<any>,
    private container: ViewContainerRef,
    private userProfileService: UserProfileService,
  ) {}
}
