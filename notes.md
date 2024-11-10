### `signup` Controller Overview

The `signup` function in this Node.js application handles user registration by creating a new user in the database.

#### Key Points

1. **Purpose**:

   - Handles new user registration by saving data to the database.

2. **Error Handling**:

   - Uses `catchAsync` to handle errors, removing the need for a `try-catch` block.

3. **Creating a User**:

   - `User.create(req.body)` saves the user data from `req.body` to the database.

4. **Response**:

   - Returns a `201` status code on success, indicating that a new resource (user) has been created.
   - The response includes:
     ```json
     {
       "status": "Success",
       "data": {
         "user": newUser
       }
     }
     ```

5. **Best Practices**:
   - Ensure sensitive data, such as passwords, is hashed and validated before saving.
   - Use input validation to prevent unwanted data from being saved.

#### Example Code

```javascript
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      user: newUser,
    },
  });
});
```
