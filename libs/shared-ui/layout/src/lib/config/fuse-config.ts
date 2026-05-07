import { Layout } from '../layout/layout.types';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Themes = { id: string; name: string }[];

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig {
  layout: Layout;
  scheme: Scheme;
  screens: Screens;
  themeColor: string;
}

/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 *
 * "Screens" are carried over to the BreakpointObserver for accessing them within
 * components, and they are required.
 *
 * "Themes" are required for Tailwind to generate themes.
 */
export const defaultConfig: AppConfig = {
  layout: 'compact',
  scheme: 'light',
  screens: {
    xxs: '432px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1440px',
  },
  themeColor: '#4156ee',
};
