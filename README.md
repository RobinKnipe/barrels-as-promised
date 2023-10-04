**DEPRECATED:** probably no need for this anymore, so may as well save the github resources 👻

# barrels-as-promised

A `Promise` wrapper around the `barrels` utility.


[![Build Status](https://travis-ci.org/RobinKnipe/barrels-as-promised.png?branch=master)](https://travis-ci.org/RobinKnipe/barrels-as-promised) [![License](https://img.shields.io/npm/l/barrels-as-promised.svg)](https://github.com/RobinKnipe/barrels-as-promised/blob/master/LICENSE)

## Installation

```bash
npm i --save-dev barrels-as-promised
```

## Usage

NOTE: Adapted from the [Barrels](https://github.com/bredikhin/barrels) docs. Everything described there holds true here with the added promisy goodness described below...

Drop your fixtures in `test/fixtures` as JSON files (or CommonJS modules) named after your models.

Once your [Sails.js](sailsjs.org) server is started:

```javascript
var Barrels = require('barrels');
var barrels = new Barrels();
var fixtures = barrels.data;
barrels.populate()
  .then(function() {
    // do stuff
    ...
  })
  .catch(function (err) {
    // oops
  });
```

Pass to the constructor the path to the folder containing your fixtures (defaults to `./test/fixtures`).

`Populate`ing the test database involves three steps:

Removing any existing data from the collection corresponding to the fixture
Loading the fixture data into the test database
Automatically applying associations (can be disabled by passing `false` as the last parameter to `populate`)
`Populate` also accepts an array of names of collections to populate as the first (optional) argument, for example:

```javascript
barrels.populate(['products'])
  .then(function() {
    // Only products will be populated
    ...
  });
```

## Automatic association

Use the number of position (starting from one) of an entry in the JSON fixture as a reference to associate models (see [https://github.com/bredikhin/barrels/blob/master/test/fixtures/products.json](https://github.com/bredikhin/barrels/blob/master/test/fixtures/products.json) for example). This feature can be disabled by passing `false` as the last parameter to `populate`.

## Required associations

If you have any associations described as `required: true`, they will be added automatically, no matter if the last parameter to `populate` is `false` or not. However, you have to load your fixtures gradually (by passing an array of collection names as the first parameter) in such an order that collections corresponding to the required associations get populated first.

Let's say, for example, you are implementing a `Passport.js`-based authentication, and every `Passport` has `User` as a required association. You'd write something like this:

```javascript
barrels.populate(['user', 'passport'])
  .then(function() {
    // Do your thing...
  });
```


## Dependencies

 - [Barrels](https://github.com/bredikhin/barrels)

## License

The MIT License
