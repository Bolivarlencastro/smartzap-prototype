import { FormControl } from '@angular/forms';

interface ToolModel<S> {
  name: S;
  url: S;
  icon: S;
}

export type Tool = ToolModel<string>;
export type ToolForm = ToolModel<FormControl<string>>;

export const toolsHubIcons: string[] = [
  'agriculture',
  'manage_accounts',
  'content_cut',
  'chat_bubble',
  'sms',
  'palette',
  'code',
  'campaign',
  'gavel',
  'menu_book',
  'mail',
  'email',
  'build',
  'handyman',
  'work',
  'business_center',
  'smart_display',
  'ondemand_video',
  'school',
  'paid',
  'savings',
  'image',
  'eco',
  'grass',
  'person_add',
  'local_hospital',
  'home',
  'smartphone',
  'public',
  'language',
  'laptop',
  'auto_awesome',
  'new_releases',
  'fitness_center',
  'sanitizer',
  'checklist',
  'rocket_launch',
  'badge',
  'account_circle',
  'account_tree',
  'group',
  'shopping_cart',
  'thumb_up',
  'share',
  'label',
  'sell',
  'mouse',
  'schedule',
  'watch_later',
  'check',
  'design_services',
  'close',
];
