const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const pngquant = require('pngquant-bin');
const execFileSync = require('child_process').execFileSync;
const spawnSync = require('child_process').spawnSync;

const chalk = require('chalk');

// consts
const PLUGIN_NAME = 'gulp-pngquant';

// plugin level function (dealing with files)
function gulpPngquant(options) {
    var opts = [];
    for(key in options) {
        opts.push('--' + key, options[key]);
    }
    opts.push('-');

    // creating a stream through which each file will pass
    var stream = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            console.log(chalk.blue('pngquant compressing: ') + file.relative);

            file.contents = spawnSync(pngquant, opts, {
                input: file.contents
            }).stdout;
        }

        // make sure the file goes through the next gulp plugin
        this.push(file);

        // tell the stream engine that we are done with this file
        cb();
    }, function(flush) {
        gutil.log('Finished', '\'' + chalk.cyan(PLUGIN_NAME));
        flush();
    });

    // returning the file stream
    return stream;
};

// exporting the plugin main function
module.exports = gulpPngquant;
