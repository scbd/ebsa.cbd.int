module.exports = function (grunt) {

  // load all grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg      : grunt.file.readJSON('package.json'),
    bower: {
      install: {
        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },
    express: {
      options: {
        port: process.env.PORT || 2010
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
      // prod: {
      //   options: {
      //     script: 'dist/server.js',
      //     node_env: 'production'
      //   }
      // }
    },
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('default', ['bower']);
  grunt.registerTask('serve', ['express:dev', 'express-keepalive']);
};