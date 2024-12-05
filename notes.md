## 006 Modelling Tour Guides\_ Child Referencing

---

### **1. What is Child Referencing?**

- **Definition**: Child referencing involves storing the `ObjectId`s of related documents in a parent document.
- **Key Advantage**: Avoids data duplication while allowing flexibility in querying related data.

---

### **2. Implementing Child Referencing in Mongoose**

- To set up child referencing, update the schema as follows:

```jsx
guides: [
  {
    type: mongoose.Schema.ObjectId, // Store ObjectId of the referenced documet.
    ref: 'User',                   // Link to the 'User' model.
  },
],
```

- **No Middleware Required**: Unlike embedding, you don’t need to use pre-save middleware to fetch related documents.

---

### **3. How to Use**

1. **POST Request**:

   - Provide an array of `ObjectId`s for the `guides` field when creating or updating a tour document.

   ```json
   {
     "name": "Adventure Tour",
     "guides": ["64a7f9b9c1e6df001c3e9876", "64a7f9b9c1e6df001c3e9877"]
   }
   ```

2. **GET Request Response**:

   - Fetching the tour document will return the `guides` field containing the `ObjectId`s:

   ```json
   {
     "name": "Adventure Tour",
     "guides": ["64a7f9b9c1e6df001c3e9876", "64a7f9b9c1e6df001c3e9877"]
   }
   ```

---

### **5. Benefits of This Approach**

- **Simplicity**: No need to manually fetch related data using middleware.
- **Flexibility**: Retrieve related data only when needed (using `populate()`). (we will see this in next viedo)
- **Performance**: Reduces the size of the parent document, improving query speed.

---

### **6. Summary**

- Use `type: mongoose.Schema.ObjectId` and `ref: 'User'` to establish references.
- Provide an array of `ObjectId`s in the `guides` field when creating or updating documents.
- Use `populate()` to retrieve complete details of referenced documents.
