var fs = require('fs'),
  path = require('path'),
  async = require('async'),
  jsdom = require('jsdom'),
  jquery = require('jquery'),
  config = require('../config');


module.exports.process = function process(fileContentMap, callback) {
  var results = [];
  var textNodeMap = {};
  async.each(Object.keys(fileContentMap), function(pageName, done) {
    extractTextNodes(fileContentMap[pageName], pageName, function(error, nodes) {
      textNodeMap[pageName] = nodes;
      done();
    });
  }, function() {
    callback(textNodeMap);
  });
};

function getTextNodes(node) {
  var all = [];
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (node.nodeType == 3) all.push(node);
    else all = all.concat(getTextNodes(node));
  }
  return all;
}

function createPathCalculatorPlugin(jQuery) {
  jQuery.fn.extend({
    findTab: function() {
      return this.parents('[id]').attr('id');
    },
    getPath: function() {
      var path, node = this;
      while (node.length) {
        var realNode = node[0],
          name = realNode.nodeName;
        if (!name) break;
        name = name.toLowerCase();

        var parent = node.parent();

        var sameTagSiblings = parent.children(name);
        if (sameTagSiblings.length > 1) {
          allSiblings = parent.children();
          var index = allSiblings.index(realNode) + 1;
          if (index > 1) {
            name += ':nth-child(' + index + ')';
          }
        }

        path = name + (path ? '>' + path : '');
        node = parent;
      }

      return path;
    }
  });
}

function extractTextNodes(html, pageName, callback) {
  jsdom.env(html, function(errors, window) {
    var nodes,
      nodesWithMetaData = [],
      body = window.document.getElementsByTagName('body')[0];

    var $ = jquery(window);
    createPathCalculatorPlugin($);

    // remove whitespace only nodes.
    textOnlyNodes = getTextNodes(body)
      .filter(function(node) {
        return !/^[\s\n\r]*$/.test(node.data);
      })
      .forEach(function(node) {
        var $node = $(node);
        nodesWithMetaData.push({
          body: node.data.trim(),
          xpath: $node.getPath().replace('#document>html>body>', '').replace('>#text', ''),
          tab: $node.findTab(),
          pageName: pageName
        });
      });

    //normally we'd close the window to free up memory, but this causes the node
    //process to segfault with a stacktrace. See: https://github.com/tmpvar/jsdom/issues/614
    // window.close();
    callback(null, nodesWithMetaData);
  });
}