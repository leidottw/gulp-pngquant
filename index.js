const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const pngquant = require('node-pngquant-native');

// consts
const PLUGIN_NAME = 'gulp-pngquant';

// plugin level function (dealing with files)
function gulpPngquant(options) {
    // creating a stream through which each file will pass
    var stream = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            file.contents = pngquant.compress(file.contents, options);
        }

        // make sure the file goes through the next gulp plugin
        this.push(file);

        // tell the stream engine that we are done with this file
        cb();
    });

    // returning the file stream
    return stream;
};

// exporting the plugin main function
module.exports = gulpPngquant;