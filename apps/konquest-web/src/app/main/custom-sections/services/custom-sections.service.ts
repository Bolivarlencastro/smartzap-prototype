import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { COURSES_SERVICE_ID, HIGHLIGHTS_SERVICE_ID, TRAILS_SERVICE_ID } from '@app/main/home/models/home';
import { KonquestFeaturesService } from '@app/shared/services';
import { CustomSectionsAPI } from '@core/api/base/custom-sections.api';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { format } from 'date-fns';
import { map, Observable } from 'rxjs';
import { SectionFormDialogComponent } from '../components/section-form-dialog/section-form-dialog.component';
import {
  CustomSectionContentsModel,
  CustomSectionModel,
  CustomSectionsFeature,
  DeleteContentModel,
  FiltersRepresentationsModel,
  LearningObjectType,
  PageType,
  SECTION_ICON_MAP,
} from '../models/custom-sections';

@Injectable({
  providedIn: 'root',
})
export class CustomSectionsService {
  constructor(
    private readonly konquestFeatureServices: KonquestFeaturesService,
    private readonly customSectionsAPI: CustomSectionsAPI,
    private readonly dialog: MatDialog,
  ) {}

  getActiveFeatures(): CustomSectionsFeature[] {
    const highlights = this.konquestFeatureServices.isServiceActive(HIGHLIGHTS_SERVICE_ID);
    const trails = this.konquestFeatureServices.isServiceActive(TRAILS_SERVICE_ID);
    const courses = this.konquestFeatureServices.isServiceActive(COURSES_SERVICE_ID);
    const features: CustomSectionsFeature[] = [];

    if (highlights) {
      features.push({ id: 'highlights', icon: 'star', label: 'HOME.HIGHLIGHTS' });
    }

    if (trails) {
      features.push({ id: 'learning-trails', icon: 'route', label: 'HOME.LEARNING_TRAILS' });
    }

    if (courses) {
      features.push({ id: 'courses', icon: 'rocket_launch', label: 'HOME.COURSES' });
    }

    return features;
  }

  fetchSections(pageType: PageType): Observable<CustomSectionModel[]> {
    const filter = this.getSectionsFilterByPage(pageType);
    return this.customSectionsAPI
      .get<CustomSectionModel[]>('/sections', { 'filter.learningObjectType': `$in:${filter}` })
      .pipe(map((res) => this.buildSections(res)));
  }

  openSectionFormDialog(data?: CustomSectionModel) {
    return this.dialog.open(SectionFormDialogComponent, {
      autoFocus: 'dialog',
      width: '500px',
      data,
    });
  }

  createSection(learningObjectType: LearningObjectType, data: CustomSectionModel) {
    return this.customSectionsAPI.post('/sections', { ...data, learningObjectType });
  }

  editSection(data: CustomSectionModel) {
    const { id, title, description, start_date, end_date } = data;
    return this.customSectionsAPI.patch(`/sections/${data.id}`, { id, title, description, start_date, end_date });
  }

  openDeleteSectionDialog(): Observable<any> {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = 'CUSTOM_SECTIONS.ACTIONS.DELETE_DIALOG_TITLE';
    dialogRef.componentInstance.confirmMessage = 'CUSTOM_SECTIONS.ACTIONS.DELETE_DIALOG_SUBTITLE';

    return dialogRef.afterClosed();
  }

  deleteSection(id: string) {
    return this.customSectionsAPI.delete(`/sections/${id}`);
  }

  reorderSections(ids: string[]) {
    return this.customSectionsAPI.post(`/sections/reorder`, { ids });
  }

  deleteContent({ section, content }: DeleteContentModel) {
    const filters = this.buildUpdatedFilters({ section, content });
    return this.customSectionsAPI.patch(`/sections/${section.id}`, { filters });
  }

  private getSectionsFilterByPage(pageType: PageType): string[] {
    if (pageType === 'highlights') {
      return [
        'HIGHLIGHT.LEARNING_TRAIL',
        'HIGHLIGHT.LEARNING_TRAIL.ENROLLED',
        'HIGHLIGHT.COURSE',
        'HIGHLIGHT.COURSE.ENROLLED',
        'HIGHLIGHT.EVENTS',
        'HIGHLIGHT.EVENTS.ENROLLED',
      ];
    }

    if (pageType === 'courses') {
      return ['COURSE', 'COURSE.ENROLLED', 'COURSE.ALL'];
    }

    return ['LEARNING_TRAIL', 'LEARNING_TRAIL.ENROLLED', 'LEARNING_TRAIL.ALL'];
  }

  private buildSections(sections: CustomSectionModel[]): CustomSectionModel[] {
    return sections?.map((section) => ({
      ...section,
      icon: SECTION_ICON_MAP[section.learning_object_type],
      formattedDate: this.formatDate(section.start_date, section.end_date),
      contents: this.buildContents(section.filters_representations, section.learning_object_type),
    }));
  }

  private formatDate(startDate: string, endDate: string): string | null {
    if (!startDate || !endDate) {
      return null;
    }

    return `${format(new Date(startDate), 'P')} - ${format(new Date(endDate), 'P')}`;
  }

  private buildContents(
    filters_representations: FiltersRepresentationsModel[],
    learningObjectType: LearningObjectType,
  ): CustomSectionContentsModel[] {
    if (!filters_representations?.length) {
      return [];
    }

    return filters_representations.map((item) => ({
      filter_key: item.filter_key,
      id: item.filter_value,
      name: item.value,
      icon: this.getContentIcon(item.filter_key, learningObjectType),
    }));
  }

  private getContentIcon(filter_key: string, learningObjectType: LearningObjectType): string {
    if (filter_key === 'CATEGORY_IDS') {
      return 'folder';
    }

    return SECTION_ICON_MAP[learningObjectType];
  }

  private buildUpdatedFilters({ section, content }: DeleteContentModel): any {
    const { filter_key, id } = content;

    if (filter_key === 'CATEGORY_IDS') {
      return {
        ...section.filters,
        CATEGORY_IDS: section.filters['CATEGORY_IDS'].filter((itemId) => itemId !== id),
      };
    }

    return {
      ...section.filters,
      ID: section.filters['ID'].filter((itemId) => itemId !== id),
    };
  }
}
