const { resolve } = require('path');

const plugins = [
  require(resolve(__dirname, './plugins/utilities')),
  require(resolve(__dirname, './plugins/icon-size')),
];

module.exports = plugins;
