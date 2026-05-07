export class KpEditDialogForm {
  constructor(
    public id: string,
    public name: string,
    public description: string,
  ) {}
}

export interface KpEditDialog {
  title: string;
  label?: string;
  model: KpEditDialogForm;
  showDescription: boolean;
}
