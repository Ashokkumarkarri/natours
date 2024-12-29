# 023 Calculating Average Rating on Tours - Part 2

- note: `did not understand this lecture well`

### Notes for Middleware with `findOneAnd` Operations in Mongoose

### **Purpose**:

- To ensure the `calcAverageRatings` function is executed after a document is updated or deleted.
- The pre-middleware fetches the current document before the update or delete operation, and the post-middleware triggers the `calcAverageRatings` function using the document's data.

---

### **Code Explanation**:

1. **Pre-Middleware**:

   ```jsx
   reviewSchema.pre(/^findOneAnd/, async function (next) {
     this.r = await this.clone().findOne();
     console.log(this.r);
     next();
   });
   ```

   - **Regex `/^findOneAnd/`**:
     - Targets all Mongoose methods starting with `findOneAnd` (e.g., `findOneAndUpdate`, `findOneAndDelete`).
   - **`this`**:
     - Refers to the current query being executed.
   - **`this.clone().findOne()`**:
     - Clones the query and executes `findOne()` to retrieve the document before the update or delete operation.
     - Prevents the "Query was already executed" error by cloning the query before executing it.
   - **Purpose**:
     - Retrieves the document before the operation for use in the post-middleware.

---

1. **Post-Middleware**:

   ```jsx
   reviewSchema.post(/^findOneAnd/, async function () {
     await this.r.constructor.calcAverageRatings(this.r.tour);
   });
   ```

   - **Purpose**:
     - Ensures the `calcAverageRatings` method is triggered after the document is updated or deleted.
   - **`this.r`**:
     - Refers to the document retrieved in the pre-middleware.
   - **`this.r.constructor.calcAverageRatings`**:
     - Calls the static `calcAverageRatings` method on the `Review` model to update average ratings for the associated tour.

---

### **Use Case**:

- **When to Use**:
  - If the application requires recalculating derived data (e.g., average ratings) after modifying or deleting a related document.
- **Example**:
  - When a review is updated or deleted, the average ratings and the number of ratings for the associated tour should be recalculated.

---

### **Key Points**:

1. Use pre-middleware to fetch the document before the query is executed.
2. Use post-middleware to trigger logic after the query is completed.
3. The `clone()` method prevents the "Query was already executed" error.
4. Ensure the post-middleware logic handles cases where the document (`this.r`) might not exist (e.g., no matching document found).

This structure ensures robust handling of dependent operations (like updating average ratings) in a Mongoose schema.
