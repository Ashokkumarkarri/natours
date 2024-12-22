### Notes on Nested Route Improvement in Express Using `mergeParams`

1. **Introduction to Nested Routes**
   - Nested routes are common in API design, especially when entities like reviews belong to other entities like tours.
   - Example: `/tours/:tourId/reviews` indicates reviews nested within tours.
2. **Problem with Previous Implementation**
   - The review route was defined in the tour router, causing confusion and duplicate code.
   - Duplicate logic existed for creating reviews in both the tour router and the review router.
   - Maintaining such code in multiple places is a bad practice.
3. **Solution: Using `mergeParams` and Decoupling Routers**
   - **Step 1:** Remove review-related code from the tour router to avoid duplication.
   - **Step 2:** Import the review router into the tour router for better modularity.
   - **Step 3:** Use `router.use` to mount the review router onto the tour router at a specific path.
4. **Code Explanation**
   - Import the review router into the tour router:
     ```jsx
     const reviewRouter = require('./reviewRouter');
     ```
   - Mount the review router:
     ```jsx
     router.use('/:tourId/reviews', reviewRouter);
     ```
   - This ensures that URLs like `/tours/:tourId/reviews` are handled by the review router, keeping both routers modular and decoupled.
5. **Key Concepts**
   - **Routers as Middleware:** A router in Express is essentially middleware and can be used with `.use()`.
   - **Routing Flow:**
     - Requests start in the tour router if the URL begins with `/tours`.
     - Requests matching `/tours/:tourId/reviews` are forwarded to the review router.
   - This approach ensures clean separation of responsibilities between routers.
6. **Benefits**
   - Clean and maintainable codebase with reduced duplication.
   - Modular structure where changes to the review router do not affect the tour router.
   - Improved scalability for adding more nested routes or features.
7. **Summary**
   - By using `mergeParams` and proper routing techniques, nested routes can be implemented cleanly in Express.
   - This ensures a better-organized API and simplifies future maintenance.

---

---

# Own notes:

in previous video we had implemented this in `tourRoute.js` :

```js
router.route('/:tourId/reviews').post(
  // Middleware to protect this route - only authenticated users can access it
  authController.protect,
  // Restrict access to certain roles (e.g., only users can create reviews)
  authController.restrictTo('user'),
  // Controller to handle the creation of a new review
  reviewController.createReview,
);
```

the same kind of code is there in `reviewRoutes.js` too. so there is duplicate code.
so if we want to change something we need to change it the two files.

now we will fix the problem.

we will use `mergeParams`:
mergeParams: true is used to merge the params of the parent router with the child router.
