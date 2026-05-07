import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'genericErrorHandlerLabelNormalize' })
export class GenericErrorHandlerLabelNormalize implements PipeTransform {
  transform(value: any): string {
    if (!value) {
      return '';
    }

    const { user } = value;

    if (user && typeof user === 'string') {
      return user;
    }

    if (user) {
      return user?.name || user?.email || '';
    }

    const { mission } = value;
    if (mission) {
      return typeof mission === 'string' ? mission : mission?.name;
    }

    return value?.channel?.name || '';
  }
}
