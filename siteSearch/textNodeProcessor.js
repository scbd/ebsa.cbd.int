var fs = require('fs'),
  path = require('path'),
  async = require('async'),
  jsdom = require('jsdom'),
  jquery = require('jquery');


var viewFileExtension = '.html',
  relativePathToViews = '../app/views';

// Views that should not be searched for text.
var searchablePages = ['resources', 'about'];

// Hash used to map filenames from disk to actual urls on the site.
var viewToPathMap = {
  'about': '/about',
  'resources': '/resources'
};

module.exports.process = function process(callback) {
  var results = [];
  loadAllViews(function(fileContentMap) {
    var textNodeMap = {};
    async.each(Object.keys(fileContentMap), function(pageName, done) {
      extractTextNodes(fileContentMap[pageName], function(error, nodes) {
        textNodeMap[pageName] = nodes;
        done();
      });
    }, function() {
      indexNodes(textNodeMap, callback);
    });
  });
};

function indexNodes(nodeMap, callback) {
  callback(nodeMap);
}

function getTextNodes(node) {
  var all = [];
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (node.nodeType == 3) all.push(node);
    else all = all.concat(getTextNodes(node));
  }
  return all;
}

function extractTextNodes(html, callback) {
  jsdom.env(html, function(errors, window) {
    var nodes,
      textOnlyNodes,
      body = window.document.getElementsByTagName('body')[0];

    // remove whitespace only nodes.
    textOnlyNodes = getTextNodes(body)
      .filter(function(node) {
        return !/^\s*$/.test(node.data);
      });
    var noWhitespaceNodes = textOnlyNodes.map(function(node) { return node.data.trim(); });
    callback(null, noWhitespaceNodes);
  });
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
      (searchablePages.indexOf(path.basename(file, viewFileExtension)) !== -1);
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