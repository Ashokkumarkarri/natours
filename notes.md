# Global Error-Handling Middleware

- It's a way to handle all errors in one place in an Express app.
- Ensures consistent and centralized error responses.

#### Creating an global Error

```js
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
```

when we specify the 4 args the express will get to know that it's an error handling middleware.

---

#### Using global error middleware

```js
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server!`,
  // });
  const err = new Error(`can't find ${req.originalUrl} on this server!`); // we pass error message
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});
```

- when next has passed with error, express will get to know that there is an error, and express will leave the next middleware stack and directly execute the error middleware.

---

##### new Error()

Is an built in constructor in JS
we use new **Error()** to create an error object.
