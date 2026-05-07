const { promisify } = require('util');
const { exec } = require('child_process');
const asyncExec = promisify(exec);

const getModifiedFiles = async (base, head) => {
  //console.log(`ℹ️ Verificando arquivos afetados com BASE=${base} e HEAD=${head}`);

  const gitDiffCommand = `git diff ${base} ${head} --name-only`;
  // console.log('Comando a ser executado', gitDiffCommand);

  try {
    const { stdout, stderr } = await asyncExec(gitDiffCommand);

    if (stderr) {
      console.error('⚠️ Erro ao recuperar arquivos afetados', stderr);
      process.exit(1);
    }

    const modifiedFiles = stdout.trim().split('\n');
    if (!modifiedFiles.join(' ')) {
      console.error(
        '✅ Nenhum arquivo modificado encontrado, certifique-se de realizar seu commit antes de realizar a verificação do sonar.',
      );
      process.exit(0);
    }

    // console.log('ℹ️ Modified files', modifiedFiles);

    return modifiedFiles;
  } catch (error) {
    console.error('Erro ao executar o comando git diff', error);
    process.exit(1);
  }
};

const getModifiedApps = async (modifiedFiles) => {
  try {
    const affectedProjectsNames = getAffectedProjectsNames(modifiedFiles);
    const affectedCommand = `npx nx show projects --affected --with-target test --projects=${Array.from(affectedProjectsNames.values()).join(',')}`;

    const affected = await asyncExec(affectedCommand);

    const affectedProjects = affected.stdout
      .trim()
      .split('\n')
      .filter((projectName) => {
        if (projectName === 'shared-ui-ui') {
          projectName = 'shared-ui';
        }

        return modifiedFiles.some((filePath) => filePath.includes(projectName));
      });

    return affectedProjects.join(' ');
  } catch (error) {
    console.error('Erro ao executar o comando npx nx show projects', error);
    process.exit(1);
  }
};

function getAffectedProjectsNames(files) {
  const affectedProjects = new Set();

  files.forEach((filePath) => {
    const segments = filePath.split('/');

    if ((segments[0] === 'apps' || segments[0] === 'libs') && segments.length > 1) {
      let projectName = segments[1];
      if (projectName === 'shared-ui') {
        projectName = 'shared-ui-ui';
      }

      if (!affectedProjects.has(projectName)) {
        affectedProjects.add(projectName);
      }
    }
  });

  return affectedProjects;
}

module.exports = { getModifiedApps, getModifiedFiles };
