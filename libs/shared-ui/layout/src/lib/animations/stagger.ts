import { trigger, state, style, transition, query, stagger, animateChild } from '@angular/animations';

const animateStagger = trigger('animateStagger', [
  state('50', style('*')),
  state('100', style('*')),
  state('200', style('*')),

  transition('void => 50', query('@*', [stagger('50ms', [animateChild()])], { optional: true })),
  transition('void => 100', query('@*', [stagger('100ms', [animateChild()])], { optional: true })),
  transition('void => 200', query('@*', [stagger('200ms', [animateChild()])], { optional: true })),
]);

export { animateStagger };
