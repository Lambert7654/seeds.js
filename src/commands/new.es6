/*eslint no-undefined:0*/
/*eslint quote-props:0*/
/*eslint quotes:0*/

const bower = require('bower');
const join = require('path').join;
const copy = require('fs-extra').copySync;
const child = require('child_process');
const spawnSync = child.spawnSync;
const fs = require('fs');

module.exports = function(cli) {
  const appName = cli.args[1];
  const appDir = join(cli.cwd, appName);
  const apiDir = join(appDir, cli.apiName);
  const feDir = join(appDir, cli.feName);
  const templatesPath = join(cli.includedBasepath, 'lib', 'templates');

  var createAppFolder = function() {
    cli.debug('createAppFolder', appName);

    if (!appName) {
      cli.error('You must supply a name for your Seeds.js Application.');
      cli.exit(1);
    }

    cli.ui('Generating a new Seed named'.green(), appName.white() + '...'.green());
    cli.mkdir(feDir);
    return cli.mkdir(apiDir);
  };

  var bootstrapApp = function() {
    cli.debug('bootstrapApp');
    const rc = {
      "apps": {"sails": [{"name": "api", "port": 1776}], "ember": [{"name": "frontend", "port": 4200}]},
      "debug": false,
      "version": cli.package.version
    };

    copy(join(templatesPath, 'gitignore'), join(appDir, '.gitignore'));
    fs.writeFileSync(join(appDir, '.seedsrc'), JSON.stringify(rc, null, '\t'));
    copy(join(templatesPath, 'package.json'), join(appDir, 'package.json'), {clobber: true});

    spawnSync('npm', ['install'], {cwd: join(cli.cwd, appName)});
    return;
  };

  var setupSails = function() {
    cli.debug('setupSails');

    spawnSync(join(appDir, 'node_modules', '.bin', 'sails'), ['generate', 'seeds-backend'], {cwd: apiDir});
    spawnSync('npm', ['--cache-min', '9999999', 'install'], {cwd: apiDir});
    return;
  };

  var setupEmber = function() {
    cli.debug('setupEmber');

    spawnSync(join(appDir, 'node_modules', '.bin', 'sails'), ['generate', 'seeds-frontend'], {cwd: feDir});
    spawnSync('npm', ['--cache-min', '9999999', 'install'], {cwd: feDir});
    bower.commands.install(undefined, undefined, {cwd: feDir});
    return;
  };

  var wrapUp = function() {
    cli.debug('wrapUp');

    cli.banner(join(cli.includedBasepath, 'lib', 'helpers', 'banner'));
    return;
  };

  createAppFolder().then(function() {
    bootstrapApp();
    setupSails();
    setupEmber();
    wrapUp();
  });
};
