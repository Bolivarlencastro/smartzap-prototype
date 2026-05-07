import { Injectable } from '@angular/core';
import { CustomSectionModel, LearningObjectType } from '@app/main/custom-sections/models/custom-sections';
import { mapCoursesToLearnContentCard, mapTrailsToContentCard } from '@app/shared/utils/card-helpers';
import { CustomSectionsAPI } from '@core/api/base/custom-sections.api';
import { SearchAPI } from '@core/api/base/search.api';
import { PageResponse } from '@core/model/search-api';
import { CourseSectionResponse } from '@core/model/search-api/course-section-response.model';
import { TrailSectionResponse } from '@core/model/search-api/trail-section-response.model';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { map, Observable } from 'rxjs';
import { SectionContentsFilter } from '../models/section-contents-filter';
import { SECTION_CONTENT_TYPE } from '../models/section-contents-type';

@Injectable({
  providedIn: 'root',
})
export class SectionContentsService {
  static mapCoursesToLearnContentCardData(courses: CourseSectionResponse[]): LearnContentCardData[] {
    return courses.map((course) => {
      const enrollment = course?.stats?.enrollment;
      return {
        contentId: course.id,
        title: course.title,
        backgroundImage: course.vertical_holder_image,
        duration: course.duration,
        externalProvider: course.external_course?.provider_name,
        externalCourseUrl: course.external_url,
        language: course.language,
        missionModel: course.course_model,
        enrollmentId: enrollment?.enrollment_id,
        progress: enrollment?.progress ? enrollment?.progress * 100 : 0,
        eventDate: course.event_date,
        bookmarkId: course?.stats?.favorite,
        isIntegration: course?.stats?.is_integration,
        isOwner: course?.stats?.is_owner,
        isContributor: course?.stats?.is_contributor,
        developmentStatus: course?.development_status,
        enrollment: { status: enrollment?.status, required: enrollment?.required, goal_date: enrollment?.goal_date },
      };
    });
  }

  static mapTrailToLearnContentCardData(trails: TrailSectionResponse[]): LearnContentCardData[] {
    return trails.map((trail) => {
      const enrollment = trail?.stats?.enrollment;
      return {
        contentId: trail.id,
        title: trail.title,
        backgroundImage: trail.thumb_image,
        duration: trail.duration,
        language: trail.language,
        enrollmentId: enrollment?.enrollment_id,
        progress: enrollment?.progress ? enrollment?.progress * 100 : 0,
        missionsCount: trail.stats?.missions_count,
        pulsesCount: trail.stats?.pulse_count,
        enrollment: { status: enrollment?.status, required: enrollment?.required, goal_date: enrollment?.goal_date },
        isActive: trail.is_active,
      };
    });
  }

  static getSectionContentType(learning_object_type: LearningObjectType): SECTION_CONTENT_TYPE {
    const SECTION_CONTENT_TYPE_MAP: Record<LearningObjectType, SECTION_CONTENT_TYPE> = {
      'HIGHLIGHT.COURSE': SECTION_CONTENT_TYPE.COURSES,
      'HIGHLIGHT.COURSE.ENROLLED': SECTION_CONTENT_TYPE.COURSES,
      'HIGHLIGHT.EVENTS': SECTION_CONTENT_TYPE.EVENTS,
      'HIGHLIGHT.EVENTS.ENROLLED': SECTION_CONTENT_TYPE.EVENTS,
      COURSE: SECTION_CONTENT_TYPE.COURSES,
      'COURSE.ENROLLED': SECTION_CONTENT_TYPE.COURSES,
      'COURSE.ALL': SECTION_CONTENT_TYPE.COURSES,
      'HIGHLIGHT.LEARNING_TRAIL': SECTION_CONTENT_TYPE.TRAILS,
      'HIGHLIGHT.LEARNING_TRAIL.ENROLLED': SECTION_CONTENT_TYPE.TRAILS,
      LEARNING_TRAIL: SECTION_CONTENT_TYPE.TRAILS,
      'LEARNING_TRAIL.ENROLLED': SECTION_CONTENT_TYPE.TRAILS,
      'LEARNING_TRAIL.ALL': SECTION_CONTENT_TYPE.TRAILS,
    };

    return SECTION_CONTENT_TYPE_MAP[learning_object_type];
  }

  constructor(
    private readonly searchAPI: SearchAPI,
    private readonly customSectionsAPI: CustomSectionsAPI,
  ) {}

  getInitialConfig(sectionId: string): Observable<{ section: CustomSectionModel; contentType: SECTION_CONTENT_TYPE }> {
    return this.customSectionsAPI.get<CustomSectionModel[]>('/sections/availables').pipe(
      map((sections) => {
        const section = sections.find((section) => section.id === sectionId);
        return { contentType: SectionContentsService.getSectionContentType(section.learning_object_type), section };
      }),
    );
  }

  loadSectionContents(
    section: CustomSectionModel,
    contentType: SECTION_CONTENT_TYPE,
    filter?: SectionContentsFilter,
    isSuperAdmin?: boolean,
    isAdmin?: boolean,
  ): Observable<PageResponse<LearnContentCardData>> {
    const typesWithoutSectionId: LearningObjectType[] = ['COURSE.ALL', 'LEARNING_TRAIL.ALL'];

    if (typesWithoutSectionId.includes(section.learning_object_type)) {
      return this.getContentsFromDataType(section.learning_object_type, filter, isSuperAdmin, isAdmin);
    }

    return this.getContentsFromSectionId(section.id, contentType, filter);
  }

  getContentsFromSectionId(
    id: string,
    contentType: SECTION_CONTENT_TYPE,
    filter?: SectionContentsFilter,
  ): Observable<PageResponse<LearnContentCardData>> {
    return this.searchAPI.get<PageResponse<any>>(`/v1/sections/${id}/contents`, filter).pipe(
      map((result) => {
        const items = result.items;
        const mappedItems =
          contentType === SECTION_CONTENT_TYPE.TRAILS
            ? SectionContentsService.mapTrailToLearnContentCardData(items)
            : SectionContentsService.mapCoursesToLearnContentCardData(items);
        return { ...result, items: mappedItems };
      }),
    );
  }

  getContentsFromDataType(
    learningObjectType: LearningObjectType,
    filter: SectionContentsFilter,
    isSuperAdmin: boolean,
    isAdmin: boolean,
  ): Observable<PageResponse<LearnContentCardData>> {
    const isCourse = learningObjectType === 'COURSE.ALL';
    const path = isCourse ? 'courses' : 'trails';

    return this.searchAPI
      .get<PageResponse<any>>(`/v1/${path}`, {
        ...filter,
        developmentStatus: DevelopmentStatus.DONE,
      })
      .pipe(
        map((result) => {
          const items = result.items;
          const mappedItems = isCourse
            ? mapCoursesToLearnContentCard(items, isSuperAdmin, isAdmin)
            : mapTrailsToContentCard(items, isSuperAdmin);

          return { ...result, items: mappedItems };
        }),
      );
  }
}
