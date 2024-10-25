# Mongoose Middleware Notes

## Types of Middleware in Mongoose

Mongoose supports four types of middleware:

1. **Document Middleware**
2. **Query Middleware**
3. **Aggregate Middleware**
4. **Model Middleware**

---

## Document Middleware

Document middleware specifically works with .save() and .create() methods. This means:

Pre and Post Hooks for document middleware are triggered only when you save a new document or create one, not on other operations.
Here’s how it works:

Pre-hook (pre): Runs before the .save() or .create() operation.
Post-hook (post): Runs after the .save() or .create() operation.

---

## Defining Pre-Save Middleware

- `pre` hooks run before saving a document. Example:
  ```js
  tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  ```

Here, this refers to the current document being saved. In this case, we’re setting a slug property based on the document’s name.

### Post-Save Middleware

In post middleware, `this` is no longer accessible because the document has already been saved.
Instead, the saved document is passed as an argument (doc):

```js
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});
```

post middleware can be used to log or perform actions after the document has been saved.

### Terminology

The term hook is often used interchangeably with middleware in Mongoose.

### Running Middleware Before/After Events

Document middleware can run either before (pre) or after (post) an event.

### Event Triggering in Document Middleware

Document middleware is specifically tied to save and create events only, so it will not trigger on operations like update or find.

---

4 type of middleware's are there in mongoose:
1.document, 2.query, 3.aggregate, 4.model middleware.
Document Middleware: runs before .save() and .create()
we can use save= for .save(), .create()

```js
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
```

//we can have multiple pre save, post hooks.
//hook is a another terminology for middleware.

```js
// tourSchema.pre('save', function (next) {
//   console.log('will save document ');
//   next();
// });
```

```js
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
  //in post we do not have access to :  .this
  //we have have access to the doc which is currently saved.
});
```

//we can have middleware that can run before the event occurred, after the event occurred.
// in case of doc middleware, it suppose to be a save event
