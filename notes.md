# Query Middleware Notes

Query middleware allows us to run a function before or after an query is executed.

- arg1: name of the query for which we want to run the middleware.

- .then in query middleware will point to a query obj.

We can chain the query's since we have access to the query obj in query middleware's.

```js
//what ever find function we have in mongoose will be effected by this since we used 'find' as arg1
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  //give me tours which has the secretTour set not equal to true
  next();
});
```

the above code will only work for find method. it will not work for findOne,findMany,etc..
so either we can copy the above code and change the find as findOne like below.

```js
tourSchema.pre('findOne', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
```

- The best best way is to use regular expression /^/.
  here we used regular express /^find/.
- In /^find/, the ^find part is a regular expression pattern that matches any query method starting with "find".

* The / characters define the boundaries of the regular expression.
  / ... /: The opening and closing slashes mark the start and end of the regular expression.
  - Without these, JavaScript would interpret ^find as a string of characters, not as a pattern for matching text.

```js
tourSchema.pre(/^find/, function (next) {
  //this refers to query
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  //this.start is adding a new property to the query object and storing the current timestamp in it
  next();
});
```

```js
tourSchema.post(/^find/, function (docs, next) {
  console.log(`API took: ${Date.now() - this.start} milliseconds`);
  next();
});
```

For post , we have access to the all the docs which has been return from the pre query.
