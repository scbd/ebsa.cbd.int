var siteSearch = require('./interface');

module.exports = function(req, res) {
  var query = req.query.q;
  siteSearch.search(query, function(json) {
    res.json(json);
    res.end();
  });
};