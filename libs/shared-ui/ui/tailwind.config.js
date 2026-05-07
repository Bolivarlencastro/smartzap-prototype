const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const baseTailwindConf = require('../tailwind-preset/tailwind.config');
const fuseTailwindPlugins = require('../layout/src/lib/tailwind/fuse-tailwind-plugins');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [baseTailwindConf],
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  plugins: [...fuseTailwindPlugins],
};
