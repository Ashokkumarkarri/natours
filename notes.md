# 016 Modelling the Bookings

---

# Node.js: Creating the Booking Model with Mongoose

## Introduction

In this section, we will create a **Booking Model** using Mongoose in Node.js. The Booking model will store details about a tour booking, including references to the **User** and **Tour** models, the booking price, creation date, and payment status. Additionally, we will use **query middleware** to automatically populate referenced data whenever a query is made.

## Steps to Create the Booking Model

### 1. Importing Mongoose

First, we need to import Mongoose to define the schema and create the model.

```jsx
const mongoose = require('mongoose');
```

### 2. Defining the Booking Schema

The Booking Schema will include:

- A reference to the **Tour** being booked
- A reference to the **User** making the booking
- The **price** at the time of booking
- The **createdAt** timestamp
- A **paid** status field

### 2.1 Using Parent Referencing

We will use **parent referencing** to store only the IDs of the related User and Tour documents. This approach improves performance by keeping the booking documents lightweight.

```jsx
const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a Price'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
```

### 3. Automatic Population of Related Fields

We want to automatically populate the **tour** and **user** fields whenever a query is made. This is done using **Mongoose query middleware**.

### 3.1 Adding a Pre Query Middleware

The following middleware executes before any **find** query, ensuring that the related user and tour data are included in the results:

```jsx
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name', // Only selecting the tour name to optimize performance
  });
  next();
});
```

### 4. Creating and Exporting the Model

Finally, we create a **Booking** model from our schema and export it.

```jsx
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
```

## Summary

- We created a **Booking Model** with fields for **user, tour, price, createdAt,** and **paid** status.
- We used **parent referencing** for User and Tour relationships.
- We added a **query middleware** to automatically populate referenced fields.
- Finally, we exported the model for use in other parts of the application.

## Use Case

This model will be used in the application to handle bookings made by users. Admins or tour guides can query this data to check bookings and manage payments.

Now that the Booking model is ready, we can proceed to implementing booking functionality in the next section! 🚀
