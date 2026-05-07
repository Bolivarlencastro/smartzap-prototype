import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'userRolesTranslate',
})
export class UserRolesTranslatePipe implements PipeTransform {
  constructor(private readonly translocoService: TranslocoService) {}

  transform(appName: string, userRoles: string[]): string {
    const translatedAppName = this.translocoService.translate(`GENERAL.KEEPS_APPS.${appName.toUpperCase()}`);
    const translatedUserRoles = userRoles.map((role) =>
      this.translocoService.translate(`GENERAL.APPS_ROLES.${role.toUpperCase()}`),
    );
    return `${translatedAppName}: ${translatedUserRoles.join(', ')}`;
  }
}
