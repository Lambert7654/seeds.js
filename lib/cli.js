'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Cli = require('soil-cli');
var join = require('path').join;
var aliases = require(join(__dirname, 'settings', 'aliases'));

var SeedsCLI = (function (_Cli) {
  function SeedsCLI(args, options) {
    _classCallCheck(this, SeedsCLI);

    _get(Object.getPrototypeOf(SeedsCLI.prototype), 'constructor', this).call(this, args, options);
    this.debugFlag = this.config.debug;

    this.nodeDir = join(this.cwd, 'node_modules');

    this.feName = this.config.ember[0].name;
    this.feDir = join(this.cwd, this.config.ember[0].name);

    this.apiName = this.config.sails.name;
    this.apiDir = join(this.cwd, this.config.sails.name);
    aliases.parse(this);
  }

  _inherits(SeedsCLI, _Cli);

  _createClass(SeedsCLI, [{
    key: 'runExternalCommand',
    value: function runExternalCommand(command, args, options) {
      this.debug('runExternalCommand', command);
      options = options || { cwd: '' + this.cwd };
      return this.spawn(command, args, options).progress(function (childProcess) {
        childProcess.stdout.on('data', function (data) {
          console.log('' + data.toString());
        });
        childProcess.stderr.on('data', function (data) {
          console.log('' + data.toString());
        });
      }).then(function (resolve) {
        this.debug('' + command + ' done', options);
        resolve();
      }).fail(function (err) {
        this.debug('fail ' + command, err);
      });
    }
  }, {
    key: 'config',
    get: function () {
      return require('rc')('seeds', {
        sails: {
          name: 'api',
          port: '1776'
        },
        ember: [{
          name: 'frontend',
          port: '4200'
        }],
        debug: true
      });
    }
  }, {
    key: 'package',
    get: function () {
      return require(join('..', 'package'));
    }
  }], [{
    key: 'cli',
    value: function cli(args, options) {
      return new SeedsCLI(args, options);
    }
  }]);

  return SeedsCLI;
})(Cli);

module.exports = SeedsCLI;