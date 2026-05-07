import * as fromGroupLearningTrail from './group-learning-trail.reducer';
import { selectGroupLearningTrailState } from './group-learning-trail.selectors';

describe('GroupLearningTrail Selectors', () => {
  it('should select the feature state', () => {
    const result = selectGroupLearningTrailState({
      [fromGroupLearningTrail.groupLearningTrailsFeatureKey]: fromGroupLearningTrail.initialState,
    });

    expect(result).toEqual(fromGroupLearningTrail.initialState);
  });
});
