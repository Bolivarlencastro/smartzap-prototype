import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CustomSectionsHeaderComponent } from '../../components/custom-sections-header/custom-sections-header.component';
import { CustomSectionsListComponent } from '../../components/custom-sections-list/custom-sections-list.component';
import {
  CustomSectionModel,
  CustomSectionsViewModel,
  DeleteContentModel,
  LearningObjectType,
  PageType,
} from '../../models/custom-sections';
import { CustomSectionsActions } from '../../store/actions';
import { customSectionsFeature } from '../../store/features';

@Component({
  selector: 'app-custom-sections',
  imports: [CustomSectionsHeaderComponent, CustomSectionsListComponent],
  template: `
    <app-custom-sections-header
      [pageType]="vm().pageType"
      [activeFeatures]="vm().activeFeatures"
      [sectionFilter]="vm().sectionFilter"
      (changePage)="onChangePage($event)"
      (createSection)="onCreateSection($event)"
    ></app-custom-sections-header>
    <app-custom-sections-list
      class="grow"
      [loading]="vm().loading"
      [sections]="vm().sections"
      [sectionFilter]="vm().sectionFilter"
      [emptyListMessage]="vm().emptyListMessage"
      (createSection)="onCreateSection($event)"
      (deleteSection)="onDeleteSection($event)"
      (editSection)="onEditSection($event)"
      (reorderSections)="onReorderSections($event)"
      (deleteContent)="onDeleteContent($event)"
    ></app-custom-sections-list>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSectionsComponent implements OnDestroy {
  vm: Signal<CustomSectionsViewModel>;

  constructor(private readonly store: Store) {
    store.dispatch(CustomSectionsActions.init());
    this.vm = toSignal<CustomSectionsViewModel>(store.select(customSectionsFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(CustomSectionsActions.reset());
  }

  onChangePage(pageType: PageType) {
    this.store.dispatch(CustomSectionsActions.changePage({ pageType }));
  }

  onCreateSection(id: LearningObjectType) {
    this.store.dispatch(CustomSectionsActions.openSectionCreationDialog({ id }));
  }

  onDeleteSection(id: string) {
    this.store.dispatch(CustomSectionsActions.openDeleteSectionDialog({ id }));
  }

  onEditSection(data: CustomSectionModel) {
    this.store.dispatch(CustomSectionsActions.openSectionEditionDialog({ data }));
  }

  onDeleteContent(data: DeleteContentModel) {
    this.store.dispatch(CustomSectionsActions.deleteContent({ data }));
  }

  onReorderSections(ids: string[]) {
    this.store.dispatch(CustomSectionsActions.reorderSections({ ids }));
  }
}
