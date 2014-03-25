var lunr = require('lunr'),
  fs = require('fs');

var documents = JSON.parse(fs.readFileSync(__dirname + '/data/lunr-docs.json'));
var serIndex = JSON.parse(fs.readFileSync(__dirname + '/data/lunr-index.json'));

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