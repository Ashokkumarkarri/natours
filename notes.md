### Creating Factory Functions for Updating and Creating Resources

1. **Introduction to Factory Functions**:
   - We continue building factory functions for handling updates and creating resources.
   - The process is straightforward and follows the same steps as before.
2. **Creating the `updateOne` Factory Function**:
   - Copy the existing update code from the `tourController`.
   - Focus on the part that handles the update logic.
   - Replace specific models with a general one by passing the model as a parameter.
   - Use an arrow function to return the logic, ensuring it's reusable.
3. **Refactoring Update Logic**:
   - Replace hardcoded model names with a generic `doc` or `document`.
   - Simplify the response by wrapping the data in an envelope named `data`.
   - For now, skip adding dynamic property names like `reviews` or `tours`.
4. **Using the Factory Function in Routes**:
   - Replace the existing update logic in `tourController` with `factory.updateOne` by passing the Tour model.
   - Similarly, update the `userController`:
     - Ensure the update function is limited to administrators.
     - Do not allow password updates using `findByIdAndUpdate` as it bypasses middleware.
5. **Handling Updates in the Review Controller**:
   - Add an `updateReview` function in the `reviewController`.
   - Use the `updateOne` factory function for consistent update behavior.
6. **Adding Routes to Postman**:
   - Define the `PATCH` routes for updates in the respective routers.
   - For example, add `updateReview` to the `reviewRouter`.
7. **Testing the Routes**:
   - Save the updated routes in Postman for testing.
   - Verify that the routes behave as expected when updating data.

---

---

this middleware i have added so that it will modify the factory function.

```js
//middleware to set the tour and user id
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId; // If the tour ID is not provided in the request body, use the tour ID from the URL parameters
  // Automatically associate the logged-in user's ID with the review
  if (!req.body.user) req.body.user = req.user.id; // If the user ID is not provided in the request body, use the ID of the authenticated user
  next();
};

exports.createReview = factory.createOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//   //Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId; // If the tour ID is not provided in the request body, use the tour ID from the URL parameters
//   // Automatically associate the logged-in user's ID with the review
//   if (!req.body.user) req.body.user = req.user.id; // If the user ID is not provided in the request body, use the ID of the authenticated user
//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });
```
