var siteSearch = require('./siteSearch');

module.exports = function(req, res) {
  var query = req.query.q;
  siteSearch.search(query, function(json) {
    res.json(json);
    res.end();
  });
};