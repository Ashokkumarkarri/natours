# Data Validation in Mongoose

Validation in Mongoose helps ensure that the data entering your database follows a specific format and meets certain requirements. It’s essential for maintaining data integrity and avoiding issues from incorrect data types or unexpected values.

### Key Validators in Mongoose

1. **Required**:
   - Ensures a field is filled in before the data is saved. It can be applied to any data type.
   - For example, making a field required guarantees that it must be provided.
2. **Unique**:
   - Ensures that a field’s value is unique within the database collection.
   - Important Note: This is enforced by MongoDB, not directly by Mongoose, so it isn’t considered a true validator in Mongoose itself.
3. **String-Specific Validators**:
   - **maxlength** and **minlength**: Define the maximum and minimum length allowed for a string. Useful for limiting characters in names, summaries, and other text-based fields.
   - **trim**: Removes whitespace from the beginning and end of a string, ensuring that extra spaces don’t affect the value.
4. **Enum**:
   - Restricts a field to a set of allowed values. This is only applicable to strings.
   - Commonly used for fields like "status" or "difficulty level," where only certain specific values are valid.
   - It’s accompanied by a custom message to alert users if they enter an invalid option.
5. **Number-Specific Validators**:
   - **min** and **max**: Define the minimum and maximum numerical values a field can have.
   - Useful for fields like age, ratings, and any numerical limits on values.
6. **Date Validators**:
   - The `min` and `max` validators are also applicable to dates, allowing you to set a range for acceptable dates.

### Using Validators During Updates

- By default, Mongoose validators don’t run on updates. To enforce validation during an update operation, you can set the `runValidators` option to `true`.
- This is especially useful when using update methods like `updateOne` or `updateMany`.

---

### Data Sanitation in Mongoose

- **Purpose**: Sanitation processes the data to prevent malicious code or unintended values from entering the database.
- **Practice**: Sanitation should be applied to all incoming data, particularly from user inputs, to maintain a secure and reliable database.

---

### Validation vs. Sanitation

- **Validation** checks if the data meets the required format and constraints, such as type, length, and specific values.
- **Sanitation** ensures that data is safe and does not contain potentially harmful content.

```js
   name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour name must have less or equal then 40 characters'],
      minlength: [10, 'A Tour name must have grater or equal to 10 characters'],
    }
    //  unique = is not a data validator
    // on string = we can use maxlength, minlength data validator's
```

```js
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
      // Enum is only for string.
      // require is a data validator , we can use for all data types.
    }
```

````js
    ratingsAverage: {
      type: Number,
      default: 4.1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    //  min,max = are not only for numbers, but also works for dates.
    ```
````

- min,max = are not only for numbers but also works for dates

- Enum is only for string.
  enum:{values:["easy","medium","hard"],message:"write the value only from easy,hard,medium"}

- unique = is not a data validator
- require is a data validator , we can use for all data types.

- on string = we can use maxlength, minlength data validator's

- on number = min, max (waht should be the min number, what should be the max munber)

in updateTour = we used runValidators: true, it will run the data validater.
