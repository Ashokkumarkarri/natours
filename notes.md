# 022 Calculating Average Rating on Tours - Part 1

**Key Concept: Calculating and Storing Average Ratings for Tours**

- **Problem:** The `averageRating` and `numberOfRatings` fields on the `Tour` document currently hold placeholder values and are not dynamically updated.
- **Solution:**
  - Create a `static` method (`calcAverageRatings`) on the `Review` schema.
  - This method will:
    - Use the `aggregate` pipeline to:
      - **Match:** Filter reviews based on the provided `tourId`.
      - **Group:** Group all matching reviews and calculate:
        - `nRating`: Total number of reviews.
        - `avgRating`: Average rating of all reviews.
    - Update the corresponding `Tour` document with the calculated `ratingsQuantity` and `ratingsAverage`.
  - Implement middleware (`post('save')`) on the `Review` schema to trigger the `calcAverageRatings` method after a new review is saved.

**Technical Implementation:**

- **`Review` Schema:**
  - Define the `calcAverageRatings` static method:
    - Use `this.aggregate()` to perform the aggregation pipeline.
    - Update the `Tour` document using `findByIdAndUpdate()`.
  - Implement `post('save')` middleware:
    - Call `this.constructor.calcAverageRatings(this.tour)` to trigger the calculation.

**Testing:**

- Create a new tour.
- Create multiple reviews for the tour with varying ratings.
- Verify that the `averageRating` and `numberOfRatings` fields on the `Tour` document are updated correctly after each review is saved.

**Note:**

- The provided code snippet contains a potential error: using `pre('save')` instead of `post('save')` in the middleware. The `post('save')` hook is more appropriate because it executes after the review is saved to the database.
- The code snippet also includes debugging and testing steps that demonstrate the functionality.

**Key Takeaways:**

- Static methods in Mongoose can be used to perform operations on the model itself.
- The aggregation pipeline is a powerful tool for performing complex data transformations.
- Middleware can be used to execute code before or after specific document operations (e.g., saving, updating, deleting).
- Careful consideration of the timing of middleware execution is crucial for correct behavior.

I hope these notes are helpful! Let me know if you have any other questions.
