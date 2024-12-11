# 010 Populating Reviews

---

### `changes made:`

- implemented populate to reviews

---

#### populate()

`.populate()` is a fundamental tool in Mongoose when working with data.

It helps us replace the referenced IDs in a document with the actual data from the referenced collection.

In the background, `.populate()` performs a separate query to fetch the data from the referenced document.

This is why Mongoose can fill up the data for the specified field.

```js
//POPULATE
//regular expression
reviewSchema.pre(/^find/, function (next) {
  // In pre middleware, `this` refers to the current query
  this.populate({
    path: 'tour', // name of the field that we want to replace
    select: 'name',
  });
  this.populate({
    path: 'user', // name of the field that we want to replace
    select: 'name photo',
  });
  next();
```
