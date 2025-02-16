# 018 Rendering a User's Booked Tours

---

# Implementing the 'My Bookings' Page in Node.js

## Overview

In this section, we will implement a **My Bookings** page that displays all the tours a user has booked. The page will be accessible only to logged-in users. To achieve this, we will:

1. Create a new route for **My Tours**.
2. Protect the route so only authenticated users can access it.
3. Implement a controller to fetch and display booked tours.
4. Use MongoDB queries to retrieve booking data and associated tour details.
5. Render the **overview page**, filtering it to show only booked tours.

---

## Step 1: Creating a New Route for 'My Tours'

In `viewRoutes.js`, we define a new route:

```jsx
router.get('/my-tours', authController.protect, viewController.getMyTours);
```

### Explanation:

- The route is set to `/my-tours`.
- The `authController.protect` middleware ensures that only authenticated users can access this page.
- The `viewController.getMyTours` controller will handle the request and render the appropriate view.

---

## Step 2: Implementing the Controller to Fetch Booked Tours

Now, we create the controller function `getMyTours` in `viewsController.js`.

```jsx
const Booking = require('../models/bookingModel');

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings for the logged-in user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Extract tour IDs from bookings
  const tourIds = bookings.map((el) => el.tour);

  // 3) Retrieve tours based on extracted IDs
  const tours = await Tour.find({ _id: { $in: tourIds } });

  // 4) Render the overview page with booked tours
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
```

### Explanation:

1. **Find all bookings for the logged-in user**
   - We query the `Booking` model using `Booking.find({ user: req.user.id })`.
   - This retrieves all bookings associated with the currently logged-in user.
2. **Extract tour IDs**
   - We use `.map()` to create an array of tour IDs from the retrieved bookings.
3. **Find corresponding tours**
   - We use the `$in` MongoDB operator to query the `Tour` model.
   - This retrieves all tours whose `_id` matches any ID in the `tourIds` array.
4. **Render the view**
   - The `overview` template is reused to display only the booked tours.
   - The `title` is set to `'My Tours'`.

---

## Step 3: Adding the Link to 'My Tours' in the Account Page

In `account.pug`, add a link to **My Tours** in the sidebar:

```
+navItem('/my-tours', 'My booking', 'briefcase')
```

### Explanation:

- This adds a navigation item labeled **My Booking**.
- The icon used is `'briefcase'`.
- Clicking the link redirects users to `/my-tours`.

---

## Step 4: Testing the Implementation

To test the **My Tours** feature:

1. **Log in as a user who has made bookings.**
2. **Visit `/my-tours` and verify booked tours are displayed.**
3. **If the page is empty, make a booking and recheck.**

### Example Booking Test:

1. Navigate to a tour booking page.
2. Complete the payment process.
3. Revisit `/my-tours` and confirm that the booked tour appears.

---

## Conclusion

With this implementation, users can now view a personalized **My Bookings** page listing their booked tours. The feature uses **MongoDB queries** to retrieve relevant data and renders a filtered view of the existing **overview page**.

✅ **Key Takeaways:**

- Protect routes to ensure only logged-in users can access them.
- Use **MongoDB `$in` operator** to find multiple documents by ID.
- Reuse existing templates where possible to optimize development.

---

This concludes the implementation of the **My Bookings** page in Node.js! 🎉
