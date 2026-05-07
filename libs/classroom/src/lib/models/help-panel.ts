import { marker } from '@jsverse/transloco-keys-manager/marker';

export interface HelpPanelSection {
  title: string;
  subtitle: string;
  items: HelpPanelSectionItem[];
}

export interface HelpPanelSectionItem {
  icon?: string;
  label: string;
}

export const HELP_PANEL_SECTIONS: HelpPanelSection[] = [
  {
    title: marker('CLASSROOM.HELP_PANEL.TOP_BAR.TITLE'),
    subtitle: marker('CLASSROOM.HELP_PANEL.TOP_BAR.SUBTITLE'),
    items: [
      { icon: 'apps', label: marker('CLASSROOM.HELP_PANEL.TOP_BAR.MENU') },
      { icon: 'arrow_back', label: marker('CLASSROOM.HEADER_NAV.RETURN') },
      { icon: 'arrow_forward', label: marker('CLASSROOM.HEADER_NAV.FORWARD') },
      { icon: null, label: marker('CLASSROOM.HELP_PANEL.TOP_BAR.ADVANCE_BLOCK') },
    ],
  },
  {
    title: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.TITLE'),
    subtitle: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.SUBTITLE'),
    items: [
      { icon: 'list', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.SUMMARY') },
      { icon: 'analytics', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.PROGRESS') },
      { icon: 'school', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.CERTIFICATE') },
      { icon: 'help', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.HELP') },
      { icon: 'dark_mode', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.DARK_MODE') },
      { icon: 'light_mode', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.LIGHT_MODE') },
      { icon: 'fullscreen', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.FULLSCREEN') },
      { icon: 'keyboard_return', label: marker('CLASSROOM.HELP_PANEL.SIDE_MENU.EXIT_COURSE') },
    ],
  },
  {
    title: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.TITLE'),
    subtitle: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.SUBTITLE'),
    items: [
      { icon: 'keyboard', label: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.VIDEO_AUDIO_TRANSCRIPTION') },
      { icon: 'share', label: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.SHARE_CERTIFICATE') },
      { icon: 'download', label: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.CERTIFICATE_DOWNLOAD') },
      { icon: 'lock', label: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.CERTIFICATE_BLOCKED') },
      { icon: 'lock_open', label: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.CERTIFICATE_UNLOCKED') },
      { icon: 'help', label: marker('CLASSROOM.HELP_PANEL.CONTENT_PANEL.CONTENT_INFO') },
    ],
  },
];
