const { spawn } = require('child_process');
const { getModifiedFiles, getModifiedApps } = require('./sonar-utils');

const runSonar = async (affectedProjects) => {
  return new Promise((resolve, reject) => {
    const nxProcess = spawn(
      'npx',
      ['nx', 'run-many', '-t', 'sonar', '-p', affectedProjects, '--skip-nx-cache', '--parallel=1'],
      {
        shell: true,
        stdio: 'inherit',
      },
    );

    nxProcess.on('error', (err) => {
      reject(err);
    });
  });
};

const main = async () => {
  const base = process.argv[2] || 'develop';
  const head = process.argv[3] || 'HEAD';

  const modifiedFiles = await getModifiedFiles(base, head);
  const modifiedApps = await getModifiedApps(modifiedFiles);

  await runSonar(modifiedApps);
};

main();
