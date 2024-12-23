### Notes on Nested Routes in Node.js

### Overview of Nested GET Endpoint

Previously created a nested **POST** endpoint to add reviews for a specific tour.

- Now focusing on creating a nested **GET** endpoint to fetch reviews of a specific tour.

### Existing `getAllReviews` Function

- Fetches all reviews from the `reviews` collection.
- Goal: Modify this function to:
  - Retrieve all reviews for a specific tour.
  - Retain functionality to fetch all reviews if no specific tour is specified.

### Implementation Steps

1. **Modify `getAllReviews` Handler**
   - Use `mergeParams: true` in the router to enable access to `tourId` in nested routes.
   - Check if `tourId` exists in the `req.params`.
   - Create a `filter` object dynamically:
     ```jsx
     let filter = {};
     if (req.params.tourId) {
       filter = { tour: req.params.tourId };
     }
     ```
   - Use the `filter` object in the `find` query to fetch:
     - Specific tour reviews (`tour: tourId`).
     - All reviews when `filter` is an empty object.
2. **Test Functionality**
   - Test regular `GET /reviews` endpoint to ensure it still retrieves all reviews.
   - Test nested route `GET /tours/:tourId/reviews` to verify it retrieves reviews for a specific tour.

### Testing Scenarios

- Fetch all reviews:
  - Confirm retrieving all documents in the collection.
- Fetch specific tour reviews:
  - Example: `GET /tours/:tourId/reviews`.
  - Validate correct reviews appear for `tourId`.
  - Example results:
    - Tour "City Wanderer" → 1 review.
    - Tour "Forest Hiker" → 2 reviews.

### Key Takeaways

- **Dynamic Filters**: Utilize conditional logic to create filters based on route parameters.
- **Merge Params**: Enable `mergeParams` to access parent route parameters in child routers.
- **Reusable Logic**: Modify existing handler functions to adapt to new routes.

### Final Notes

- This approach simplifies creating nested routes for other use cases.
- Tested and confirmed functionality for both regular and nested routes.
