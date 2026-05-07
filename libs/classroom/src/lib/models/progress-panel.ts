export interface ProgressPanelCard {
  id: string;
  title: string;
  infoDialogData: ProgressPanelCardDialogData;
  referenceValue: unknown;
  value: unknown;
}

export interface ProgressPanelCardDialogData {
  title: string;
  description: string;
}

export interface ProgressPanelViewModel {
  displayGoalDateEdit: boolean;
  isGoalDateMenuOpen: boolean;
  cards: ProgressPanelCard[];
}
