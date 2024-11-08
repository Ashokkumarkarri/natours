## 010 Handling Invalid Database IDs

when we try to enter the same duplicate name while we are creating the new tour.
since the name already there we might get an error.
To handed that error in product env we had written this code.

if the env is dev we need all the info from the error, like what's happing, where, how all this.
but when the code is in production user does want to know all that, he just wanted to know weather app is working, if not what error, what code.

```jsx
if (error.code === 11000) error = handelDuplicateFieldsDB(error);
```

```jsx
const handelDuplicateFieldsDB = (err) => {
  let val = err.keyValue.name;
  const message = `Duplicate field value: ${val}. Please use another value!`;
  return new AppError(message, 400);
};
```
