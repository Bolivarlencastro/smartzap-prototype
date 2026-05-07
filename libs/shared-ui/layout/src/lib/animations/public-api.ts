import { legacyAnimate } from './legacy';
import { expandCollapse } from './expand-collapse';
import {
  fadeIn,
  fadeInBottom,
  fadeInLeft,
  fadeInOut,
  fadeInRight,
  fadeInTop,
  fadeOut,
  fadeOutBottom,
  fadeOutLeft,
  fadeOutRight,
  fadeOutTop,
} from './fade';
import { shake } from './shake';
import {
  slideInBottom,
  slideInLeft,
  slideInOut,
  slideInRight,
  slideInTop,
  slideOutBottom,
  slideOutLeft,
  slideOutRight,
  slideOutTop,
} from './slide';
import { animateStagger } from './stagger';
import { zoomIn, zoomOut } from './zoom';

export const fuseAnimations = [
  animateStagger,
  expandCollapse,
  fadeInOut,
  fadeIn,
  fadeInTop,
  fadeInBottom,
  fadeInLeft,
  fadeInRight,
  fadeOut,
  fadeOutTop,
  fadeOutBottom,
  fadeOutLeft,
  fadeOutRight,
  shake,
  slideInOut,
  slideInTop,
  slideInBottom,
  slideInLeft,
  slideInRight,
  slideOutTop,
  slideOutBottom,
  slideOutLeft,
  slideOutRight,
  zoomIn,
  zoomOut,
  legacyAnimate,
];
