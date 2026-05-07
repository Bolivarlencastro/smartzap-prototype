const colors = require('tailwindcss/colors');

/**
 * Tailwind configuration
 */
const config = {
  darkMode: 'class',
  important: true,
  theme: {
    fontFamily: {
      sans: 'Roboto Flex, Helvetica Neue, Arial, sans-serif',
    },
    screens: {
      xxs: '432px',
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1440px',
    },
    extend: {
      fontSize: {
        xxs: '0.5rem',
        '2xxs': '0.625rem',
        '10xl': '8rem',
      },
      borderWidth: {
        1: '1px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        gray: colors.slate,
      },
      flex: {
        0: '0 0 auto',
      },
      opacity: {
        12: '0.12',
        38: '0.38',
        87: '0.87',
      },
      rotate: {
        '-270': '270deg',
        15: '15deg',
        30: '30deg',
        60: '60deg',
        270: '270deg',
      },
      scale: {
        '-1': '-1',
      },
      zIndex: {
        '-1': -1,
        49: 49,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        99: 99,
        999: 999,
        9999: 9999,
        99999: 99999,
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        50: '12.5rem',
        90: '22.5rem',

        // Bigger values
        100: '25rem',
        120: '30rem',
        128: '32rem',
        140: '35rem',
        160: '40rem',
        180: '45rem',
        192: '48rem',
        200: '50rem',
        240: '60rem',
        256: '64rem',
        280: '70rem',
        320: '80rem',
        360: '90rem',
        400: '100rem',
        480: '120rem',

        // Fractional values
        '1/2': '50%',
        '1/3': '33.333333%',
        '1.4/3': '49%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
        '1/12': '8.333333%',
        '2/12': '16.666667%',
        '3/12': '25%',
        '4/12': '33.333333%',
        '5/12': '41.666667%',
        '6/12': '50%',
        '7/12': '58.333333%',
        '8/12': '66.666667%',
        '9/12': '75%',
        '10/12': '83.333333%',
        '11/12': '91.666667%',
      },
      minHeight: (theme) => ({
        'screen-3/4': '75vh',
        ...theme('spacing'),
      }),
      maxHeight: (theme) => ({
        none: 'none',
      }),
      minWidth: (theme) => ({
        ...theme('spacing'),
        screen: '100vw',
      }),
      maxWidth: (theme) => ({
        ...theme('spacing'),
        screen: '100vw',
      }),
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        drawer: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },

      // @tailwindcss/typography
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: 'var(--kp-text-default)',
            '[class~="lead"]': {
              color: 'var(--kp-text-secondary)',
            },
            a: {
              color: 'var(--kp-primary-500)',
            },
            strong: {
              color: 'var(--kp-text-default)',
            },
            'ol > li::before': {
              color: 'var(--kp-text-secondary)',
            },
            'ul > li::before': {
              backgroundColor: 'var(--kp-text-hint)',
            },
            hr: {
              borderColor: 'var(--kp-border)',
            },
            blockquote: {
              color: 'var(--kp-text-default)',
              borderLeftColor: 'var(--kp-border)',
            },
            h1: {
              color: 'var(--kp-text-default)',
            },
            h2: {
              color: 'var(--kp-text-default)',
            },
            h3: {
              color: 'var(--kp-text-default)',
            },
            h4: {
              color: 'var(--kp-text-default)',
            },
            'figure figcaption': {
              color: 'var(--kp-text-secondary)',
            },
            code: {
              color: 'var(--kp-text-default)',
              fontWeight: '500',
            },
            'a code': {
              color: 'var(--kp-primary)',
            },
            pre: {
              color: theme('colors.white'),
              backgroundColor: theme('colors.gray.800'),
            },
            thead: {
              color: 'var(--kp-text-default)',
              borderBottomColor: 'var(--kp-border)',
            },
            'tbody tr': {
              borderBottomColor: 'var(--kp-border)',
            },
            'ol[type="A" s]': false,
            'ol[type="a" s]': false,
            'ol[type="I" s]': false,
            'ol[type="i" s]': false,
          },
        },
        sm: {
          css: {
            code: {
              fontSize: '1em',
            },
            pre: {
              fontSize: '1em',
            },
            table: {
              fontSize: '1em',
            },
          },
        },
      }),
      gridTemplateColumns: {
        '15-20': '5rem minmax(15rem, 20rem)',
      },
      gridAutoColumns: {
        15: '15rem',
      },
    },
  },
  corePlugins: {
    appearance: false,
    gradientColorStops: false,
    container: false,
    float: false,
    clear: false,
    placeholderColor: false,
    placeholderOpacity: false,
    verticalAlign: false,
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/typography')({ modifiers: ['sm', 'lg'] })],
};

module.exports = config;
