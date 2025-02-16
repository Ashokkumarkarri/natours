# 015 Processing Payments on the Front-End

---

## Processing Payments with Stripe in Node.js

## Overview

In this lecture, we will learn how to integrate Stripe for processing payments. The goal is to implement a "Book Tour Now" button that only appears when a user is logged in. If a user is not logged in, they will be redirected to the login page. We will also set up a Stripe checkout session and process payments on the front end.

---

## 1. Displaying the Booking Button Conditionally

### **Step 1: Modify the Tour Template**

- The "Book Tour Now" button should only be visible if a user is logged in.
- If no user is logged in, display a button that redirects to the login page.
- Use a template conditional to achieve this:
  ```html
  {% if user %}
  <button id="book-tour" data-tour-id="{{ tour.id }}">Book Tour Now</button>
  {% else %}
  <a href="/login" class="btn">Login to Book Tour</a>
  {% endif %}
  ```
- **Why store the tour ID in the button?**
  - The Stripe API requires the tour ID.
  - By adding a `data-tour-id` attribute, we can access it in JavaScript and send it in the request.

---

## 2. Implementing the Payment Request in the Frontend

### **Step 2: Create stripe.js**

- We need to create a new script file `stripe.js` in the `public/js` directory.
- Since the installed Stripe package only works for the backend, we must include Stripe’s client-side script in our HTML.

### **Include Stripe’s Client-Side Script**

- Add the Stripe script in the `<head>` section of the HTML:
  ```jsx
  <script src="https://js.stripe.com/v3/"></script>
  ```

### **Initialize Stripe in stripe.js**

- Retrieve the public API key from Stripe’s dashboard.
- Initialize Stripe in `stripe.js`:
  ```jsx
  const stripe = Stripe('your-public-key-here');
  ```
- The public key is visible in the Stripe dashboard under API keys.

### **Create the `bookTour` Function**

- This function will handle booking a tour by communicating with the backend.
- **Steps:**

  1. Fetch the checkout session from the server.
  2. Redirect the user to the Stripe checkout page.

  ```jsx
  import axios from 'axios';

  const bookTour = async (tourId) => {
    try {
      // Step 1: Get checkout session from the server
      const session = await axios.get(
        `/api/v1/bookings/checkout-session/${tourId}`,
      );

      // Step 2: Redirect to Stripe checkout page
      await stripe.redirectToCheckout({ sessionId: session.data.session.id });
    } catch (err) {
      console.error(err);
    }
  };
  ```

---

## 3. Connecting the Button to the `bookTour` Function

### **Step 3: Modify index.js**

- Import `bookTour` from `stripe.js`.
- Select the booking button and attach an event listener.

  ```jsx
  import { bookTour } from './stripe';

  const bookBtn = document.getElementById('book-tour');

  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      e.target.textContent = 'Processing...';
      const { tourId } = e.target.dataset;
      bookTour(tourId);
    });
  }
  ```

### **Explanation:**

- **Event Listener:** When the button is clicked, it:
  1. Changes the button text to "Processing..."
  2. Extracts the `tourId` from the `data-tour-id` attribute.
  3. Calls `bookTour(tourId)` to initiate the payment process.

---

## 4. Testing the Implementation

- Ensure the development server is running (`npm start`).
- Check that the "Book Tour" button appears only when logged in.
- Click the button and verify that the user is redirected to Stripe’s checkout page.

---

## 5. Summary

- We conditionally displayed the "Book Tour" button based on user authentication.
- We stored the `tourId` in the button’s `data-attribute`.
- We created `stripe.js` to handle payment requests.
- We used Axios to fetch the checkout session from the server.
- We redirected users to Stripe’s checkout page.
- We connected the button to the `bookTour` function in `index.js`.

This completes the front-end setup for processing payments with Stripe in a Node.js application.
