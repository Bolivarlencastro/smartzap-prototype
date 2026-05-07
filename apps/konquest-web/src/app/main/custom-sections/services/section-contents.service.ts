import { Injectable } from '@angular/core';
import { MissionCategory } from '@app/main/mission/mission.model';
import { CustomSectionsAPI } from '@core/api/base/custom-sections.api';
import { SearchAPI } from '@core/api/base/search.api';
import { GlobalSearchResponse } from '@core/model/search-api/global-response.model';
import { PageResponse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { map, Observable, of } from 'rxjs';
import { CustomSectionModel, LearningObjectType } from '../models/custom-sections';
import { ContentTabType, CONTENT_FILTER_MAP, ContentModel } from '../models/section-contents';

@Injectable({
  providedIn: 'root',
})
export class SectionContentsService {
  constructor(
    private readonly customSectionsAPI: CustomSectionsAPI,
    private readonly searchApi: SearchAPI,
  ) {}

  getData(
    learningObjectType: LearningObjectType,
    activeTab: ContentTabType,
    search: string,
    categories: MissionCategory[],
  ): Observable<ContentModel[]> {
    if (activeTab === 'category') {
      return this.buildedCategories(categories, search);
    }

    const filter = {
      ...CONTENT_FILTER_MAP[learningObjectType],
      page: 1,
      per_page: 35,
      search,
      development_status: 'DONE',
    };
    return this.searchApi
      .get<PageResponse<GlobalSearchResponse>>('/v1/global', filter)
      .pipe(map((res) => res.items.map(({ id, name }) => ({ id, name }))));
  }

  editSectionContents(ids: string[], section: CustomSectionModel, activeTab: ContentTabType) {
    const filters = this.buildUpdatedFilters(ids, section, activeTab);
    return this.customSectionsAPI.patch(`/sections/${section.id}`, {
      filters,
    });
  }

  private buildedCategories(categories: MissionCategory[], search: string): Observable<ContentModel[]> {
    const items = categories.map((c) => ({ id: c.id, name: c.name }));
    const searchTerm = search?.trim();

    if (searchTerm) {
      const result = items.filter((item) => item.name.toLowerCase().includes(searchTerm));
      return of(result);
    }

    return of(items);
  }

  private buildUpdatedFilters(ids: string[], section: CustomSectionModel, activeTab: ContentTabType): any {
    const currentFilters = section.filters ?? {};
    const uniqueNewIds = [...new Set(ids)];

    if (activeTab === 'category') {
      const merged = [...new Set([...(currentFilters['CATEGORY_IDS'] ?? []), ...uniqueNewIds])];

      return {
        ...currentFilters,
        CATEGORY_IDS: merged,
        ...(currentFilters['ID'] && { ID: currentFilters['ID'] }),
      };
    } else {
      const merged = [...new Set([...(currentFilters['ID'] ?? []), ...uniqueNewIds])];

      return {
        ...currentFilters,
        ID: merged,
        ...(currentFilters['CATEGORY_IDS'] && { CATEGORY_IDS: currentFilters['CATEGORY_IDS'] }),
      };
    }
  }
}
