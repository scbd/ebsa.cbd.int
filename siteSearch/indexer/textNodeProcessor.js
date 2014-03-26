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
    extractTextNodes(fileContentMap[pageName], function(error, nodes) {
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
    var noWhitespaceNodes = textOnlyNodes.map(function(node) {
      return node.data.trim();
    });
    callback(null, noWhitespaceNodes);
  });
}