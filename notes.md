# 005 Modelling Tour Guides\_ Embedding

`Note:`
As discussed above, we can either embed or reference our tour guides in our tour documents.
Although embedding our tour guides won’t be our final strategy, we’ll try it out for the sake of example.

---

### 1. **Overview**

In MongoDB, we can associate tour guides with a tour document in two ways:

- **Embedding**: Storing the entire user (guide) data directly within the tour document.
- **Referencing**: Storing only the IDs of the user (guides) and fetching their details as needed.

Although embedding will not be our final approach, it is useful to explore its implementation for better understanding.

---

### 2. **Embedding Tour Guides**

#### **What is Embedding?**

- **Embedding** involves directly including the **user (guide) data** within the tour document.
- This approach is simple and reduces the need for additional queries when accessing tour data.

---

### 3. **Adding Guides to the Tour Schema**

- Add a `guides` field to the schema, which is an **array of user IDs**.

```jsx
guides: [String], // Array of User IDs
```

---

### 4. **Creating a New Tour with Guides**

- When creating a new tour, pass an array of user IDs for the guides:

```json
{
  "name": "A New Tour",
  "duration": 365,
  "maxGroupSize": 15,
  "difficulty": "medium",
  "price": 1497,
  "priceDiscount": 200,
  "summary": "Test tour rofl",
  "imageCover": "tour-5-cover.jpg",
  "ratingsAverage": 5,
  "guides": ["5dd5cfb6a734415b3e2339d3", "5dd59a35f4ac7907596ef89a"]
}
```

---

### 5. **Populating User Data in the Tour Document**

- To embed the full guide details into the tour, we use **middleware** to fetch user data from the database based on their IDs.

### **Pre-Save Middleware**

- The `pre-save` middleware is triggered before the document is saved to the database.
- Steps:
  1. Use `map()` to loop over each guide ID and fetch the user document with `User.findById(id)`.
  2. Mark the `map()` callback as `async` to handle asynchronous operations.
  3. Use `Promise.all()` to wait for all the promises to resolve before proceeding.
  4. Replace the `guides` field with the fetched user data.

```jsx
// Middleware to fetch and embed guide data
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id)); // Array of promises
  this.guides = await Promise.all(guidesPromises); // Resolve all promises
  next(); // Call the next middleware
});
```

---

### 6. **Key Concepts Explained**

- **Async Map**:
  - `map()` creates an array of promises by calling `User.findById(id)` for each guide ID.
  - Example:Result: `[Promise, Promise]`
    ```jsx
    ['id1', 'id2'].map(async (id) => await User.findById(id));
    ```
- **Promise.all()**:
  - Waits for all promises in the array to resolve.
  - Converts `[Promise, Promise]` into an array of resolved values: `[User1, User2]`.
- **Pre-Save Middleware**:
  - Ensures the `guides` field is populated with user data before the document is saved.

---

### 7. **Limitations**

- The `pre-save` middleware only works when **creating new documents** or saving an existing document.
- This approach increases the size of the tour document as it includes full guide details.

---

### 8. **Advantages of Embedding**

- Eliminates the need for additional queries to fetch guide data.
- Simplifies data retrieval for read operations.

---

### 9. **When to Use Embedding**

- When the related data (e.g., guides) is relatively small and does not change frequently.
- Example: If each tour has only a few guides and their information rarely updates.

---

### 10. **Conclusion**

Embedding is a useful approach for associating related data with a document.
The `pre-save` middleware ensures that the `guides` field is populated with complete user details before saving the tour document. However, this strategy may not be ideal for scenarios where the related data is large or frequently updated.
In such cases, referencing may be a better alternative.
