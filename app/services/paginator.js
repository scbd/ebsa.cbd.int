define(['./module.js', 'underscore'], function(module, _) {
  return module.factory('paginator', function() {
    var paginator = {},
      defaults = {
        currentPage: 1,
        perPage: 10,
        totalPages: null,
        totalItems: null
      };

    function computeTotals(total, curPage, perPage) {
      return {
        totalItems: total,
        totalPages: Math.ceil(total / perPage)
      };
    }

    paginator._computeSlice = function(page) {
      page = page > this.state.totalPages ? 0 : page - 1;
      var start = (page * this.state.perPage),
        lastPossbileIndex = this.state.totalItems,
        endIndex = start + this.state.perPage;
      end = endIndex > lastPossbileIndex ? lastPossbileIndex : endIndex;
      return {
        start: start,
        end: end
      };
    };

    paginator.init = function(collection, settings) {
      // double call to init resets the paginator.
      if (this.collection) paginator.reset();
      this.collection = collection || [];
      settings = settings || {};

      var pagination = computeTotals(collection.length, settings.currentPage || defaults.currentPage, settings.perPage || defaults.perPage);
      this.state = angular.extend({}, defaults, pagination);

      return this;
    };

    paginator.setPage = function(page) {
      this.state.currentPage = page;
      return this;
    };

    paginator.nextPage = function() {
      var maybeNextPage = this.state.currentPage + 1,
        nextPage = maybeNextPage > this.state.totalPage ? 1 : maybeNextPage;

      return this.setPage(nextPage).getCurrentPage();
    };

    paginator.prevPage = function() {
      var maybePrevPage = this.state.currentPage - 1,
        prevPage = !maybePrevPage ? this.state.totalPages : maybePrevPage;

      return this.setPage(prevPage).getCurrentPage();
    };

    paginator.getCurrentPage = function() {
      return this.getPage(this.state.currentPage);
    };

    paginator.getPage = function(page) {
      var indices = this._computeSlice(page);
      return {
        pagination: this.state,
        data: this.collection.slice(indices.start, indices.end)
      };
    };

    paginator.reset = function() {
      this.collection = void(0);
      this.state = angular.extend(this.state, defaults);
    };

    paginator.resetCollection = function(collection) {
      this.init(collection);
      return this;
    };

    paginator.destroy = function() {
      this.reset();
      return this;
    };

    return paginator;
  });
});