# 011 Virtual populate Tours & Review's

How to access review's from Tour model.
let us say we do a query to get a specific tour now how do we get the review for that tour?.
we have done done parent referencing to reviews.
reviews pointing to tours
tours not pointing to the reviews.
parent does no know who is the child.
Tour does not know about reviews.

`To solve this we have two solutions:`

1. Manually query the reviews each time when we query the tours.
2. Also do child referencing on the tours,
   keep an array of all the reviews Id's on each tour documents, then populate the array.
   but we do not want to store the array ID's which might grow indifinitly, that's why we pic parent referencing at the first place.

   ```js
   //child referencing
   //but we do not want to do it, since it might gro infinitely
   reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }];
   ```

##### To solve the problem we have "Virtual Population "

```js
//VIRTUAL POPULATE
//name fo the virtual Fields, object of some options
tourSchema.virtual('reviews', {
  //name of the field that we want to reference (name of the model)
  ref: 'Review', //name of the model // ref to the current model
  foreignField: 'tour', //name of the field in other model(in reviewMOdel we have field called "tour")
  localField: '_id', //current model, where that id store in the current tour model ()
});
```

---

---

# 011 Virtual Populate: Tours & Reviews

## Problem: Accessing Reviews from the Tour Model

When querying for a specific tour, how do we fetch the reviews associated with it?

### Current Setup

- **Parent Referencing** is implemented:
  - Reviews reference the Tour model (child references parent).
  - Tours do not reference the Review model (parent does not reference child).

**Issue:**

- The Tour model does not know about its reviews because the parent has no information about the child.

### Solutions:

### 1. Manually Query Reviews

For every tour query, manually fetch the associated reviews:

**Drawbacks:**

- Inefficient and impractical for large-scale systems, as it could result in infinite growth of data being fetched.

### 2. Child Referencing on Tours

Store an array of all review IDs in each Tour document and populate the array when needed.

```jsx
//child referencing
//but we do not want to do it, since it might go infinitely
reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }];
```

**Why we avoid this:**

- Storing review IDs in the Tour model is not scalable because the array can grow indefinitely.
- Defeats the purpose of using parent referencing.

### **Solution: Virtual Populate**

Virtual Populate allows you to establish a relationship between the Tour and Review models without storing the review IDs in the Tour documents.

### Implementation

1. Add a virtual field `reviews` to the Tour schema.
2. Use Mongoose's `virtual` method to define the virtual field.
3. Specify the referencing model, foreign field, and local field.

```js
// Virtual Populate
// Define a virtual field for the Tour model
tourSchema.virtual('reviews', {
  ref: 'Review', // Model to reference (Review model)
  foreignField: 'tour', // Field in the Review model that references the Tour model
  localField: '_id', // Field in the Tour model (current model) that matches the foreignField
});
```

### Explanation

- `ref`: Specifies the name of the model to reference (`Review` in this case).
- `foreignField`: The field in the Review model that contains the ID of the Tour (e.g., `tour` field in the Review schema).
- `localField`: The field in the Tour model that matches the `foreignField` (e.g., `_id` field in the Tour schema).

### Benefits of Virtual Populate

- No need to store review IDs in the Tour documents.
- Efficient querying with minimal storage overhead.
- Allows dynamic population of reviews when querying Tours.
