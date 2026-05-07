import { Injectable } from '@angular/core';
import { CustomSectionModel } from '@app/main/custom-sections/models/custom-sections';
import { SectionContentsService } from '@app/main/section-contents/services/section-contents.service';
import { CustomSectionsAPI } from '@core/api/base/custom-sections.api';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { HOME_SECTIONS_PAYLOAD, HomePageType, HomeSection } from '../models/home';

@Injectable()
export class HomeService {
  constructor(
    private readonly customSectionsAPI: CustomSectionsAPI,
    private readonly sectionContentService: SectionContentsService,
  ) {}

  loadSections(id: HomePageType): Observable<HomeSection[]> {
    return this.customSectionsAPI
      .get<CustomSectionModel[]>('/sections/availables', {
        'filter.learningObjectType': `$in:${HOME_SECTIONS_PAYLOAD[id]}`,
      })
      .pipe(
        mergeMap((sections) => {
          if (!sections?.length) {
            return of([]);
          }

          return forkJoin(
            sections?.map((section) => {
              const sectionContentType = SectionContentsService.getSectionContentType(section.learning_object_type);
              return this.sectionContentService.getContentsFromSectionId(section.id, sectionContentType).pipe(
                map((response) => ({
                  id: section.id,
                  title: section.title,
                  description: section.description,
                  learning_object_type: section.learning_object_type,
                  sectionContentType,
                  contents: response.items,
                })),
              );
            }),
          );
        }),
      );
  }
}
