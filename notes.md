# 014 Integrating Stripe into the Back-End

---

## **1. Importing Required Modules**

```jsx
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
```

- `stripe`: Imports the **Stripe** library and initializes it using a secret key stored in environment variables (`process.env.STRIPE_SECRET_KEY`).
- `Tour`: Imports the **Mongoose model** for tours (likely stored in a MongoDB database).
- `catchAsync`: A utility function that catches errors in async functions to prevent unhandled promise rejections.
- `factory`: Likely a reusable function for handling CRUD operations (not used in this file).
- `AppError`: A custom error-handling utility to manage application-specific errors.

---

## **2. `getCheckoutSession` Controller**

This function generates a **Stripe checkout session** when a user books a tour.

```jsx
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
```

- **`catchAsync`** wraps the function to automatically handle any errors.
- This is an **Express.js route handler**, which executes when a request is made to get a checkout session.

### **Step 1: Fetch the Tour Details**

```jsx
const tour = await Tour.findById(req.params.tourId);
console.log(tour);
```

- `req.params.tourId` extracts the tour ID from the request URL (e.g., `/checkout-session/65789abcd123`).
- `Tour.findById()` queries the database to get tour details.
- The `console.log(tour);` statement logs the tour details for debugging.

---

### **Step 2: Create a Stripe Checkout Session**

```jsx
const session = await stripe.checkout.sessions.create({
```

- This function creates a **checkout session** that Stripe uses for handling payments.

### **Defining Session Properties**

```jsx
payment_method_types: ['card'],
mode: 'payment',
```

- `payment_method_types: ['card']` → Only card payments are accepted.
- `mode: 'payment'` → The session is for making a **one-time payment**.

### **Handling Success & Cancellation**

```jsx
success_url: `${req.protocol}://${req.get('host')}/`,
cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
```

- `success_url`: Redirects the user to the homepage (`/`) **after a successful payment**.
- `cancel_url`: Redirects the user to the tour details page (`/tour/{tour.slug}`) **if the payment is canceled**.

### **Tracking the Tour**

```jsx
client_reference_id: req.params.tourId,
```

- Saves the `tourId` as a **client reference ID**, allowing the app to know which tour the user booked.

### **Configuring the Payment Item**

```jsx
line_items: [
  {
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
      },
      unit_amount: tour.price * 100, // Convert price to cents
    },
    quantity: 1,
  },
],
```

- Defines the **product details** that will appear in the Stripe checkout page.
- `tour.name` and `tour.summary` are used for the tour's **name and description**.
- `tour.imageCover` is the **image shown** during checkout.
- `tour.price * 100` → Converts the price from dollars to cents (Stripe expects the price in the smallest currency unit).
- `quantity: 1` → The user is booking **one tour**.

---

### **Step 3: Send the Checkout Session to the Client**

```jsx
res.status(200).json({
  status: 'success',
  session,
});
```

- Sends the created **checkout session** back as a JSON response.
- The front end can use this session to redirect users to **Stripe's checkout page**.

---

## **Summary**

- **Gets tour details** from MongoDB.
- **Creates a Stripe checkout session** with tour info, pricing, and payment options.
- **Returns the session** so the frontend can redirect the user to Stripe for payment.
