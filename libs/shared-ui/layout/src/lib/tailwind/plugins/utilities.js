const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents }) => {
  /*
   * Add base components. These are very important for everything to look
   * correct. We are adding these to the 'components' layer because they must
   * be defined before pretty much everything else.
   */
  addComponents({
    '.text-default': {
      color: 'var(--mat-sys-on-surface) !important',
    },
    '.border-default': {
      borderStyle: 'solid !important',
      borderColor: 'var(--mat-sys-outline-variant) !important',
    },
    '.text-primary': {
      color: 'var(--mat-sys-primary) !important',
    },
    '.text-on-primary': {
      color: 'var(--mat-sys-on-primary) !important',
    },
    '.text-secondary': {
      color: 'var(--mat-sys-on-surface-variant) !important',
    },
    '.text-warn': {
      color: 'var(--mat-sys-error) !important',
    },
    '.text-hint': {
      '--tw-text-opacity': '0.87 !important',
      color: 'rgba(var(--kp-text-hint-rgb), var(--tw-text-opacity)) !important',
    },
    '.text-disabled': {
      color: 'color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent) !important',
    },
    '.divider': {
      color: 'var(--kp-divider) !important',
    },
    '.bg-primary': {
      backgroundColor: 'var(--mat-sys-primary) !important',
    },
    '.bg-primary-container': {
      backgroundColor: 'var(--mat-sys-primary-container) !important',
    },
    '.text-on-primary-container': {
      color: 'var(--mat-sys-on-primary-container) !important',
    },
    '.kp-navigation-container': {
      backgroundColor: 'var(--kp-navigation-container) !important',
    },
    '.kp-on-navigation-container': {
      color: 'var(--kp-on-navigation-container) !important',
    },
    '.bg-secondary-container': {
      backgroundColor: 'var(--mat-sys-secondary-container) !important',
    },
    '.text-on-secondary-container': {
      color: 'var(--mat-sys-on-secondary-container) !important',
    },
    '.bg-card': {
      backgroundColor: 'var(--mat-sys-surface-container-high) !important',
    },
    '.bg-default': {
      backgroundColor: 'var(--mat-sys-surface) !important',
    },
    '.bg-dialog': {
      backgroundColor: 'var(--mat-sys-surface) !important',
    },
    '.ring-bg-default': {
      '--tw-ring-opacity': '1 !important',
      '--tw-ring-color': 'rgba(var(--kp-bg-default-rgb), var(--tw-ring-opacity)) !important',
    },
    '.ring-bg-card': {
      '--tw-ring-opacity': '1 !important',
      '--tw-ring-color': 'rgba(var(--kp-bg-card-rgb), var(--tw-ring-opacity)) !important',
    },
    '.filled': {
      '--icon-fill': '1 !important',
    },
  });

  addComponents({
    '.bg-hover': {
      backgroundColor: 'var(--mat-sys-on-surface) !important',
      opacity: 'var(--mat-sys-hover-state-layer-opacity) !important',
    },
  });
});
