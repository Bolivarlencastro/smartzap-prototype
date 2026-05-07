import * as fromGroupChannel from './group-channel.reducer';
import { selectGroupChannelState } from './group-channel.selectors';

describe('GroupChannel Selectors', () => {
  it('should select the feature state', () => {
    const result = selectGroupChannelState({
      [fromGroupChannel.groupChannelsFeatureKey]: fromGroupChannel.initialState,
    });

    expect(result).toEqual(fromGroupChannel.initialState);
  });
});
