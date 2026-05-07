import { computed, Injectable, InjectionToken, Signal, signal, WritableSignal } from '@angular/core';
import { KeepsNavigationItem } from './keeps-navigation-item';
import { FeatureFlags } from '@keeps-platform-frontend-workspace/kp-keeps';

export const KEEPS_NAVIGATION_ITEMS = new InjectionToken<KeepsNavigationItem[]>('NAVIGATION_ITEMS');

@Injectable()
export abstract class AbstractNavigationService {
  private readonly currentNavigation: WritableSignal<KeepsNavigationItem[]>;
  readonly navigationItems: Signal<KeepsNavigationItem[]>;

  protected constructor(navigationItems: KeepsNavigationItem[]) {
    this.currentNavigation = signal(navigationItems);
    this.navigationItems = computed(() => {
      return this.currentNavigation();
    });
  }

  get currentNavigationItems(): KeepsNavigationItem[] {
    return JSON.parse(JSON.stringify(this.currentNavigation()));
  }

  protected abstract getHiddenItemsIds(): string[];

  /**
   * Call this function to update all item visibility based on whether their id is present in the result
   * of the getHiddenItemsIds function
   */
  protected updateAllItemsVisibility() {
    const hiddenItemsIds = new Set<string>(this.getHiddenItemsIds());
    const items = this.currentNavigationItems;
    this.updateItemsVisibilityRecursively(items, hiddenItemsIds);
    this.currentNavigation.set(items);
  }

  /**
   * Updates the title of an item
   * @param itemId The id of the item to update
   * @param newTitle The new title
   */
  protected updateItemTitle(itemId: string, newTitle: string) {
    const currentNavigationItens = this.currentNavigationItems;
    const navigationItem = this.getNavigationItemById(currentNavigationItens, itemId);
    if (!navigationItem) {
      return;
    }
    navigationItem.title = newTitle;
    this.currentNavigation.set(currentNavigationItens);
  }

  /**
   * Returns the id of the items that have user roles requirements, but the provided user roles don't include any of them
   * @param items The navigation items of the application
   * @param userRoles The roles of the current user
   * @protected
   */
  protected getHiddenItemsIdsByRole(items: KeepsNavigationItem[], userRoles: string[]): string[] {
    const hiddenItemsIds: string[] = [];
    const hideItemFn = (item: KeepsNavigationItem): boolean => {
      const itemHasRoles = !!item.roles?.length;
      const hasRoleForItem = item.roles?.some((role) => userRoles?.includes(role));
      return itemHasRoles && !hasRoleForItem;
    };
    this.updateHiddenIdsListRecursively(items, hiddenItemsIds, hideItemFn);
    return hiddenItemsIds;
  }

  /**
   * Returns the id of the items that have feature flags requirements, but the provided feature flags don't include any of them
   * @param items The navigation items of the application
   * @param featureFlags The feature flags of the current user
   * @protected
   */
  protected getHiddenItemsIdsByFeatureFlags(items: KeepsNavigationItem[], featureFlags: FeatureFlags): string[] {
    const hiddenItemsIds: string[] = [];
    const hideItemFn = (item: KeepsNavigationItem): boolean => {
      const itemIsFeatureFlagged = Object.hasOwn(featureFlags, item.id);
      const itemFeatureEnabled = featureFlags[item.id];
      return itemIsFeatureFlagged && !itemFeatureEnabled;
    };
    this.updateHiddenIdsListRecursively(items, hiddenItemsIds, hideItemFn);
    return hiddenItemsIds;
  }

  protected getHiddenItemsIdsByService(items: KeepsNavigationItem[], workspaceServicesIds: string[]): string[] {
    const hiddenItemsIds: string[] = [];
    const hideItemFn = (item: KeepsNavigationItem): boolean => {
      const itemHasServiceIds = !!item.servicesIds?.length;
      const workspaceHasService = item.servicesIds?.some((role) => workspaceServicesIds?.includes(role));
      return itemHasServiceIds && !workspaceHasService;
    };
    this.updateHiddenIdsListRecursively(items, hiddenItemsIds, hideItemFn);
    return hiddenItemsIds;
  }

  /**
   * Updates the list of items ids that should be hidden
   * @param items The navigation items
   * @param hiddenItemsIds The list of id's tha should be hidden
   * @param comparisonFn A comparison function to check against each item, when returning true, the item will be hidden
   * @protected
   */
  protected updateHiddenIdsListRecursively(
    items: KeepsNavigationItem[],
    hiddenItemsIds: string[],
    comparisonFn: (item: KeepsNavigationItem) => boolean,
  ) {
    for (const item of items) {
      if (comparisonFn(item)) {
        hiddenItemsIds.push(item.id);
        continue;
      }
      if (item.children) {
        this.updateHiddenIdsListRecursively(item.children, hiddenItemsIds, comparisonFn);
      }
    }
  }

  private updateItemsVisibilityRecursively(items: KeepsNavigationItem[], hiddenItemsIds: Set<string>): void {
    for (const item of items) {
      item.hidden = hiddenItemsIds.delete(item.id);
      if (item.children) {
        this.updateItemsVisibilityRecursively(item.children, hiddenItemsIds);
      }
    }
  }

  /**
   * Changes the visibility of a single navigation item
   * @param itemId The item id to update
   * @param visible Whether the item should be visible or not
   */
  setItemVisibility(itemId: string, visible: boolean) {
    const currentNavigationItens = this.currentNavigationItems;
    const navigationItem = this.getNavigationItemById(currentNavigationItens, itemId);
    if (!navigationItem) {
      return;
    }
    navigationItem.hidden = !visible;
    this.currentNavigation.set(currentNavigationItens);
  }

  /**
   * Searches recursively by a navigation item by its id
   * @param currentItems The current navigation items
   * @param id The id of the item to look for
   */
  getNavigationItemById(currentItems: KeepsNavigationItem[], id: string): KeepsNavigationItem | undefined {
    for (const item of currentItems) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const child = this.getNavigationItemById(item.children, id);
        if (child) {
          return child;
        }
      }
    }
    return undefined;
  }
}
