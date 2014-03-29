module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine', 'requirejs'],
    files: [
      {pattern: 'app/**/*.js', included: false},
      {pattern: 'test/unit.js', included: false},
      {pattern: 'test/unit/*.js', included: false},
      {pattern: 'test/unit/**/*.js', included: false},
      {pattern: 'app/libs/**/*.js', included: false},
      // needs to be last http://karma-runner.github.io/0.10/plus/requirejs.html
      'test/main-test.js'
  ],
  exclude: ['app/js/main.js'],

  autoWatch: true,

  LogLevel: config.LOG_DEBUG,

  browsers: ['Chrome'],

  port: 8082,

  singleRun: false

  });
};
