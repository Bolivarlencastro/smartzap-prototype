import { TransferAction } from 'app/main/transfer/models/transfer-action';
import { TransferInfoPipe } from './transfer-info.pipe';

describe('TransferInfoPipe', () => {
  it('create an instance', () => {
    const pipe = new TransferInfoPipe();
    expect(pipe).toBeTruthy();
  });

  it(`should return the ${TransferAction.COPY} information translation key`, () => {
    const pipe = new TransferInfoPipe();
    expect(pipe.transform(TransferAction.COPY)).toEqual('TRANSFER.CANNOT_EDIT_COPY');
  });

  it(`should return the ${TransferAction.MOVED} information translation key`, () => {
    const pipe = new TransferInfoPipe();
    expect(pipe.transform(TransferAction.MOVED)).toEqual('TRANSFER.CANNOT_EDIT_MOVED');
  });

  it(`should return provided value if different from ${TransferAction.COPY} and ${TransferAction.MOVED}`, () => {
    const pipe = new TransferInfoPipe();
    expect(pipe.transform(TransferAction.SHARED)).toEqual(TransferAction.SHARED);
  });
});
