# 015 Building Handler Factory Functions Delete

### **Handler Factory Function in Node.js**

- **Purpose**: Create a reusable function for deleting, updating, creating, or reading documents in any collection.
- **Why?**
  - Reduces duplicate code in controllers.
  - Easier to apply changes (e.g., status codes) across all handlers.
- **What is a Factory Function?**
  - A function that returns another function.
  - In this case, returns handler functions for CRUD operations.

---

### **Steps to Create a Delete Handler Factory**

1. **Identify the Problem**:
   - Delete handlers (and others) often look similar but are specific to each model (e.g., tours, reviews).
2. **Solution**:
   - Write a single, generic function that can handle all models.
3. **Implementation**:
   - **New File**: Create `handlerFactory.js` in the `controllers` folder.
   - **Factory Function**:
     - Accepts a model as an argument.
     - Returns an async handler function for deleting documents.
4. **Generalize the Code**:
   - Replace specific model (e.g., `Tour`) with a generic `model`.
   - Use `document` instead of specific terms like `tour`.

---

### **Example: Generalized Delete Handler**

-### **Example: Generalized Delete Handler**

- **Old (Specific)**:
  Handles only tours:
  ```js
  const deleteTour = async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    // Response logic...
  };
  ```
- **New (Generic)**:
  Works for any model:

  ```js
  const deleteOne = (model) => async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    // Response logic...
  };
  ```

      - Pass the model (e.g., `Tour`, `User`) to `deleteOne` for reuse.

### **Why Learn This?**

- Advanced logic every JavaScript developer should know.
- Prepares for scalable, maintainable applications.
- Avoid repetitive manual work in controllers.
