## Handling validation errors in production env.

we have set some validators in our tourModel

#### example:

```js
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A Tour name must have less or equal then 40 characters'],
      minlength: [10, 'A Tour name must have grater or equal to 10 characters'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },

```

The data enter by the user will be pass these validator the error will be sent.
Now we need to handle those errors.

---

```js
//function to handel the validationErros
const handelValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data.. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
```

calling that fun

```js
if (err.name === 'ValidationError') error = handelValidationErrorDB(error);
```
