export type UploadWorkspaceImageDto = {
  workspaceId: string;
  file: File;
  type: 'icon' | 'logo';
};

export type UpdateWorkspaceDarkThemeDto = {
  workspaceId: string;
  theme_dark: boolean;
};
