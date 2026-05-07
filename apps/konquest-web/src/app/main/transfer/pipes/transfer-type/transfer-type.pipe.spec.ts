import { TransferAction } from 'app/main/transfer/models/transfer-action';
import { TransferTypePipe } from './transfer-type.pipe';

describe('TransferTypePipe', () => {
  it('create an instance', () => {
    const pipe = new TransferTypePipe();
    expect(pipe).toBeTruthy();
  });

  it(`should return the ${TransferAction.COPY} type translation key`, () => {
    const pipe = new TransferTypePipe();
    expect(pipe.transform(TransferAction.COPY)).toEqual('TRANSFER.TYPE.COPY');
  });

  it(`should return the ${TransferAction.MOVED} type translation key`, () => {
    const pipe = new TransferTypePipe();
    expect(pipe.transform(TransferAction.MOVED)).toEqual('TRANSFER.TYPE.MOVED');
  });

  it(`should return the ${TransferAction.SHARED} type translation key`, () => {
    const pipe = new TransferTypePipe();
    expect(pipe.transform(TransferAction.SHARED)).toEqual('TRANSFER.TYPE.SHARED');
  });

  it('should return provided value if different from any TransferAction', () => {
    const pipe = new TransferTypePipe();
    expect(pipe.transform('INVALID_VALUE' as any)).toEqual('INVALID_VALUE');
  });
});
