var lunr = require('lunr'),
  fs = require('fs'),
  views = require('./views'),
  textNodes = require('./textNodeProcessor'),
  config = require('../config'),
  path = require('path');


module.exports.create = function(callback) {
  var nodeMetaData;
  views.loadAllViews(function(fileContentMap) {
    textNodes.process(fileContentMap, function(nodes) {
      var documents = nodes;

      var index = lunr(function() {
        this.field('body');
        this.ref('id');
      });

      var id = 0;
      var indexedDocs = [];
      Object.keys(documents).forEach(function(pageName) {
        var textNodes = documents[pageName];

        textNodes.forEach(function(node) {
          node.id = id;
          indexedDocs.push(node);
          ++id;
        });
      });

      indexedDocs.forEach(function(doc) {
        index.add(doc);
      });

      fs.writeFileSync(path.join(config.dataDir, 'lunr-docs.json'), JSON.stringify(indexedDocs));
      fs.writeFileSync(path.join(config.dataDir, 'lunr-index.json'), JSON.stringify(index.toJSON()));

      callback('Index successfully generated!');
    });
  });
};

if (process.argv[2] === 'cl') module.exports.create(function(msg) {
  console.log(msg);
});