const kpVersion = {
  name: 'kpVersion',
  setup(build) {
    const options = build.initialOptions;
    options.define.KP_VERSION = (+new Date()).toString();
  },
};

module.exports = kpVersion;
