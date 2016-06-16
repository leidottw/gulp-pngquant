const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const pngquant = require('pngquant-bin');
const fs = require('fs');
const execFileSync = require('child_process').execFileSync;
const chalk = require('chalk');

// consts
const PLUGIN_NAME = 'gulp-pngquant';

// plugin level function (dealing with files)
function gulpPngquant(options) {
    var opts = ['in.png', '-o', 'out.png'];
    for(key in options) {
        opts.push('--' + key, options[key]);
    }

    // creating a stream through which each file will pass
    var stream = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            fs.writeFileSync('in.png', file.contents);
            execFileSync(pngquant, opts);

            file.contents = fs.readFileSync('out.png');

            fs.unlinkSync('in.png');
            fs.unlinkSync('out.png');
        }

        // make sure the file goes through the next gulp plugin
        this.push(file);

        // tell the stream engine that we are done with this file
        cb();
    }, function() {
        gutil.log('Finished', '\'' + chalk.cyan(PLUGIN_NAME));
    });

    // returning the file stream
    return stream;
};

// exporting the plugin main function
module.exports = gulpPngquant;