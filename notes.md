# Query Middleware Notes

Aggregation middleware in Mongoose allows you to modify the aggregation pipeline or run specific functions before or after an aggregation operation is executed. This is useful for applying global filters, logging, or other operations to all aggregations on a model.

### Key Concepts

- **Aggregation Middleware Trigger**:
  Aggregation middleware triggers only when you directly call `.aggregate()` on the model. If aggregation is run as part of other queries, middleware may not activate.
- **Accessing the Aggregation Pipeline**:
  - `this.pipeline()` provides access to the pipeline stages in the middleware.
  - You can modify the pipeline by adding, removing, or altering stages within `this.pipeline()`.

```js
//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  console.log(this);
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //this refers to the aggregate object
  next();
});
```
