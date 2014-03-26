var utils = require('./dirUtils'),
  async = require('async'),
  config = require('../config'),
  path = require('path'),
  fs = require('fs'),
  exports = module.exports;

var viewFileExtension = '.html',
  viewsPath = config.viewDir;

// Views that should not be searched for text.
var searchablePages = ['resources', 'about'];

// Hash used to map filenames from disk to actual urls on the site.
var viewToPathMap = {
  'about': '/about',
  'resources': '/resources'
};


exports.loadAllViews = function loadAllViews(callback) {
  async.waterfall([
    utils.walkDir.bind(null, viewsPath),
    filterNonSearchable,
    createFileContentMap
  ], function(error, fileContentMap) {
    callback(fileContentMap);
  });
};

function createFileContentMap(files, done) {
  var map = {};
  async.each(files, function(file, done) {
    fs.readFile(file, function(err, contents) {
      var baseFilename = path.basename(file, viewFileExtension);
      map[baseFilename] = contents.toString('utf8');
      done(null);
    });
  }, function() {
    done(null, map);
  });
}

function filterNonSearchable(files, done) {
  // grab only the html files from the views dir.
  var filtered = files.filter(function(file) {
    return path.extname(file) === viewFileExtension &&
      (searchablePages.indexOf(path.basename(file, viewFileExtension)) !== -1);
  });

  done(null, filtered);
}