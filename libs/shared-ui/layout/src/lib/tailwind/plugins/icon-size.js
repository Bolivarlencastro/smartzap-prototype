const plugin = require('tailwindcss/plugin');

module.exports = plugin(
  ({ addUtilities, theme }) => {
    const values = theme('iconSize');
    let utilities = Object.entries(values).map(([key, value]) => {
      return {
        [`.s-${key}`]: {
          width: value,
          height: value,
          minWidth: value,
          minHeight: value,
          fontSize: value,
          lineHeight: value,
          [`svg`]: {
            width: value,
            height: value,
          },
          '--optical-sizing': key,
        },
      };
    });

    addUtilities(utilities);
  },
  {
    theme: {
      iconSize: {
        0: '0.5rem',
        1: '0.625rem', // 10
        2: '0.75rem', // 12
        3: '0.875rem', // 14
        4: '1rem', // 16
        5: '1.125rem', // 18
        6: '1.25rem', // 20
        7: '1.5rem', // 24
        8: '1.75rem', // 28
        9: '2rem', // 32
        10: '2.5rem', // 40
        12: '3rem', // 48
        14: '3.5rem', // 56
        16: '4rem', // 64
        18: '4.5rem', // 72
        20: '5rem', // 80
        22: '5.5rem', // 88
        24: '6rem', // 96
      },
    },
  },
);
