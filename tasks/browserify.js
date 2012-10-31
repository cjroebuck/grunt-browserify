/*
 * grunt-browserify
 * https://github.com/pix/grunt-browserify
 *
 * Copyright (c) 2012 Camille Moncelier
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md
  // ==========================================================================
  // TASKS
  // ==========================================================================
  grunt.registerMultiTask('browserify', 'Your task description goes here.', function () {
    var browserify = require('browserify'),
      b = browserify(this.data.options || {}),
      files, src;

    self = this
    b.on('bundle', function() {
      grunt.verbose.writeln('re-bundle');
      grunt.file.write(self.target, b.bundle());
    });


    (this.data.requires || []).forEach(function (req) {
      grunt.verbose.writeln('Adding "' + req + '" to the required module list');
      b.require(req);
    });

    (this.data.aliases || []).forEach(function (alias) {
      grunt.verbose.writeln('Adding "' + alias + '" to the aliases list');

      b.alias.apply(b, alias.split(":"));
    });

    grunt.file.expandFiles(this.data.entries || []).forEach(function (filepath) {
      grunt.verbose.writeln('Adding "' + filepath + '" to the entry file list');
      b.addEntry(filepath);
    });

    files = grunt.file.expandFiles(this.data.prepend || []);
    src = grunt.helper('concat', files, {
      separator: ''
    });
    b.prepend(src);

    files = grunt.file.expandFiles(this.data.append || []);
    src = grunt.helper('concat', files, {
      separator: ''
    });
    b.append(src);

    if (this.data.hook) {
      this.data.hook.call(this, b);
    }

    grunt.file.write(this.target, b.bundle());
  });

};
