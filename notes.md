# 007 Extending Our Base Template with Blocks

### Notes on Using Extends in Pug Templates

### Introduction

- Extends is one of the most **important** and **complex** features in Pug.
- It allows reusing the same **base layout** for every page you want to render.

---

### Base Template and Content

1. **Base Template Setup**
   - A base template contains common elements like a **header** and **footer**.
   - Individual pages should load **different content** while using the same base layout.
2. **Page Examples**
   - **Overview Page**: Displays all tours.
   - **Tour Details Page**: Shows details for a specific tour.

---

### Implementing Routes for Pages

1. **Overview Page Route**
   - Add a route for `/overview`:
     ```jsx
     app.get('/overview', (req, res) => {
       res.render('overview', { title: 'All Tours' });
     });
     ```
   - Create a new Pug template named `overview.pug`.
2. **Tour Details Page Route**
   - Add a route for specific tours:
     ```jsx
     app.get('/tour', (req, res) => {
       res.render('tour', { title: 'The Forest Hiker Tour' });
     });
     ```
   - Create a Pug template named `tour.pug`.

---

### Filling Content for Pages

1. **Content-Specific Files**
   - Each Pug file (`overview.pug` or `tour.pug`) will include **only the content** for that page (no header or footer).
   - This content will be injected into the **base template** (called the **parent template**) using **extends**.
2. **Extending the Base Template**

   - Overview Page Example:

     ```
     extends base

     block content
         h1 Welcome to the Overview Page
     ```

---

### Extending the Base Template

1. **Defining a Block in the Base Template**
   - Add a block in `base.pug`:
     ```
     block content
         h1 This is a placeholder heading
     ```
   - Blocks act as placeholders where specific page content will be injected.
2. **Overriding Content in a Page Template**

   - Replace the placeholder content by extending the base template:

     ```
     extends base

     block content
         h1 All Tours Overview
     ```

   **Note** : `placeholder` is temporary or sample content used to mark where the actual content will go in the future.

3. **How Extends Works**
   - When a page like `overview.pug` is rendered:
     - The **base template** is used as a skeleton.
     - Content from the `overview.pug` file is injected into the `content` block.

---

### Key Notes

- **Blocks** allow for customization while keeping a shared structure.
- Use `extends` in Pug to connect page-specific templates with the base template.
- Placeholder content in blocks helps during development but gets overridden in actual use.

---

This format should help you grasp and remember the process of using `extends` in Pug. Let me know if you want further elaboration on any point!
