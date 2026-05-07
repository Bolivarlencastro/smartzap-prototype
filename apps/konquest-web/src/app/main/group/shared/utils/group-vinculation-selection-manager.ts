export class GroupVinculationSelectionManager {
  private _selection: Record<string, string> = {};

  toggleSelection(item: string): void {
    if (this._selection[item]) {
      delete this._selection[item];
    } else {
      this._selection[item] = 'selected';
    }
  }

  selectAll(items: string[]): void {
    if (!items?.length) {
      this.clear();
      return;
    }

    for (const item of items) {
      this._selection[item] = 'selected';
    }
  }

  get selectionSize(): number {
    return Object.keys(this._selection).length;
  }

  get selectedIds(): string[] {
    return Object.keys(this._selection);
  }

  get selection(): Record<string, string> {
    return { ...this._selection };
  }

  clear(): void {
    this._selection = {};
  }
}
