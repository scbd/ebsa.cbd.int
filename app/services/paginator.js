define(['./module.js', 'underscore'], function(module, _) {

  module.constant('paginatorConfig', {
    currentPage: 1,
    perPage: 10,
    totalPages: null,
    totalItems: null
  });

  return module.factory('paginator', ['paginatorConfig',
    function(defaultConfig) {
      var paginator = {};

      paginator.init = function(collection, settings) {
        // double call to init resets the paginator.
        if (this.collection) paginator.reset();
        this.collection = collection || [];
        settings = settings || {};

        var pagination = this._calculateTotals(this.collection.length, settings.perPage || defaultConfig.perPage);
        this.state = angular.extend({}, defaultConfig, pagination);

        return this;
      };

      paginator._calculateTotals = function(total, perPage) {
        return {
          totalItems: total,
          totalPages: Math.ceil(total / perPage)
        };
      };

      paginator._calculatePage = function(page) {
        page = --page;

        // If we exceed the top end wrap around to the first page and vice versa.
        if (page > this.state.totalPages - 1) return 0;
        if (page < 0) return this.state.totalPages - 1;
        else return page;
      };

      paginator.setPage = function(page) {
        this.state.currentPage = page;
      };

      paginator.nextPage = function() {
        this.setPage(this.state.currentPage + 1);
        return this._getPage(this.state.currentPage);
      };

      paginator.prevPage = function() {
        this.setPage(this.state.currentPage - 1);
        return this._getPage(this.state.currentPage);
      };

      paginator.getCurrentPage = function() {
        return this._getPage(this.state.currentPage);
      };

      paginator._getSlice = function(page) {
        var start = (page * this.state.perPage),
          lastPossbileIndex = this.state.totalItems,
          endIndex = start + this.state.perPage;
        end = endIndex > lastPossbileIndex ? lastPossbileIndex : endIndex;

        return this.collection.slice(start, end);
      };

      paginator._makePage = function(slice) {
        return {
          pagination: this.state,
          data: slice
        };
      };

      paginator._getPage = function(page) {
        var internalPage = this._calculatePage(page);
        return this._makePage(this._getSlice(internalPage));
      };

      paginator.getPage = function(page) {
        return this._getPage(page);
      };

      paginator.reset = function() {
        this.collection = void(0);
        this.state = angular.extend(this.state, defaultConfig);
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
    }
  ]);
});