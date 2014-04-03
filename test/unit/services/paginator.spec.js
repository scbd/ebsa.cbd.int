define([
    'angular',
    'app',
    'angular-mocks',
    '/services/paginator.js'
  ],
  function(angular, app, mocks, paginator) {
    describe('paginator service', function() {

      var alpha = 'abcdefghijklmnopqrstuvwxyz';
      var paginator,
        paginatorDefaultConfig,
        mockCollection = alpha.split('')
          .map(function(chr, index) {
            var obj = {};
            obj[chr] = index;
            return obj;
          });

      beforeEach(function() {
        mocks.module('app');
        mocks.module('app.services');

        mocks.inject(function(_paginator_, _paginatorConfig_) {
          paginator = _paginator_,
          paginatorDefaultConfig = _paginatorConfig_;
        });
      });

      it('should initialize with a new collection and set a default state', function() {
        paginator.init(mockCollection);

        expect(paginator.state.totalItems).to.equal(26);
        expect(paginator.state.totalPages).to.equal(3);
        expect(paginator.state.currentPage).to.equal(1);
        expect(paginator.state.perPage).to.equal(10);
      });

      it('should initialize with empty collection if no arguments provided to init', function() {
        paginator.init();

        expect(paginator.collection).to.be.an('Array').and.have.length(0);
      });

      it('should prevent double initialization by calling reset and replacing the collection', function() {
        paginator.init(mockCollection);

        paginator.init();

        expect(paginator.collection).to.be.an('Array').and.have.length(0);

        var replacementCol = [1,2,3,4];
        paginator.init(replacementCol);

        expect(paginator.collection).to.deep.equal(replacementCol);
      });

      it('should set the proper page when calling setPage', function() {
        paginator.init(mockCollection);

        paginator.setPage(3);

        expect(paginator.state.currentPage).to.equal(3);
      });

      it('should return the next page when calling nextPage()', function() {
        paginator.init(mockCollection);

        var page = paginator.nextPage();
        var comparisonPage = mockCollection.slice(10, 20);

        expect(paginator.state.currentPage).to.equal(2);
        expect(page.data).to.deep.equal(comparisonPage);
      });

      it('should return the prev page when calling prevPage()', function() {
        paginator.init(mockCollection);

        paginator.setPage(2);

        var page = paginator.prevPage();
        var comparisonPage = mockCollection.slice(0, 10);

        expect(paginator.state.currentPage).to.equal(1);
        expect(page.data).to.deep.equal(comparisonPage);
      });

      it('should return the current page when calling currentPage()', function() {
        paginator.init(mockCollection);

        var page = paginator.getCurrentPage();
        var comparisonPage = mockCollection.slice(0, 10);

        expect(paginator.state.currentPage).to.equal(1);
        expect(page.data).to.deep.equal(comparisonPage);
      });

      it('should return the specified page when calling getPage() with arguments', function() {
        paginator.init(mockCollection);

        var page = paginator.getPage(3);
        var comparisonPage = mockCollection.slice(20, mockCollection.length);

        expect(page.data).to.deep.equal(comparisonPage);
      });

      it('should correctly calculate totals', function() {
        var totals = paginator._calculateTotals(mockCollection.length, paginatorDefaultConfig.perPage);

        expect(totals.totalItems).to.equal(mockCollection.length);
        expect(totals.totalPages).to.equal(3);
      });

      it('should correctly calculate the indices for a desired slice', function() {
        paginator.init(mockCollection);

        var slice = paginator._getSlice(0);
        expect(slice).to.deep.equal(paginator.getPage(1).data);

        slice = paginator._getSlice(1);
        expect(slice).to.deep.equal(paginator.getPage(2).data);

        slice = paginator._getSlice(2);
        expect(slice).to.deep.equal(paginator.getPage(3).data);

      });

      it('should wrap around the top egde when calling with a page larger than the collection', function() {
        paginator.init(mockCollection);

        var page = paginator._calculatePage(mockCollection.length + 1);
        expect(page).to.equal(0);
      });

      it('should wrap around the bottom egde calling with a page smaller than 1', function() {
        paginator.init(mockCollection);

        var page = paginator._calculatePage(0);
        expect(page).to.equal(paginator.state.totalPages - 1);
      });

      it('should return an empty array when calling any method with an empty collection', function() {
        paginator.init();

        expect(paginator.getPage(1).data).to.be.an('Array').and.have.length(0);
        expect(paginator.nextPage().data).to.be.an('Array').and.have.length(0);
        expect(paginator.prevPage().data).to.be.an('Array').and.have.length(0);
        expect(paginator.getCurrentPage().data).to.be.an('Array').and.have.length(0);
      });

      it('should return the same page when there\'s only one in the collection', function() {
        var reducedCol = mockCollection.slice(0, 10);
        paginator.init(reducedCol);

        expect(paginator.getPage(1).data).to.deep.equal(reducedCol);
        expect(paginator.getPage(2).data).to.deep.equal(reducedCol);
        expect(paginator.nextPage().data).to.deep.equal(reducedCol);
        expect(paginator.prevPage().data).to.deep.equal(reducedCol);
      });

      it('should reset collection and state when calling reset()', function() {
        paginator.init(mockCollection);

        paginator.reset();

        expect(paginator.collection).to.be.undefined;
        expect(paginator.state).to.deep.equal(paginatorDefaultConfig);
      });

      it('should replace the collection when calling resetCollection()', function() {
        paginator.init(mockCollection);

        var replacementCol = [{
          a: 'a1'
        }, {
          b: 'b2'
        }];
        paginator.resetCollection(replacementCol);
        expect(paginator.collection).to.deep.equal(replacementCol);
      });

      it('should call reset() when calling destroy()', function() {
        paginator.init(mockCollection);
        paginator.reset = sinon.spy(paginator.reset);

        paginator.destroy();
        expect(paginator.reset).to.have.been.called;
        expect(paginator.collection).to.be.undefined;
      });

    });

  });