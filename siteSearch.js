var fs = require('fs'),
  path = require('path'),
  async = require('async');


var viewFileExtension = '.html',
  relativePathToViews = 'app/views';

// Views that should not be searched for text.
var nonSearchable = [
  '404',
  'gmap',
  'meetings',
  'meetingsCalendar',
  'meetingsCalendar.short',
  'header',
  'navbar',
  'breadcrumbs',
  'footer',
  'index',
  'partners'
];

// Map used to map filenames from disk to actual urls on the site.
var viewToPathMap = {
  'about': '/about',
  'ebsas': '/ebsas',
  'partners': '/resources'
};

function siteSearch(query, callback) {
  var results = [];
  loadAllViews(function(fileContentMap) {

    Object.keys(fileContentMap).forEach(function(pageName) {
      var html = fileContentMap[pageName],
        matches = searchTextNodes(query, html);

      if (matches.length) results.push({
        page: pageName,
        url: viewToPathMap[pageName],
        matches: matches
      });
    });

    callback(results);
  });
}

function searchTextNodes(content) {
  var matches = [];
  return content;
  // return callback(matches);
}

function loadAllViews(callback) {
  var viewPath = path.join(__dirname, relativePathToViews);

  async.waterfall([
    walkDir.bind(null, viewPath),
    filterNonSearchable,
    getFileContentMap
  ], function(error, fileContentMap) {
    callback(fileContentMap);
  });
}

function getFileContentMap(files, done) {
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
      (nonSearchable.indexOf(path.basename(file, viewFileExtension)) === -1);
  });

  done(null, filtered);
}


function walkDir(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walkDir(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

module.exports.route = function(req, res) {
  var query = req.query.q;
  siteSearch(query, function(results) {
    res.json(results);
    res.end();
  });
};