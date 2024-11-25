### Notes for User Deletion Process (Soft Delete)

1. **Soft Deleting User Accounts**:
   - Instead of permanently deleting a user from the database, we implement a _soft delete_ by setting the `active` field to `false`.
   - This allows the user to reactivate their account in the future if needed.
2. **Behavior of the `active` Field**:

   - The `active` field is of type `Boolean` and is set to `true` by default when a user account is created.
   - This property is **hidden** from public responses (e.g., it won't appear in Postman or API responses) using `select: false` in the schema.

   ```jsx
   active: {
     type: Boolean,
     default: true,
     select: false,
   }
   ```

3. **Route to Delete User**:

   - The user can soft-delete their account by hitting the `/deleteMe` route.
   - The `authController.protect` middleware ensures the user is authenticated before proceeding.
   - The account's `active` field is updated to `false` when the route is accessed.

   ```jsx
   router.delete('/deleteMe', authController.protect, userController.deleteMe);
   ```

4. **`deleteMe` Controller Logic**:

   - The `deleteMe` function sets the `active` field of the authenticated user to `false`.
   - Although the `active` status is updated in the database, we don't expose this change to the user in the API response.
   - A `204 No Content` response is sent as a best practice to confirm the operation.

   ```jsx
   exports.deleteMe = catchAsync(async (req, res, next) => {
     await User.findByIdAndUpdate(req.user.id, { active: false });

     res.status(204).json({
       status: 'success',
       data: null,
     });
   });
   ```

5. **Hiding Inactive Users in API Responses**:

   - Inactive users (where `active` is `false`) are excluded from all `GET` requests using query middleware.
   - This ensures that only active users are displayed when querying the database, such as with a "Get All Users" API.

   ```jsx
   userSchema.pre(/^find/, function (next) {
     // Only find documents where active is true
     this.find({ active: { $ne: false } });
     next();
   });
   ```

6. **Query Middleware (`pre` Hook)**:
   - The `pre` hook runs before any `find` query (e.g., `find`, `findOne`, `findById`).
   - It filters out inactive users by adding a condition to the query to exclude users with `active: false`.
7. **Final Flow**:
   - When a user logs in and deletes their account:
     - Their `active` field is set to `false`.
     - The field remains hidden from responses (e.g., Postman or user API data).
   - Inactive users are automatically excluded from being shown in "Get All Users" queries or any other queries.

This design ensures:

- Users can deactivate their accounts securely.
- Inactive accounts are hidden from public access.
- Reactivating an account in the future is possible without creating a new one.

## code :

```js
//controller logic
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  //in postman we do not see this status code. but even tough it's best practice to send a response.

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
```

```js
//route
router.delete('/deleteMe', authController.protect, userController.deleteMe);
```

```js
//userSchema
  active: {
    type: Boolean,
    default: true,
    select: false,
  },

```
