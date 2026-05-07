import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { MissionTransferActions } from 'app/main/mission-transfer/store';
import { MissionTransferType } from 'app/main/mission-transfer/models';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { Chance } from 'chance';
import { TransferContentStrategy } from './transfer-content-strategy';
import { TransferDialogActions } from 'app/main/transfer-dialog/store/actions';
import { TransferContentType } from 'app/main/transfer-dialog/models';

describe('TransferContentStrategy', () => {
  let strategy: TransferContentStrategy;
  const chance = new Chance();

  beforeEach(() => {
    strategy = new TransferContentStrategy();
  });

  it('should return MissionTransferActions.openDialog for courses with the TRANSFER transfer type', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        MissionTransferActions.openDialog({
          data: {
            mission: { id: item.id },
            transferType: MissionTransferType.TRANSFER,
          },
        }),
      );
      done();
    });
  });

  it('should return MissionTransferActions.openDialog for trails with the TRANSFER transfer type', (done) => {
    const item = { id: chance.guid(), name: chance.name() } as LearnContentListItem;
    const action = strategy.execute('trails', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        TransferDialogActions.openDialog({
          dialogData: {
            contentType: TransferContentType.LEARNING_TRAIL,
            transferContent: { id: item.id, name: item.name },
          },
        }),
      );
      done();
    });
  });

  it('should return TransferDialogActions.openDialog for channels with the CHANNEL content type', (done) => {
    const item = { id: chance.guid(), name: chance.name() } as LearnContentListItem;
    const action = strategy.execute('channels', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        TransferDialogActions.openDialog({
          dialogData: {
            contentType: TransferContentType.CHANNEL,
            transferContent: { id: item.id, name: item.name },
          },
        }),
      );
      done();
    });
  });

  it('should return ContentManagementListActions.executeActionNoopResult for content types that are not valid', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('events', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to transfer events.');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });
});
