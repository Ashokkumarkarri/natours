# 012 Implementing Simple Nested Routes

```js
// Nested Routes for Reviews:
// Example endpoints:
// 1. POST /tours/:tourId/reviews --> To create a new review for a specific tour
// 2. GET /tours/:tourId/reviews --> To get all reviews for a specific tour
// 3. GET /tours/:tourId/reviews/:reviewId --> To get a specific review for a tour

// Note:
// - This nested route structure is useful to represent the parent-child relationship
//   between resources (e.g., `tours` as the parent and `reviews` as the child).
// - The `tourId` is extracted from the URL, and the `userId` will be determined
//   from the currently logged-in user (via authentication middleware).

// Route for handling all reviews related to a specific tour
router.route('/:tourId/reviews').post(
  // Middleware to protect this route - only authenticated users can access it
  authController.protect,

  // Restrict access to certain roles (e.g., only users can create reviews)
  authController.restrictTo('user'),

  // Controller to handle the creation of a new review
  reviewController.createReview,
);

// Note for Future Improvement:
// - Currently, we are handling the reviews-related logic inside `tourRoutes`
//   because the URL starts with `/tours`. This is temporary.
// - In the future, we can refactor and move the review-related logic to a separate
//   `reviewRoutes` file for better modularity and separation of concerns.

// Export the router for use in the main application
module.exports = router;
```

```js
// Support nested routes by assigning the tour ID from the URL to the request body
if (!req.body.tour) req.body.tour = req.params.tourId; // If the tour ID is not provided in the request body, use the tour ID from the URL parameters

// Automatically associate the logged-in user's ID with the review
if (!req.body.user) req.body.user = req.user.id; // If the user ID is not provided in the request body, use the ID of the authenticated user

// Create a new review in the database with the prepared request body
const newReview = await Review.create(req.body);
```

```

```

---

---

### Overview

- **Topic**: Nested Routes in Express
- **Purpose**: Understand what nested routes are, why they are needed, and how to implement them in Express.

### Key Points

1. **Creating a Review in Practice**:
   - Previously, `tour ID` and `user ID` were manually passed in the request body.
   - In a real-world scenario:
     - `User ID`: Comes from the currently logged-in user.
     - `Tour ID`: Encoded in the route (URL).
2. **Nested Route Example**:
   - POST request URL format for a new review:
     ```jsx
     /tours/:tourId/reviews
     ```
   - Benefits:
     - `tourId` is embedded in the URL.
     - `userId` is derived from the authenticated user.
3. **Why Nested Routes**:
   - Demonstrates a clear **parent-child relationship** between resources (e.g., Tours and Reviews).
   - Simplifies understanding and usage of the API by making relationships explicit.
4. **Accessing Reviews**:
   - **GET Request**: Retrieve all reviews for a specific tour:
     ```jsx
     /tours/:tourId/reviews
     ```
   - **GET Request for Specific Review**:
     ```jsx
     /tours/:tourId/reviews/:reviewId
     ```
5. **Advantages of Nested Routes**:
   - Improved readability and understanding of API structure.
   - Easier than using query strings.
   - Highlights relationships between resources (e.g., Reviews belong to Tours).

### Implementation

1. **Defining Routes**:

   - Define nested routes under the `tours` resource.
   - Example: POST route to create a new review.

   ```jsx
   router.route('/:tourId/reviews').post(reviewController.createReview);
   ```

2. **Importing Controllers**:

   - Import necessary controllers for handling reviews.

   ```jsx
   const reviewController = require('./controllers/reviewController');
   ```

3. **Mounting Nested Routes**:
   - Mount the routes in the `tour` router since they start with `/tours`.
4. **Tour ID as Parameter**:
   - Use `:tourId` as a parameter in the route to identify the tour.
5. **Controller Logic**:
   - Write logic in the controller to handle the nested relationship:
     - Extract `tourId` from the route parameters.
     - Use the `userId` from the logged-in user for review creation.
6. **Example Route**:

   ```jsx
   router
     .route('/:tourId/reviews')
     .post(authController.protect, reviewController.createReview);
   ```

7. **Benefits for API Users**:
   - Clear and organized routes.
   - Easier navigation of the API.
   - Simplified resource management.

### Summary

- Nested routes provide a structured and logical way to represent relationships between resources.
- They enhance API usability and maintainability.
- Properly designed nested routes simplify the process of accessing and managing related data.

## Running notes:

- All right, in this lecture, we're going to talk about nested routes: what they are, why we need them, and how to implement them in Express.
- Think about how, in practice, we want to create a new review.
- So far, creating new reviews involved manually passing the tour ID and user ID into the request body.
- During development, that's okay, but in the real world, user ID should come from the logged-in user, and tour ID should come from the current tour.
- Ideally, these should be encoded in the URL when submitting a POST request for a new review.
- Nested routes make sense when there is a parent-child relationship between resources, like tours and reviews.
- Access reviews on tours with a nested route like `/tour/:id/reviews`.
- A GET request to `/tour/:id/reviews` can retrieve all reviews for a specific tour.
- Adding a review ID like `/tour/:id/reviews/:reviewId` can fetch a specific review for the tour.
- Nested routes improve API readability and show clear relationships between resources.
- Start implementing nested routes by focusing on the POST route for reviews.
- Since the route starts with `tours`, it will be handled by the tour router.
- Implement this functionality in the tour router for now, even though it involves reviews.
- Import the review controller into the tour router to handle the reviews.
- Define a nested route in the tour router as `/tour/:id/reviews`.
- Use clear naming like `tourId` to differentiate between resources.
- Mount the router and implement the logic for handling the nested routes.
