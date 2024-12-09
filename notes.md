# 007 Populating Tour Guides

In the previous video, we used child referencing to reference the user documents

In this video, we will replace the user IDs with the original documents using **populating**.

The `.populate()` method always happens in a query.

**Populate = fill up the data.**

---

### **Examples**

1. **Passing a String**

   ```jsx
   const tour = await Tour.findById(req.params.id).populate('guides');
   // .populate('name of the field that we want to populate')
   ```

   - Instead of passing a string, we can pass options as an object.

2. **Passing an Object**

   ```jsx
   const tour = await Tour.findById(req.params.id).populate({
     path: 'guides', // name of the field that we want to replace
     select: '-__v -passwordChangedAt', // fields that we want to hide
   });
   ```

---

### **What is `.populate()`?**

`.populate()` is a fundamental tool in Mongoose when working with data.

It helps us replace the referenced IDs in a document with the actual data from the referenced collection.

In the background, `.populate()` performs a separate query to fetch the data from the referenced document.

This is why Mongoose can fill up the data for the specified field.

---

### **When to Use `.populate()`?**

1. **Small Applications:**

   It is fine to use `.populate()` for small applications where the number of queries is limited.

2. **Big Applications:**

   Be careful when using `.populate()` in large applications because performing multiple queries can affect performance.

---

### **Pre Middleware to Automate `.populate()`**

We can set up a pre middleware so that `.populate()` runs automatically whenever there is a query:

```jsx
tourSchema.pre(/^find/, function (next) {
  // In pre middleware, `this` refers to the current query
  this.populate({
    path: 'guides', // name of the field that we want to replace
    select: '-__v -passwordChangedAt', // fields to hide
  });
  next();
});
```

- This middleware will automatically populate the `guides` field for every query starting with `find`.

---

### **Steps to Use `.populate()`**

1. **Create a Reference:**

   Define a field in your schema to reference another model:

   ```jsx
   guides: [
     {
       type: mongoose.Schema.ObjectId,
       ref: 'User', // this is a reference to another model
     },
   ];
   ```

2. **Populate the Field:**

   Use `.populate()` in your query to replace the IDs with the actual document data:

   ```jsx
   const tour = await Tour.findById(req.params.id).populate('guides');
   ```

---

### **Key Notes**

1. `.populate()` = fetch and fill up the data for a referenced field in the document.
2. It does a query in the background to fetch the data from the referenced collection.
3. Performance might be affected if `.populate()` is overused, especially in large applications.

This is a **2-step process**:

1. **Step 1:** Create a reference to another model (relationship between datasets).
2. **Step 2:** Populate the referenced field in the query (e.g., `guides`).
