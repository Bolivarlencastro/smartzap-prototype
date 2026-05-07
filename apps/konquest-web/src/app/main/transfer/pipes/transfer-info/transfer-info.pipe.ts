import { Pipe, PipeTransform } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TransferAction } from '../../models/transfer-action';

marker('TRANSFER.CANNOT_EDIT_COPY');
marker('TRANSFER.CANNOT_EDIT_MOVED');

@Pipe({ name: 'transferInfo' })
export class TransferInfoPipe implements PipeTransform {
  transform(value: TransferAction): string {
    const translations: Record<TransferAction.COPY | TransferAction.MOVED, string> = {
      [TransferAction.COPY]: 'TRANSFER.CANNOT_EDIT_COPY',
      [TransferAction.MOVED]: 'TRANSFER.CANNOT_EDIT_MOVED',
    };
    return translations[value as keyof Record<TransferAction.MOVED | TransferAction.COPY, string>] || value;
  }
}
