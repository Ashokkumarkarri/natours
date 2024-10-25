# Virtual properties

1. Virtual properties are the properties which were defined in schema but not saved in the data-base.
   They are used to define values that are derived from actual data in the database.

2. we use virtual properties when we have a property in our DB or schema and we want to do some calculations on or data.
   Virtual properties are useful when you need to perform calculations or derive a value based on existing properties in your schema. They allow you to manipulate or display data without actually modifying the stored data itself.

```js
//syntax
schema.virtual('virtual_property_name').get(callBack_fun(){
  return this.property_which_is_in_db;
})
```

After defining virtual property, we need to explicitly shown in the schema options:

schema options in Mongoose: Schema options are additional settings you can pass as the second argument when defining a Mongoose schema. They control various aspects of the schema's behavior, like how virtual properties are handled, timestamps, versioning, etc.

```js
//schema options
{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
```

Here we are telling to schema that when we get JSON,object as output turn the virtual property's on.

#### Example code:

```js
//virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
```

````js
// const tourSchema = new mongoose.Schema(
//   {
//     //schema_definition
//     name: String,
//     age: Number,
//   }, //schema options
//   { toJSON: { virtuals: true }, toObject: { virtuals: true } },
// );
// //arg1=schema_definition, arg2=options-object
// ```
````
