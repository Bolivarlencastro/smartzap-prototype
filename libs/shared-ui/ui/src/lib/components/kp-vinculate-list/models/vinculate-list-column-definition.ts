export interface VinculateListColumnDefinition<T> {
  title: string;
  property: keyof T & string;
}
