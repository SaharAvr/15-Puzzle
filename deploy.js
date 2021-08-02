/* eslint-disable no-console */

const path = require('path');
const fs = require('fs-extra');

const rootPath = path.join.bind(path, __dirname);

const dirPaths = {
  ROOT: rootPath('.'),
  CLIENT: rootPath('./client'),
  BUILD: rootPath('./client/build'),
};

const spawnPromise = (cmd, args, options) => {

  // eslint-disable-next-line global-require
  const { spawn } = require('child_process');

  return new Promise((resolve, reject) => {

    const process = spawn(cmd, args, options);

    process.stdout.on('data', data => console.log(`${data}`));
    process.stderr.on('data', data => console.log(`${data}`));
    process.on('close', resolve);
    process.on('error', reject);

  });
  
};

const deleteBuildFolder = () => {

  if (!fs.existsSync(dirPaths.BUILD)) {
    return;
  }

  fs.rmSync(dirPaths.BUILD, { recursive: true });

};

const buildProject = () => (

  spawnPromise('yarn', ['build'], {
    cwd: dirPaths.CLIENT,
    shell: true,
  })

);

const deploy = () => (

  spawnPromise('git', ['push -f heroku'], {
    cwd: dirPaths.CLIENT,
    shell: true,
  })

);

const commitChanges = async () => {

  await spawnPromise('git', ['add --all'], {
    cwd: dirPaths.ROOT,
    shell: true,
  });

  await spawnPromise('git', [`commit -m '[FEAT] build - ${new Date().toLocaleDateString('he-IL').replace(/\./g, '/')}'`], {
    cwd: dirPaths.ROOT,
    shell: true,
  });

};

const uncommitChanges = () => (

  spawnPromise('git', ['reset --hard HEAD~1'], {
    cwd: dirPaths.ROOT,
    shell: true,
  })

);


(async () => {

    deleteBuildFolder();
    await buildProject();
    await commitChanges();
    await deploy();
    await uncommitChanges();
    deleteBuildFolder();

})();
