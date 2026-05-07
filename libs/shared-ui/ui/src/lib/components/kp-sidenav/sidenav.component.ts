import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  Input,
  model,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { KpSidenavItemComponent } from './kp-sidenav-item.component';

export type KpSideNavMode = 'mini' | 'full';
export type KpSidenavType = 'side' | 'over';

@Component({
  selector: 'kp-sidenav',
  imports: [],
  styles: [
    `
      :host {
        --kp-sidenav-animation-timing: 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: row;
        min-height: calc(100dvh - 72px);
      }

      .kp-sidenav {
        z-index: 100;
        top: 0;
        bottom: 0;
        position: absolute;
        overflow-x: hidden;
        transition:
          left var(--kp-sidenav-animation-timing),
          width var(--kp-sidenav-animation-timing);
        display: flex;
      }

      .kp-sidenav {
        color: var(--kp-sidenav-text-color);
        background: var(--kp-sidenav-bg);

        &.kp-sidenav-over {
          padding-right: 8px;
        }
      }

      .kp-sidenav-content-wrapper {
        width: 100%;
        min-height: calc(100dvh - 72px);
        transition: margin-left var(--kp-sidenav-animation-timing);
        background: var(--kp-sidenav-bg);
        padding: 0 8px 8px 8px;
      }

      .kp-sidenav-backdrop {
        position: absolute;
        inset: 0;
        z-index: 90;
        background-color: rgba(0, 0, 0, 30%);
      }
    `,
  ],
  template: `
    <div
      class="kp-sidenav"
      [class.kp-sidenav-over]="sideNavType() === 'over'"
      [style.left.px]="sidenavLeft()"
      [style.width.px]="sidenavWidth()"
    >
      <div class="flex flex-col p-4 h-full" [style.max-width.px]="miniWidth()">
        <ng-content></ng-content>

        <div class="mt-auto">
          <ng-content select="[kpSidenavFooter]"></ng-content>
        </div>
      </div>
      <ng-template #navContainer></ng-template>
    </div>

    <div class="kp-sidenav-content-wrapper" [style.margin-left.px]="contentMarginLeft()">
      <ng-content select="[kpSidenavContent]"></ng-content>
    </div>

    @if (showBackdrop()) {
      <div class="kp-sidenav-backdrop" (click)="toggle()"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements AfterContentInit, OnChanges {
  @ContentChildren(KpSidenavItemComponent, { descendants: true }) children: QueryList<KpSidenavItemComponent>;
  @ViewChild('navContainer', { read: ViewContainerRef, static: true }) navContainer: ViewContainerRef;
  @Input() activeItemIndex: number | undefined;

  width = model(360);
  miniWidth = model(72);
  sideNavType = model<KpSidenavType>('side');
  sidenavMode = model<KpSideNavMode>('mini');
  open = model(false);
  private lastActiveItem: KpSidenavItemComponent;

  showBackdrop = computed(() => {
    const navType = this.sideNavType();
    const open = this.open();
    return open && navType === 'over';
  });

  contentMarginLeft = computed(() => {
    const currentType = this.sideNavType();
    const isOpen = this.open();
    if (!isOpen || currentType === 'over') {
      return 0;
    }

    return this.getCurrentModeWidth();
  });

  sidenavLeft = computed(() => {
    const isOpen = this.open();
    if (isOpen) {
      return 0;
    }

    return -this.getCurrentModeWidth();
  });

  sidenavWidth = computed(() => {
    return this.getCurrentModeWidth();
  });

  ngAfterContentInit() {
    this.subscribeToItemsActiveChange(this.children?.toArray());
  }

  ngOnChanges(changes: SimpleChanges) {
    const activeItemIndexChange = changes['activeItemIndex'];

    if (activeItemIndexChange) {
      this.toggleItemByIndex(this.activeItemIndex);
    }
  }

  toggle() {
    const isOpen = this.open();
    this.open.set(!isOpen);
  }

  setActiveItem(item: KpSidenavItemComponent) {
    const togglingCurrentItem = this.lastActiveItem === item;

    if (togglingCurrentItem) {
      this.handleCurrentItemToggle(item);
      return;
    }

    this.lastActiveItem?.toggle(false);
    this.navContainer.clear();
    if (!item.active()) {
      this.lastActiveItem = undefined;
      return;
    }
    this.renderItemContent(item);
    this.lastActiveItem = item;
  }

  toggleItemByIndex(index: number) {
    if (index >= 0) {
      this.children?.get(index)?.toggle();
    }
  }

  private handleCurrentItemToggle(item: KpSidenavItemComponent) {
    if (this.showBackdrop()) {
      this.toggle();
      item.toggle(false);
      return;
    }
    this.lastActiveItem = undefined;
    this.navContainer.clear();
    this.sidenavMode.set('mini');
  }

  private renderItemContent(item: KpSidenavItemComponent) {
    if (!item.hasContent()) {
      this.sidenavMode.set('mini');
      return;
    }
    this.sidenavMode.set('full');
    this.navContainer.createEmbeddedView(item.templateRef);
  }

  private getCurrentModeWidth() {
    const currentMode = this.sidenavMode();
    if (currentMode === 'mini') {
      return this.miniWidth();
    }

    return this.width();
  }

  private subscribeToItemsActiveChange(items: KpSidenavItemComponent[]) {
    if (!items?.length) {
      return;
    }

    items.forEach((item) => item.activeChange.subscribe(() => this.setActiveItem(item)));
  }
}
