import { Pipe, PipeTransform } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TransferAction } from 'app/main/transfer/models/transfer-action';

marker('TRANSFER.TYPE.COPY');
marker('TRANSFER.TYPE.MOVED');
marker('TRANSFER.TYPE.SHARED');

@Pipe({ name: 'transferType' })
export class TransferTypePipe implements PipeTransform {
  transform(value: TransferAction): string {
    const translations: Record<TransferAction, string> = {
      [TransferAction.COPY]: 'TRANSFER.TYPE.COPY',
      [TransferAction.MOVED]: 'TRANSFER.TYPE.MOVED',
      [TransferAction.SHARED]: 'TRANSFER.TYPE.SHARED',
    };
    return translations[value] || value;
  }
}
