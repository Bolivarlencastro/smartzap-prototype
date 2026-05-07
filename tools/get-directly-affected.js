const { getModifiedFiles, getModifiedApps } = require('./sonar-utils');
const main = async () => {
  const base = process.argv[2] || 'develop';
  const head = process.argv[3] || 'HEAD';

  const modifiedFiles = await getModifiedFiles(base, head);
  const modifiedApps = await getModifiedApps(modifiedFiles);

  process.stdout.write(modifiedApps);
};

main();
