import { marker } from '@jsverse/transloco-keys-manager/marker';
import { InnerNavItem } from '../components';

export const navItems: InnerNavItem[] = [
  {
    title: marker('PROFILE_FEATURE.GENERAL.PROFILE.ACCOUNT'),
    description: marker('PROFILE_FEATURE.GENERAL.PROFILE.ACCOUNT_MENU_DESC'),
    icon: 'contact_page',
    path: 'account',
  },
  {
    title: marker('PROFILE_FEATURE.GENERAL.PROFILE.AVATAR'),
    description: marker('PROFILE_FEATURE.GENERAL.PROFILE.AVATAR_MENU_DESC'),
    icon: 'image',
    path: 'avatar',
  },
  {
    title: marker('PROFILE_FEATURE.GENERAL.PROFILE.ADDITIONAL_INFO'),
    description: marker('PROFILE_FEATURE.GENERAL.PROFILE.ADDITIONAL_INFO_MENU_DESC'),
    icon: 'work',
    path: 'additional-info',
  },
  {
    title: marker('PROFILE_FEATURE.GENERAL.PROFILE.PASSWORD'),
    description: marker('PROFILE_FEATURE.GENERAL.PROFILE.PASSWORD_MENU_DESC'),
    icon: 'lock',
    path: 'password',
  },
];
