'use strict';

/**
 * Dependencies
 */
const should = require('should');
const SailsApp = require('sails').Sails;
const Barrels = require('../index');
const barrels = new Barrels();

describe('Promisified Barrels behaviour', () => {
  var fixtures = barrels.data;

  describe('Populate DB with fixtures', function () {
    before('setup Sails', function (done) {
      this.sails = new SailsApp();
      this.sails.lift({
        paths: {
          models: require('path').join(process.cwd(), 'test/fixtures/models')
        },
        connections: {
          test: {
            adapter: 'sails-memory'
          }
        },
        models: {
          connection: 'test',
          migrate: 'drop'
        },
        hooks: {
          grunt: false
        }
      }, done);
    });

    after('tear-down Sails', function (done) {
      this.sails.lower(done);
    });

    describe('populate(fixtures)', () => {
      before(() =>
        barrels.populate(['sellers', 'regions']).then(() =>
          barrels.populate(['categories', 'products', 'tags'])
        )
      );

      it('should populate the DB with products and categories', () =>
        Categories.find()
          .toPromise()
          .tap(categories => {
            should(fixtures['categories'].length > 0).be.ok;
            should(categories.length === fixtures['categories'].length).be.ok;
          })
          .then(categories =>
            Products.find().then(products =>
              categories.length.should.be.eql(products.length,
                'Categories and products should have equal amount of entries!')
            )
          )
      );

      it('should assign a category to each product', () =>
        Products.find()
          .populate('category')
          .then(products => products.forEach(product => should(product.category.name).not.be.empty)
        )
      );

      it('should assign at least two tags to each product', () =>
        Products.find()
          .populate('tags')
          .then(products => products.forEach(product => should(product.tags.length).be.greaterThan(1))
        )
      );

      it('should assign at least two regions to each product', () =>
        Products.find()
          .populate('regions')
          .then(products => products.forEach(product => should(product.regions.length).be.greaterThan(1))
        )
      );
    });

    describe('populate(cb, false)', () => {
      before('successive population without auto-associate', () =>
        barrels.populate(['sellers', 'regions'], false).then(() =>
          barrels.populate(['categories', 'products', 'tags'], false)
        )
      );

      it('should keep the associations-related fields', () =>
        Products.find().then(products =>
          products.forEach(product => {
            product.category.should.be.a.Number;
            product.tags.should.be.an.Array;
          })
        )
      );

      it('should always populate required associations', () =>
        Products.find().populate('regions').then(products =>
          products.forEach(product => should(product.regions.length).be.greaterThan(1))
        )
      );
    });

    describe('populate(modelList, cb)', () => {
      before('populate everything but categories', () =>
        Products.destroy()
          .then(() => Categories.destroy())
          .then(() => barrels.populate(['sellers', 'regions']))
          .then(() => barrels.populate(['products', 'tags']))
      );

      it('should populate products but not categories', () =>
        Products.find()
          .then(products => products.length.should.be.greaterThan(1))
          .then(() => Categories.find())
          .then(categories => categories.length.should.be.eql(0))
      );
    });

    it('should ask for specific order while populating models with required associations', () =>
      barrels.populate(['products']).then(
        () => { throw new Error('Expected an error, but none was raised!') },
        err => should(err.message).be.eql('Please provide a loading order acceptable for required associations')
      )
    );
  });

});
