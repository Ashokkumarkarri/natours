# Custom Validators in Mongoose

Custom validators allow you to define specific rules for fields that may not be covered by Mongoose's built-in validation options. This is useful for applying unique business logic directly within your schema.

### Example: Custom Validator for priceDiscount

In this example, we want to ensure that the priceDiscount value is always less than the price value. This is a common requirement to validate that discount prices make logical sense in relation to the original price.

```js
priceDiscount: {
type: Number,
validate: {
validator: function (val) {
return val < this.price;
},
message: 'Discount price ({VALUE}) should be below the regular price',
},
}
```

## Key Points:

- Validator Function:
  - The custom validator function (val) => val < this.price checks if the priceDiscount is less than the price field.
  - It returns true if the condition is met (validation passes) and false if it fails (validation error is triggered).

* Context (this):

  - Inside this validator function, this refers to the current document only when creating a new document (not when updating).
  - This means the validator will work on new documents but may not behave as expected during updates.

- Custom Message:

  - If validation fails, the message provides a meaningful error, substituting {VALUE} with the actual value of priceDiscount.
  - The error message will read as: "Discount price (value) should be below the regular price," providing clear feedback to users.

---

# Custom Validation with Third-Party Libraries in Mongoose

Mongoose allows you to use third-party libraries for advanced validation, enabling more control over the type and format of data accepted by your application. A common choice for this is the validator package, which offers built-in functions for string checks, number constraints, and more.

### Example: Using validator.isAlpha for Name Validation

In this example, we ensure that a name field contains only alphabetic characters (no numbers or spaces).

```js
name: {
  type: String,
  validate: [
    validator.isAlpha,
    'Name should contain letters only; no numbers or spaces allowed',
  ],
}
```

### Key Points:

1. validator.isAlpha:

   - This function checks if the value contains only letters.
   - It’s part of the validator package, which provides various methods for common data validation tasks.

2. Custom Error Message:
   - If the validation fails, the message 'Name should contain letters only; no numbers or spaces allowed' will be displayed, guiding users to enter only alphabetic characters.

## Advantages of Using Third-Party Validators:

- Reusability: Common validations are easily reused across multiple fields and models.
- Readability: Functions like isAlpha make validation logic more intuitive.
- Extended Validation: The validator package includes options beyond Mongoose’s built-in validators, such as checking email formats, URL validation, etc.

---

Using third-party validators like validator.isAlpha helps maintain clean and readable validation logic, especially for common requirements across different fields and applications
