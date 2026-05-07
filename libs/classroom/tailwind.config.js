const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const baseTailwindConf = require('../shared-ui/tailwind-preset/tailwind.config');
const fuseTailwindPlugins = require('../shared-ui/layout/src/lib/tailwind/fuse-tailwind-plugins');

module.exports = {
  presets: [baseTailwindConf],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,scss,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [...fuseTailwindPlugins],
};
