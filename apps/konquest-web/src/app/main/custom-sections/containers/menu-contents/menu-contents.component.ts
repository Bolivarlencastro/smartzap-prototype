import { SelectionModel } from '@angular/cdk/collections';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@jsverse/transloco';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { Store } from '@ngrx/store';
import { CustomSectionModel } from '../../models/custom-sections';
import { ContentModel, ContentTab, ContentTabType } from '../../models/section-contents';
import { SectionContentsActions } from '../../store/actions';
import { sectionContentsFeature } from '../../store/features/section-contents.feature';

@Component({
  selector: 'app-menu-contents',
  imports: [
    MatButtonModule,
    TranslocoModule,
    MatDividerModule,
    MatMenuModule,
    MatTabsModule,
    KpGlobalSearchInputComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    NgClass,
  ],
  template: `
    <button
      data-test="sections-button-add-contents"
      mat-button
      color="primary"
      class="ml-1"
      [matMenuTriggerFor]="contentMenu"
      (click)="onOpenContentMenu()"
      [disabled]="!section()?.enabled"
    >
      <mat-icon>add</mat-icon>
      <span [ngClass]="{ 'text-primary': section()?.enabled }">{{
        'CUSTOM_SECTIONS.LIST.CONTENTS.ADD_BUTTON' | transloco
      }}</span>
    </button>

    <mat-menu
      #contentMenu="matMenu"
      class="w-80 max-w-none max-h-none overflow-hidden kp-reset-menu-padding"
      (closed)="onResetState()"
    >
      <div class="flex flex-col w-full" (click)="$event.stopPropagation()">
        <nav mat-tab-nav-bar [tabPanel]="tabPanel" fitInkBarToContent>
          @for (tab of menuTabs(); track tab.value) {
            <a
              [attr.data-test]="'section-tab-' + tab.value"
              mat-tab-link
              (click)="onChangeContentTab(tab)"
              [active]="isTabActivated(tab)"
              class="font-bold bg-primary-100 dark:bg-primary-900 text-sm h-12"
            >
              {{ tab.label | transloco }}
            </a>
          }
        </nav>

        <mat-tab-nav-panel #tabPanel class="flex flex-col w-full">
          <div class="h-12">
            <kp-global-search-input
              class="h-12"
              iconClass="-ml-3"
              inputClass="text-sm -ml-2"
              [searchTerm]="menuSearchTerm()"
              (filterEvent)="onSearchContent($event)"
            ></kp-global-search-input>
            <mat-divider class="m-0"></mat-divider>
          </div>

          @if (menuLoading()) {
            <div class="h-72 flex items-center justify-center">
              <mat-progress-spinner diameter="25" mode="indeterminate"></mat-progress-spinner>
            </div>
          } @else {
            <div class="h-72 overflow-y-auto w-full overflow-x-hidden px-1 gap-2">
              @for (item of menuItems(); track item.id) {
                <mat-checkbox
                  data-test="section-content-item-{{ item.name }}"
                  class="block overflow-hidden"
                  [checked]="selection.isSelected(item.id)"
                  (change)="selection.toggle(item.id)"
                >
                  <div
                    [attr.data-test]="'section-content-item-' + item.name"
                    class="[word-break:break-word] line-clamp-2"
                  >
                    {{ item.name }}
                  </div>
                </mat-checkbox>
              }
            </div>
          }

          <mat-divider class="m-0"></mat-divider>

          <div class="flex gap-1 items-center justify-end w-full p-2">
            <button mat-button class="text-primary" (click)="onCloseMenu()">
              {{ 'GENERAL.CANCEL' | transloco }}
            </button>
            <button
              data-test="add-content-to-section-button"
              mat-flat-button
              class="w-min"
              color="primary"
              [disabled]="isAddButtonDisabled"
              (click)="onSave()"
            >
              {{ 'GENERAL.ADD' | transloco }}
            </button>
          </div>
        </mat-tab-nav-panel>
      </div>
    </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuContentsComponent {
  section = input<CustomSectionModel>();

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  protected readonly menuItems: Signal<ContentModel[]>;
  protected readonly menuLoading: Signal<boolean>;
  protected readonly menuTabs: Signal<ContentTab[]>;
  protected readonly menuActiveTab: Signal<ContentTabType>;
  protected readonly menuSearchTerm: Signal<string>;
  protected readonly selection = new SelectionModel<string>(true, []);

  get isAddButtonDisabled(): boolean {
    return this.selection.isEmpty();
  }

  constructor(private readonly store: Store) {
    this.menuItems = toSignal(store.select(sectionContentsFeature.selectItems));
    this.menuLoading = toSignal(store.select(sectionContentsFeature.selectLoading));
    this.menuTabs = toSignal(store.select(sectionContentsFeature.selectTabs));
    this.menuActiveTab = toSignal(store.select(sectionContentsFeature.selectActiveTab));
    this.menuSearchTerm = toSignal(store.select(sectionContentsFeature.selectSearch));
  }

  onOpenContentMenu() {
    const learningObjectType = this.section().learning_object_type;
    this.store.dispatch(SectionContentsActions.init({ learningObjectType }));
  }

  onSearchContent(search: string) {
    this.store.dispatch(SectionContentsActions.setSearch({ search }));
  }

  onChangeContentTab(tab: ContentTab) {
    this.selection.clear();
    this.store.dispatch(SectionContentsActions.setTab({ tab: tab.value }));
  }

  onSave() {
    this.store.dispatch(SectionContentsActions.save({ section: this.section(), ids: this.selection.selected }));
    this.onCloseMenu();
  }

  onResetState() {
    this.selection.clear();
    this.store.dispatch(SectionContentsActions.reset());
  }

  isTabActivated(tab: ContentTab): boolean {
    return tab.value === this.menuActiveTab();
  }

  onCloseMenu() {
    this.trigger.closeMenu();
  }
}
