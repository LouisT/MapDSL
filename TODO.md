TODO
===
* Add more query operators. See [MongoDB Query and Projection Operators] for reference.
  * Improve the current ones as well.
  * ~~Split the (complicated?) query selectors into their own files?~~
* Add support for custom query operators.
* Implement the projection operators. See [Projection Operators] for reference.
* ~~Add tests with mocha.~~ Improve tests! Add better coverage of query operators.
* While the "[is-equal]" lib does what I want, it's a bit big. Find a smaller solution!?
* Document the chainable features.
  * Clean up the 'ChainManager' class in `./lib/` as well.
* Everything else.
  * Work on the TODO!

[MongoDB Query and Projection Operators]: https://docs.mongodb.com/manual/reference/operator/query/
[Projection Operators]: https://docs.mongodb.com/manual/reference/operator/query/#projection-operators
[is-equal]: https://www.npmjs.com/package/is-equal
