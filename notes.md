## 011 **Authorization: User Roles and Permissions**

### **Agenda**

Determine if a user is allowed to perform a specific action based on their role.

**Example:** Check if a user has permission to delete a specific route.

---

### **Steps to Implement**

### **Step 1: Update the User Model with a Role Field**

Add a `role` field to define user roles with predefined values:

```jsx

role: {
  type: String,
  enum: ['user', 'guide', 'lead-guide', 'admin'], // Allowed roles
  default: 'user', // Default role
}
```

---

### **Step 2: Create Middleware to Restrict Access**

Implement logic to verify if a user's role matches the required permissions.

```jsx
// Middleware to restrict actions based on user roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Example: roles = ['admin', 'lead-guide']
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next(); // Proceed if authorized
  };
};
```

---

### **Step 3: Update the Route**

Integrate the middleware into the route to restrict specific actions.

```jsx
router
  .route('/:id')
  .get(tourController.getTour) // Public access
  .patch(tourController.updateTour) // Restricted to certain roles
  .delete(
    authController.protect, // Ensure the user is authenticated
    authController.restrictTo('admin', 'lead-guide'), // Restrict to specific roles
    tourController.deleteTour, // Controller for deleting the tour
  );
```

---

### **Key Points**

- **Role Management:** Use the `enum` type to define allowed roles in the database schema.
- **Middleware Logic:** Use `rest parameter syntax` to pass allowed roles dynamically.
- **Authorization in Routes:** Chain middleware functions for authentication (`protect`) and role-based authorization (`restrictTo`).
