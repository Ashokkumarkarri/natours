# Adding 404 Not Found Errors in Express

## Purpose

To handle cases when a resource (like a tour) cannot be found in the database and return a proper error message.

## Code Example

```javascript
if (!tour) {
  // If the tour with the given ID doesn't exist, pass an error to the next middleware
  return next(new AppError('No tour found with that ID', 404));
}
```

### Explanation

Check if Resource Exists: if (!tour) checks if the tour object is null or undefined.
Creating a Custom Error: new AppError('No tour found with that ID', 404) creates an error with:
Message: Describes the issue.
Status Code: 404 indicates "Not Found".
Passing the Error: next() sends the error to the global error-handling middleware.
