# 019 Finishing the Bookings API

---

# Node.js Bookings API - Detailed Notes

## Overview

In this section, we will complete the Bookings API by implementing all CRUD operations:

- **Create** a booking
- **Read** (Get) all bookings or a specific booking
- **Update** an existing booking
- **Delete** a booking

We will also ensure that these routes are protected and accessible only to authorized users, such as administrators and lead guides.

---

## Step 1: Implementing the CRUD Operations

### 1.1 Creating Booking Handlers

We will utilize the factory functions we have already created to implement the CRUD operations for bookings in `bookingController.js`.

```jsx
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
```

Each function follows a standard pattern:

- `createBooking`: Uses `createOne` to create a new booking.
- `getBooking`: Uses `getOne` to retrieve a specific booking.
- `getAllBookings`: Uses `getAll` to fetch all bookings.
- `updateBooking`: Uses `updateOne` to modify an existing booking.
- `deleteBooking`: Uses `deleteOne` to remove a booking.

---

## Step 2: Setting Up Routes

We define our API routes in `bookingRoutes.js` and apply necessary authentication and authorization middleware.

### 2.1 Authentication and Authorization Middleware

```jsx
router.use(authController.protect);
```

This ensures that all subsequent routes require authentication.

Next, we apply role-based access control:

```jsx
router.use(authController.restrictTo('admin', 'lead-guide'));
```

This restricts access to only **admins** and **lead guides**.

### 2.2 Defining Routes

```jsx
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
```

This endpoint handles checkout sessions for booking a tour.

### 2.2.1 Routes Without ID (Collection-Level Routes)

```jsx
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
```

- `GET /api/v1/bookings/` → Fetch all bookings (restricted to admins and lead guides)
- `POST /api/v1/bookings/` → Create a new booking (restricted access)

### 2.2.2 Routes With ID (Individual Resource Routes)

```jsx
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
```

- `GET /api/v1/bookings/:id` → Fetch a single booking by ID
- `PATCH /api/v1/bookings/:id` → Update a booking
- `DELETE /api/v1/bookings/:id` → Delete a booking

---

## Step 3: Testing in Postman

To verify our API functionality, we test endpoints in **Postman**.

### 3.1 Logging in as an Admin

Before testing, we must authenticate:

1. Send a `POST` request to `/api/v1/users/login`.
2. Use credentials (e.g., `admin@natours.io`).
3. Copy the **JWT token** from the response.

### 3.2 Testing Endpoints

### Fetch All Bookings

- `GET /api/v1/bookings/`
- Add **Authorization** header with `Bearer <token>`.

### Fetch a Single Booking

- `GET /api/v1/bookings/:id`
- Ensure correct booking `id` is used.

We verify that:

- The booking details include populated **tour** and **user** data.
- The response includes **price** and other relevant details.

### Saving Requests

- Organize test requests into a `Bookings` folder in Postman.
- Save commonly used requests for quick access.

---

## Final Considerations

- The Bookings API is now fully functional with CRUD operations.
- Authentication and authorization ensure security.
- The `getAllBookings` and `getBooking` endpoints work as expected.
- Further improvements can be made by adding **more detailed error handling** and **validation checks**.

This concludes our implementation of the Bookings API! 🚀
