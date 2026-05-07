const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const baseTailwindConf = require('../../libs/shared-ui/tailwind-preset/tailwind.config');

module.exports = {
  presets: [baseTailwindConf],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,scss,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
