### **Building the Tour Detail Page**

### **Overview**

- In this lesson, we aim to build the **Tour Detail Page**, which includes:
  - Utilizing advanced Pug techniques like conditionals and mixins.
  - Rendering dynamic content such as reviews and tour guides.
  - Skipping the implementation of the map section for now, focusing on other elements.

### **Key Elements of the Tour Detail Page**

- The page contains:
  - A detailed view of the tour.
  - Reviews from users.
  - Information about tour guides.
  - Existing navigation buttons and URLs for tours.

---

### **Initial Setup**

1. **Error Handling for Missing Routes**
   - Currently, accessing the tour detail page results in an error because no route or controller exists for this page.
2. **Challenge: Create the Route and Controller**
   - **Objective:** Set up a route for the detail page and create a controller to fetch and render the required data.
   - **Steps:**
     1. Create a **route** for the detail page.
     2. Write a controller function to:
        - Fetch data for the requested tour.
        - Include **reviews** and **tour guides** in the data.

---

### **Step-by-Step Implementation**

### **1. Create the Route**

- Define the route in the Express application:
  ```jsx
  app.get('/tour/:slug', tourController.getTour);
  ```
  - **Key Points:**
    - Use `:slug` as a URL parameter instead of an ID to align with the structure of the overview page (`/tour/:slug`).

---

### **2. Fetching Data in the Controller**

- Implement the `getTour` controller to fetch the tour's details dynamically.

### **Controller Code**

```jsx
const tour = await Tour.findOne({ slug: req.params.slug })
  .populate({
    path: 'reviews',
    select: 'review rating user',
  })
  .populate({
    path: 'guides',
    select: 'name photo',
  });
```

### **Explanation**

1. **Using `findOne` Instead of `findById`:**
   - Since the request uses a slug rather than an ID, `findOne` is used to query the database.
   - `req.params.slug` retrieves the slug from the URL.
2. **Populating Related Fields:**
   - **Reviews:**
     - Fetch only essential fields: `review`, `rating`, and `user`.
     - Reduces the data sent to the client, improving performance.
   - **Tour Guides:**
     - Fetch specific fields: `name` and `photo`.
3. **Async/Await Syntax:**
   - Ensure the function is marked as `async` to handle the asynchronous database query.
4. **Linting Benefits:**
   - Tools like ESLint help catch common errors, such as forgetting the `async` keyword.

---

### **3. Pass Data to the Template**

- Pass the fetched tour data to the template for rendering:
  ```jsx
  res.status(200).render('tour', { tour });
  ```

---

### **Template Development**

- Remove placeholder content from the existing template.
- Use the tour data passed from the controller to dynamically render the page.

---

### **Additional Notes**

- **Dynamic Content Rendering:**
  - Use Pug's features like conditionals and mixins to create reusable and maintainable templates.
- **Focus on Minimal Data Fetching:**
  - Avoid fetching unnecessary fields to optimize performance.

---

### **4. Mixins in Pug**

Mixins are reusable blocks of code or templates. They work like functions, allowing you to define a component once and reuse it across different parts of your application.

#### **Defining a Mixin**

```jsx
mixin card(title, description)
  .card
    h2 #{title}
    p #{description}
```

#### **Using a Mixin**

```jsx
+card('Welcome', 'This is a reusable card component.') +
  card('About Us', 'Learn more about our company.');
```

### **What is a Slug in URLs?**

A **slug** is a user-friendly and SEO-friendly portion of a URL that typically describes the content of a page. It’s the part of the URL that comes after the domain name and often resembles the title of the page.

#### **Example of a URL with a Slug:**

```arduino
https://example.com/tours/amazing-mountain-tour
```

In this case, **`amazing-mountain-tour`** is the slug.

---

#### **Why Use Slugs Instead of IDs in URLs?**

1. **Improves Readability:**
   - Slugs are descriptive and help users understand what the page is about.
   - Example:
     - `https://example.com/tours/12345` (less readable)
     - `https://example.com/tours/amazing-mountain-tour` (more readable)
2. **Search Engine Optimization (SEO):**
   - Search engines use keywords in slugs to rank pages.
   - A meaningful slug can improve the visibility of your page in search results.
3. **User Experience:**
   - A slug makes the URL more user-friendly and aesthetically pleasing.
4. **Avoid Exposing Sensitive Information:**
   - Using slugs instead of IDs prevents exposing database IDs or other sensitive data.

---

#### Define slug in Model

If you want to use **slugs** in your application, you need to define a `slug` field in your model. This allows you to store the slug value for each document in your database.

#### **Steps to Use Slugs in Your Model**

1. **Define a `slug` Field in the Schema**

   - Add a field in your Mongoose schema or ORM model to store the slug.

   ```jsx
   const mongoose = require('mongoose');
   const tourSchema = new mongoose.Schema({
     name: {
       type: String,
       required: [true, 'A tour must have a name'],
       unique: true,
     },
     slug: String, // Field for the slug
     // Other fields...
   });
   ```

2. **Generate the Slug Automatically**

   - Use a library like `slugify` to generate a slug from a specific field (e.g., `name`) before saving the document.
   - Add a pre-save middleware to automate the slug generation.

   ```jsx
   const slugify = require('slugify');

   tourSchema.pre('save', function (next) {
     // Generate slug from the name field
     this.slug = slugify(this.name, { lower: true });
     next();
   });
   ```

   **How it works:**

   - Before saving a document to the database, the `slug` field is populated using the `name` field.
   - Example:
     - Name: `"Amazing Mountain Tour"`
     - Generated Slug: `"amazing-mountain-tour"`

3. **Store the Slug in the Database**
   - When creating a new document, the slug will be automatically generated and stored in the database.
4. **Use the Slug for Queries**
   - Fetch data based on the slug instead of an ID.
