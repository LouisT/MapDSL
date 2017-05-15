MapDSL (WIP)
===
A __[MongoDB]__ inspired __[ES6 Map()]__ DSL.

This is a ___WIP___; do __NOT__ use in production yet! See [TODO](TODO.md) for more information.

Implemented [Query Operators]
===
* Comparison
  * $eq, $gt, $gte, $lt, $lte, $ne
* Logical
  * $or, $and
* Element
  * $exists, $type
* Evaluation
  * $regex
* Array


### Example:
```javascript
let MapDSL = new (require('mapdsl'))(),
    util = require('util'),
    _print = (obj) => {
        console.log('%s\n', util.inspect(obj, { depth: null, showHidden: true }));
    };

// Start out with some base data.
MapDSL.set('test0', 10);
MapDSL.set('test1', 'this is a string');
MapDSL.set('test2',{
    foo: 7,
    bar: 3,
    baz: null,
});
MapDSL.set('test11',{
    foo: 7,
    string: 'Look at me example all the things!'
});
MapDSL.set('test12',{
    foo: 7,
    string: 'Another example string!',
    baz: 'qux'
});
MapDSL.set('test13',{
    foo: 8,
    baz: 'qux'
});
// Fill with junk.
for (let num = 3; num < 10; num++) {
    MapDSL.set(`test${num}`, {
       foo: Math.floor(Math.random()*15)+1,
       bar: Math.floor(Math.random()*15)+1
    });
}

// Sync!
_print(MapDSL.find({
    foo: 8
}));
_print(MapDSL.find({
    foo: { '$gt': 6 },
    bar: { '$lt': 10 }
}));
_print(MapDSL.find({
   '$gt': 3
}));
_print(MapDSL.find({
   '$eq': 'this is a string'
}));
_print(MapDSL.find({
   string: { '$regex': /Things!$/i }
}));
_print(MapDSL.find({
   '$regex': /String$/i
}));
_print(MapDSL.find({
   '$regex': /String$/
}));
_print(MapDSL.find({
  '$and': [{
       foo: { '$eq': 7 },
    }, {
       '$or': [
           { string: { '$regex': /Things!$/i } },
           { string: { '$regex': /String!$/i } },
       ]
   }]
}));

// Promise!
MapDSL.findAsync({ foo: { '$gt': 2 }, bar: { '$lt': 10 } }).then((results) => {
    _print(results);
 }).catch((error) => {
    console.log(error);
});
```

[MongoDB]: https://www.mongodb.com/
[ES6 Map()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[Query Operators]: https://docs.mongodb.com/manual/reference/operator/query/
