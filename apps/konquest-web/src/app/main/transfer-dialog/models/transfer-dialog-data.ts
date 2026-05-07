import { TransferContentType } from './transfer-content-type.enum';
import { TransferContent } from './transfer-content';

export interface TransferDialogData {
  contentType: TransferContentType;
  transferContent: TransferContent;
}
