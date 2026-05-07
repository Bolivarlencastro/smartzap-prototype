import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SectionFilterType } from './section-contents-filter';
import { SECTION_CONTENT_TYPE } from './section-contents-type';
import { LearnContentCardOrientation } from '@keeps-platform-frontend-workspace/ui/models';

export interface SectionContentViewModel {
  contents: LearnContentCardData[];
  gridClass: string;
  orientation: LearnContentCardOrientation;
  loading: boolean;
  webLoaderTheme: unknown;
  mobileLoaderTheme: unknown;
  filterType: SectionFilterType;
  contentType: SECTION_CONTENT_TYPE;
}
