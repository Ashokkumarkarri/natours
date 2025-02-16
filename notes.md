# 017 Creating New Bookings on Checkout Success

---

# Handling Booking Creation After a Successful Checkout in Node.js

## Overview

In this lecture, we will implement a temporary solution to create a new booking in our database whenever a user successfully purchases a tour. The core idea revolves around redirecting the user to a success URL after checkout and using query parameters to store booking details temporarily.

> Note: This method is not secure and is only a temporary workaround. A more secure solution using Stripe Webhooks will be implemented when the website is deployed.

---

## Step 1: Understanding the Success URL

- In our `bookingController`, we generate a checkout session.
- The `success_url` redirects the user to a specific URL after a successful checkout.
- Currently, this URL is just the homepage.
- We will modify this URL to contain necessary booking information as query parameters.

### Why Query Strings?

- Stripe only makes a `GET` request to the success URL.
- We cannot send a request body, so we encode booking details (tour, user, price) in the query string.

---

## Step 2: Adding Booking Details to the URL

```jsx
success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
```

We need three key details for booking:

1. `tour` → Retrieved from `req.params.tourid`
2. `user` → Retrieved from `req.user.id`
3. `price` → Retrieved from `tour.price`

```jsx
const tour = req.params.tourid;
const user = req.user.id;
const price = tour.price;
```

> Security Concern: This method is not secure, as anyone who knows the URL structure could manually call it and create a booking without paying. However, since the URL is not public, it is a temporary workaround.

---

## Step 3: Creating the Booking Controller Function

We define a function `createBookingCheckout` to handle the booking creation:

```jsx
exports.createBookingCheckout = async (req, res, next) => {
  const { tour, user, price } = req.query;

  // Ensure all required data exists
  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });

  // Redirect to the homepage without query parameters
  res.redirect(req.originalUrl.split('?')[0]);
};
```

### Breakdown:

- Extracts `tour`, `user`, and `price` from the query string.
- If any field is missing, it proceeds to the next middleware.
- Creates a new booking document in the database.
- Redirects the user to the homepage without the query string for security.

### **Will This Cause an Infinite Loop?**

❌ **No, it won't create an infinite loop,** because:

- The `redirect()` removes the query parameters from the URL.
- On the next request, `req.query` will be empty.
- Since `tour`, `user`, and `price` are missing, the `if (!tour && !user && !price) return next();` condition will trigger, and it won’t create another booking or redirect again.

---

## Step 4: Attaching Middleware to Routes

Since this functionality should run when the success URL is accessed, we add it to our middleware stack.

In `viewRoutes.js`:

```jsx
const bookingController = require('../controllers/bookingController');
router.get(
  '/',
  bookingController.createBookingCheckout,
  viewController.getOverview,
);
```

### How it Works:

1. When the success URL is accessed, `createBookingCheckout` runs first.
2. If booking data exists, it creates a new booking and redirects to the homepage.
3. Since the redirected URL no longer has a query string, `createBookingCheckout` is skipped the second time.
4. Finally, `getOverview` renders the homepage.

---

## Step 5: Testing the Implementation

To test the implementation:

1. Log in as a user.
2. Purchase a tour.
3. Observe if a new booking is created in the database.
4. Verify that after checkout, the URL does not contain booking details (query string is removed).

---

## Security Concerns & Future Improvements

- **Issue:** Anyone can manipulate the URL to create a booking without payment.
- **Solution:** In production, we will use **Stripe Webhooks**, which will verify payments and create bookings securely.

---

## Conclusion

- We implemented a **temporary** method to create bookings after a successful payment.
- We stored booking details in the URL’s query string.
- We processed the query string, created a booking, and redirected the user to a clean URL.
- This approach is not secure, but it allows testing before implementing Stripe Webhooks.

> Next Steps: Implement Stripe Webhooks for secure booking creation!
