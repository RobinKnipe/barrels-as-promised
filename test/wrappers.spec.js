
const chai = require("chai");
const sinon = require("sinon");
chai.use(require("sinon-chai"));
const expect = chai.expect;
const rewire = require('rewire');
const barrels = rewire('../');

describe('barrels-as-promised wraps barrels', function () {
  const next = () => undefined;
  before('swap the callback function with a dummy', () => {
    this.undummy = barrels.__set__('promise', () => next);
  });
  after('restore the callback function', () => {
    this.undummy();
  });
  
  describe('#associate', function () {

    describe('the underlying associate function', function () {
      beforeEach('spy on the associate function', () => {
        this.barrels = barrels();
        this.restoreAssociate = barrels.__set__('_associate', (this.assSpy = sinon.spy()));
      });
      afterEach('restore the associate function', () => {
        this.restoreAssociate();
      });

      it('should be called with `next` : associate()', () => {
        this.barrels.associate();
        expect(this.assSpy).to.have.been.calledWith(next);
      });

      it('should be called with the `models` list and `next` : associate(models)', () => {
        const models = ['some', 'models'];
        this.barrels.associate(models);
        expect(this.assSpy).to.have.been.calledWith(models, next);
      });
    });

  });

  describe('#populate', function () {

    describe('the underlying populate function', function () {
      beforeEach('spy on the populate function', () => {
        this.barrels = barrels();
        this.restoreAssociate = barrels.__set__('_populate', (this.popSpy = sinon.spy()));
      });
      afterEach('restore the populate function', () => {
        this.restoreAssociate();
      });

      it('should be called with `next` : populate()', () => {
        this.barrels.populate();
        expect(this.popSpy).to.have.been.calledWith(next);
      });

      it('should be called with the `models` list and `next` : populate(models)', () => {
        const models = ['some', 'models'];
        this.barrels.populate(models);
        expect(this.popSpy).to.have.been.calledWith(models, next);
      });

      it('should be called with the `models` list, `next`, and `autoAssociate` : populate(models, autoAssociate)', () => {
        const models = ['some', 'models'], autoAssociate = {};
        this.barrels.populate(models, autoAssociate);
        expect(this.popSpy).to.have.been.calledWith(models, next, autoAssociate);
      });
    });

  });
  
});
