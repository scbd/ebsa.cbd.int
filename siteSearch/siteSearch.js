/*jshint quotmark:false*/
var lunr = require('lunr'),
  fs = require('fs'),
  path = require('path'),
  config = require('./config');

try {
  var documents = JSON.parse(fs.readFileSync(path.join(config.dataDir, 'lunr-docs.json')));
  var serIndex = JSON.parse(fs.readFileSync(path.join(config.dataDir, 'lunr-index.json')));
}
catch (e) {
  throw new Error("Failed to parse document or index json\n", e);
}

var index = lunr.Index.load(serIndex);

module.exports.search = function(query, callback) {
  var matches = index.search(query),
    results = [];
  matches.forEach(function(match) {
    results.push(documents.filter(function(doc) {
      return doc.id.toString() === match.ref;
    })[0]);
  });
  return callback(results);
};