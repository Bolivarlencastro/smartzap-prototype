export interface LearningTrailNavItem {
  title: string;
  label: string;
  route: string;
}

export const LearningTrailInfoNavItem: LearningTrailNavItem = {
  title: 'LEARNING_TRAIL.CREATE.NAVIGATION.TITLE.INFO',
  label: 'LEARNING_TRAIL.CREATE.NAVIGATION.LABEL.INFO',
  route: 'info',
};

export const LearningTrailImagesNavItem: LearningTrailNavItem = {
  title: 'LEARNING_TRAIL.CREATE.NAVIGATION.TITLE.IMAGES',
  label: 'LEARNING_TRAIL.CREATE.NAVIGATION.LABEL.IMAGES',
  route: 'images',
};

export const LearningTrailContentNavItem: LearningTrailNavItem = {
  title: 'LEARNING_TRAIL.CREATE.NAVIGATION.TITLE.CONTENT',
  label: 'LEARNING_TRAIL.CREATE.NAVIGATION.LABEL.CONTENT',
  route: 'content',
};

export const LearningTRailFinishNavItem: LearningTrailNavItem = {
  title: 'LEARNING_TRAIL.CREATE.NAVIGATION.TITLE.FINISH',
  label: 'LEARNING_TRAIL.CREATE.NAVIGATION.LABEL.FINISH',
  route: 'finish',
};

export function getLearningTrailNavItems(): LearningTrailNavItem[] {
  return [
    LearningTrailInfoNavItem,
    LearningTrailImagesNavItem,
    LearningTrailContentNavItem,
    LearningTRailFinishNavItem,
  ];
}
