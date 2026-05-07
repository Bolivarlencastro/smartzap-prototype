import { SectionContentActionsBuilder } from '@app/main/section-contents/section-contents-actions/section-content-actions.builder';
import { SectionContentItemActionDirectorFactory } from '@app/main/section-contents/section-contents-actions/section-content-item-action-director.factory';
import { SectionContentItemTagDirectorFactory } from '@app/main/section-contents/section-contents-tags/section-content-item-tag-director.factory';
import { SectionContentTagsBuilder } from '@app/main/section-contents/section-contents-tags/section-content-tags.builder';
import { selectIsAdmin, selectIsSuperAdmin } from '@app/shared/store/selectors/user-profile.selectors';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ContentType, HomeSection, HomeViewModel } from '../../models/home';
import { HomeActions } from '../actions';

const ACTIONS_BUILDER = new SectionContentActionsBuilder();
const TAGS_BUILDER = new SectionContentTagsBuilder();

export interface HomeFeatureState {
  highlights: boolean;
  trails: boolean;
  courses: boolean;
  events: boolean;

  sections: HomeSection[];
  loading: boolean;
}

export const homeInitialState: HomeFeatureState = {
  highlights: false,
  trails: false,
  courses: false,
  events: false,

  sections: [],
  loading: false,
};

export const homeReducer = createReducer(
  homeInitialState,

  on(
    HomeActions.setActiveFeatures,
    (state, { highlights, trails, courses, events }): HomeFeatureState => ({
      ...state,
      highlights,
      trails,
      courses,
      events,
    }),
  ),

  on(
    HomeActions.loadSections,
    (state): HomeFeatureState => ({
      ...state,
      loading: true,
    }),
  ),

  on(
    HomeActions.loadSectionsSuccess,
    (state, { sections }): HomeFeatureState => ({
      ...state,
      loading: false,
      sections,
    }),
  ),

  on(
    HomeActions.loadSectionsFailure,
    (state): HomeFeatureState => ({
      ...state,
      loading: false,
    }),
  ),
);

export const homeFeature = createFeature({
  name: 'home',
  reducer: homeReducer,
  extraSelectors: ({ selectHighlights, selectTrails, selectCourses, selectEvents, selectSections, selectLoading }) => ({
    selectHomeViewModel: createSelector(
      selectHighlights,
      selectTrails,
      selectCourses,
      selectEvents,
      selectSections,
      selectLoading,
      selectIsSuperAdmin,
      selectIsAdmin,
      (highlights, trails, courses, events, sections, loading, isSuperAdmin, isAdmin): HomeViewModel => {
        const activateFeatures: ContentType[] = [];

        if (highlights) {
          activateFeatures.push({ id: 'highlights', icon: 'star', label: 'HOME.HIGHLIGHTS' });
        }

        if (trails) {
          activateFeatures.push({ id: 'learning-trails', icon: 'route', label: 'HOME.LEARNING_TRAILS' });
        }

        if (courses) {
          activateFeatures.push({ id: 'courses', icon: 'rocket_launch', label: 'HOME.COURSES' });
        }

        if (events) {
          activateFeatures.push({ id: 'events', icon: 'event', label: 'HOME.EVENTS' });
        }

        return { activateFeatures, sections: setItemActionsAndTags(sections, isSuperAdmin, isAdmin), loading };
      },
    ),
  }),
});

function setItemActionsAndTags(items: HomeSection[], isSuperAdmin: boolean, isAdmin: boolean): HomeSection[] {
  if (!items?.length) {
    return [];
  }

  return items?.map((item) => {
    const actionsDirector = SectionContentItemActionDirectorFactory.getDirector(item.sectionContentType);
    const tagsDirector = SectionContentItemTagDirectorFactory.getDirector(item.sectionContentType);

    const updatedItemsComTag = item.contents?.map((content) => {
      actionsDirector.construct(ACTIONS_BUILDER, content, isAdmin, isSuperAdmin);
      tagsDirector.construct(TAGS_BUILDER, content, isAdmin, isSuperAdmin);
      return { ...content, actions: ACTIONS_BUILDER.build(), tags: TAGS_BUILDER.build() };
    });

    return { ...item, contents: updatedItemsComTag };
  });
}
