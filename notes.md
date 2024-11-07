## 010 Handling Invalid Database IDs

Sometimes Mongoose will send an error that won’t be an instance of our `AppError` class, but we still want to send it to the client. This error may be one of three types;

1. **Cast Error**: Happens when a MongoDB ID is invalid. Handled by `handleCastErrorDB`, which returns a 400 status with a message indicating the invalid field.
2. **Duplicate Field Error**: Occurs when a unique field is duplicated (like using the same email for two users). `handleDuplicateFieldsDB` captures this with error code `11000` and returns a message to use another value.
3. **Validation Error**: Triggered by incorrect data format (e.g., an invalid rating). `handleValidationErrorDB` loops through each error and joins messages into one.

**Environment-Based Response**:

- **Development**: Sends detailed error info (status, message, stack).
- **Production**: Sends minimal info, hiding sensitive details.

This setup ensures a smooth user experience by only displaying relevant error messages to clients, especially in production.

```js
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; //shallo coppy
    if (err.name === 'CastError') {
      error = handelCastErrorDB(error);//we created this fun and calling it
    }
    sendErrorProd(error, res);
  }
};

```

```js
const handelCastErrorDB = (err) => {
  const message = `Invalid  ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
```
