/*jslint node: true */
'use strict';

/**
 * Barrels-as-promised: A Promise wrapper around the Barrels utility
 */

/**
 * Dependencies
 */
const Barrels = require('barrels');

/**
 * Barrels utility functions
 */
let _associate = Barrels.prototype.associate;
let _populate = Barrels.prototype.populate;

let promise = (resolve, reject) => err => {
  if (err) {
    reject(err);
  } else {
    resolve();
  }
};

  /**
 * Add associations
 * @param {array} collections optional list of collections to associate
 * @param {function} done callback
 */
Barrels.prototype.associate = function associate() {
  const args = arguments;
  if (Array.prototype.some.call(args, arg => typeof arg === 'function')) {
    _associate.apply(this, args);
  }
  else {
    return new Promise((resolve, reject) => {
      Array.prototype.push.call(args, promise(resolve, reject));

      _associate.apply(this, args);
    });
  }
};

/**
 * Put loaded fixtures in the database, associations excluded
 * @param {array} collections optional list of collections to populate
 * @param {function} done callback
 * @param {boolean} autoAssociations automatically associate based on the order in the fixture files
 */
Barrels.prototype.populate = function populate(collections, done, autoAssociations) {
  const args = arguments;
  if (Array.prototype.some.call(args, arg => typeof arg === 'function')) {
    _populate.apply(this, args);
  }
  else {
    return new Promise((resolve, reject) => {
      const newArgs = [];
      if (Array.isArray(args[0])) {
        newArgs.push(args[0]);
      }
      newArgs.push(promise(resolve, reject));
      if (args[1]) {
        newArgs.push(args[1]);
      }

      _populate.apply(this, newArgs);
    });
  }
};

module.exports = Barrels;
