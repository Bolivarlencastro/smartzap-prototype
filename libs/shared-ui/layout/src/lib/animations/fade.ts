import { animate, state, style, transition, trigger } from '@angular/animations';
import { FuseAnimationCurves, FuseAnimationDurations } from './defaults';

// -----------------------------------------------------------------------------------------------------
// @ Fade in out
// -----------------------------------------------------------------------------------------------------
const fadeInOut = trigger('fadeInOut', [
  state(
    '0, void',
    style({
      opacity: 0,
    }),
  ),
  state(
    '1, *',
    style({
      opacity: 1,
    }),
  ),
  transition('1 => 0', animate('300ms ease-out')),
  transition('0 => 1', animate('300ms ease-in')),
  transition('void <=> *', animate('300ms ease-in')),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade in
// -----------------------------------------------------------------------------------------------------
const fadeIn = trigger('fadeIn', [
  state(
    'void',
    style({
      opacity: 0,
    }),
  ),

  state(
    '*',
    style({
      opacity: 1,
    }),
  ),

  // Prevent the transition if the state is false
  transition('void => false', []),

  // Transition
  transition('void => *', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade in top
// -----------------------------------------------------------------------------------------------------
const fadeInTop = trigger('fadeInTop', [
  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(0, -100%, 0)',
    }),
  ),

  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('void => false', []),

  // Transition
  transition('void => *', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade in bottom
// -----------------------------------------------------------------------------------------------------
const fadeInBottom = trigger('fadeInBottom', [
  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(0, 100%, 0)',
    }),
  ),

  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('void => false', []),

  // Transition
  transition('void => *', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade in left
// -----------------------------------------------------------------------------------------------------
const fadeInLeft = trigger('fadeInLeft', [
  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)',
    }),
  ),

  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('void => false', []),

  // Transition
  transition('void => *', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade in right
// -----------------------------------------------------------------------------------------------------
const fadeInRight = trigger('fadeInRight', [
  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)',
    }),
  ),

  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('void => false', []),

  // Transition
  transition('void => *', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.entering} ${FuseAnimationCurves.deceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade out
// -----------------------------------------------------------------------------------------------------
const fadeOut = trigger('fadeOut', [
  state(
    '*',
    style({
      opacity: 1,
    }),
  ),

  state(
    'void',
    style({
      opacity: 0,
    }),
  ),

  // Prevent the transition if the state is false
  transition('false => void', []),

  // Transition
  transition('* => void', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.exiting} ${FuseAnimationCurves.acceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade out top
// -----------------------------------------------------------------------------------------------------
const fadeOutTop = trigger('fadeOutTop', [
  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(0, -100%, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('false => void', []),

  // Transition
  transition('* => void', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.exiting} ${FuseAnimationCurves.acceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade out bottom
// -----------------------------------------------------------------------------------------------------
const fadeOutBottom = trigger('fadeOutBottom', [
  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(0, 100%, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('false => void', []),

  // Transition
  transition('* => void', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.exiting} ${FuseAnimationCurves.acceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade out left
// -----------------------------------------------------------------------------------------------------
const fadeOutLeft = trigger('fadeOutLeft', [
  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('false => void', []),

  // Transition
  transition('* => void', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.exiting} ${FuseAnimationCurves.acceleration}`,
    },
  }),
]);

// -----------------------------------------------------------------------------------------------------
// @ Fade out right
// -----------------------------------------------------------------------------------------------------
const fadeOutRight = trigger('fadeOutRight', [
  state(
    '*',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    }),
  ),

  state(
    'void',
    style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)',
    }),
  ),

  // Prevent the transition if the state is false
  transition('false => void', []),

  // Transition
  transition('* => void', animate('{{timings}}'), {
    params: {
      timings: `${FuseAnimationDurations.exiting} ${FuseAnimationCurves.acceleration}`,
    },
  }),
]);

export {
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
};
