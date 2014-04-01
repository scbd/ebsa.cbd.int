module.exports = function(config) {
  config.set({
    basePath: '../',

    frameworks: ['mocha', 'requirejs', 'sinon-chai'],
    files: [
      {pattern: 'app/**/*.js', included: false, watched: false},
      // {pattern: 'test/unit.js', included: false},
      {pattern: 'test/unit/**/*.js', included: false},
      {pattern: 'test/unit/fixtures/**/*.json', watched: true, included: false, served: true},
      {pattern: 'app/libs/**/*.js', included: false},

      // needs to be last http://karma-runner.github.io/0.10/plus/requirejs.html
      'test/main-test.js'
    ],
    exclude: ['app/main.js', 'boot.js'],

    autoWatch: true,

    LogLevel: config.LOG_DEBUG,

    browsers: ['Chrome'],

    singleRun: false,

    // urlRoot: '__karma__',

    proxies: {
      '/': 'http://localhost:2010/ebsa/'
    },

    colors: true,

    reporters: ['dots', 'osx']

  });
};
