// we get all the test files automatically
var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/i.test(file)) {
      tests.push(file);
    }
  }
}

require.config({
  paths: {
    'angular'         : '../libs/angular/angular',
    'angular-route'   : '../libs/angular-route/angular-route',
    'angular-mocks'   : '../libs/angular-mocks/angular-mocks',
    'ng-breadcrumbs'  : '../libs/ng-breadcrumbs/dist/ng-breadcrumbs',
    'async'           : '../libs/requirejs-plugins/src/async',
    'domReady'        : '../libs/requirejs-domready/domReady',
    'jquery'          : '../libs/jquery/jquery',
    'bootstrap'       : '../libs/bootstrap-sass/dist/js/bootstrap',
    'underscore'      : '../libs/underscore/underscore',
    'angular-growl'   : '../libs/angular-growl/build/angular-growl',
    'gmapsapi'        : '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'
  },
  baseUrl: '/base/app/js',
  shim: {
    'angular'        : { 'deps': ['jquery'], 'exports': 'angular' },
    'angular-route'  : { 'deps': ['angular'] },
    'bootstrap'      : { 'deps': ['jquery'] },
    'underscore'     : { 'exports': '_' },
    'ng-breadcrumbs' : { 'deps': ['angular'] },
    'angular-growl'  : { 'deps': ['angular'] },
    'angular-mocks'  : { 'deps': ['angular'], 'exports': 'angular.mock' },
  },
  priority: ['angular'],
  deps: tests,
  callback: window.__karma__.start
});
