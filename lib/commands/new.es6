var join = require('path').join;
var copy = require('fs-extra').copySync;
var child = require('child_process');
var spawnSync = child.spawnSync;

module.exports = function(cli) {
  var appName = cli.args[1];
  var appDir = join(cli.cwd, appName);
  var apiDir = join(appDir, cli.apiName);
  var feDir = join(appDir, cli.feName);
  var templatesPath = join(cli.includedBasepath, 'lib', 'templates');

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

    copy(join(templatesPath, '.seedsrc'), join(appDir, '.seedsrc'));
    copy(join(templatesPath, 'package.json'), join(appDir, 'package.json'), {clobber: true});

    spawnSync('npm', ['install'], {cwd: join(cli.cwd, appName)});
    return;
  };

  var setupSails = function() {
    cli.debug('setupSails');

    spawnSync(join(appDir, 'node_modules', '.bin', 'sails'), ['generate', 'seeds-backend'], {cwd: apiDir});
    spawnSync('npm', ['install'], {cwd: apiDir});
    return;
  };

  var setupEmber = function() {
    cli.debug('setupEmber');

    spawnSync(join(appDir, 'node_modules', '.bin', 'sails'), ['generate', 'seeds-frontend'], {cwd: feDir});
    spawnSync('npm', ['install'], {cwd: feDir});
    copy(join(appDir, 'node_modules', 'sails-generate-seeds-frontend', 'templates', 'bower_components'), join(feDir, 'bower_components'));
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
