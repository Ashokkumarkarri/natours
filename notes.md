# 005 Creating Our Base Template

### Notes on Creating a Base Template in Node.js using Pug

1. **Introduction to the Base Template**:
   - The base template serves as the foundation for all other templates.
   - The process involves converting an existing HTML file (from the starter files) into a **Pug template**.
   - The focus is on creating the structure: header and footer. The dynamic content will be added later.
2. **Objective**:
   - Prepare a base layout that includes the header and footer.
   - Ensure the template is ready for dynamic injection of content at a later stage.
3. **Steps to Create the Base Template**:
   - **Step 1: Clean Existing Content**:
     - Remove unnecessary placeholder content previously used to demonstrate Pug's features.
   - **Step 2: Convert HTML to Pug**:
     - Open the `overview.html` file and analyze its content.
     - Copy and begin translating its structure into a Pug-compatible format.
4. **Working with the HTML Head Section**:
   - Elements like the **title**, **favicon**, **style links**, and **Google fonts** are part of the head.
   - Copy the title content and ensure proper formatting in Pug using single quotes for attributes.
   - Include responsive web development meta tags and external stylesheets.
5. **Converting the Header Section**:
   - The header contains the dark gray navigation bar at the top.
   - Translate the HTML header structure into Pug using indentation and class syntax:
     - Use `.header` to define the header class.
     - For nested elements, use indentation for structure, e.g., `.nav.nav-tours`.
6. **BEM Architecture**:
   - The structure uses the **Block-Element-Modifier (BEM)** naming convention:
     - **Block**: Represents a standalone entity (e.g., `nav`).
     - **Element**: Denotes components within a block (e.g., `__tours`).
     - **Modifier**: Represents a variation of the block or element (e.g., `-active`).
   - While understanding BEM is optional, it helps maintain organized CSS.
7. **Adding Navigation Links**:
   - Navigation (`<nav>`) contains links (`<a>`).
   - Use Pug's concise syntax to define links and their classes.
8. **Efficiency of Pug**:
   - Translating large blocks of HTML into Pug significantly reduces the amount of code while retaining clarity.
   - Comments in Pug can be written to appear in the HTML output for clarity:
     - Use `//` for visible comments in the HTML.
9. **Finalizing the Base Template**:
   - Once the structure is converted, test the template to ensure everything renders as expected.
   - The header and footer are now ready for dynamic content integration.

---

### Key Notes:

- **Use Single Quotes**: Always replace double quotes with single quotes for attributes in Pug.
- **Indentation**: Pug relies on indentation to represent HTML hierarchy.
- **Reusable Layout**: The base template is designed to be modular, supporting easy injection of dynamic content.

This approach simplifies the transition from static HTML to a Pug-based templating system, allowing for scalable and maintainable web development.

---

### Syntax

### **Basic Syntax**

1. **Tags**:

   Tags are written without angle brackets (`<>`).

   Example:

   ```
   div
   p
   h1
   ```

2. **Classes**:

   Use a `.` followed by the class name.

   Example:

   ```
   div.className
   p.myParagraph
   header.headerClass
   ```

3. **IDs**:

   Use `#` followed by the ID.

   Example:

   ```
   div#myId
   p#uniqueParagraph
   ```

4. **Nesting**:

   Indentation determines nesting.

   Example:

   ```
   div
     p This is a paragraph inside a div.
   ```

5. **Attributes**:

   Use parentheses to specify attributes, separating them with commas.

   Example:

   ```
   a(href="https://example.com", target="_blank") Link to Example
   ```

---

### **Working with Classes and IDs**

- You can combine tags, classes, and IDs.Example:
  ```
  div#main.container
  nav.navbar.navbar-dark
  ```

---

### **Text Content**

- Place the text immediately after the tag.Example:
  ```
  h1 Welcome to My Website
  p This is some content.
  ```

---

### **HTML Comments**

- Use `//` for comments.
  Example:
  ```
  // This is a comment
  ```
- To output comments in the HTML, use `//-`.
  Example:
  ```
  //- This comment will appear in the HTML
  ```

---

### **Lists**

1. **Unordered List**:

   Example:

   ```
   ul
     li Item 1
     li Item 2
   ```

2. **Ordered List**:

   Example:

   ```
   ol
     li First
     li Second
   ```

---

### **Links and Navigation**

- Links are created using the `a` tag with an `href` attribute.
  Example:
  ```
  a(href="/home") Home
  ```
- Nested links in navigation:
  Example:
  ```
  nav.navbar
    a(href="/about") About
    a(href="/contact") Contact
  ```

---

### **Images**

- Use the `img` tag with a `src` attribute.Example:
  ```
  img(src="/path/to/image.jpg", alt="Image description")
  ```

---

### **Including External Files**

- To include external files, use `include`.Example:
  ```
  include header.pug
  ```

---

### **BEM Syntax (Block Element Modifier)**

- BEM syntax can be represented in Pug by chaining classes.Example:
  ```
  div.block__element--modifier
  ```

---

### **Final Example**

Here’s a practical layout using the syntax:

```html
doctype html html head title My Pug Page link(rel="stylesheet",
href="styles.css") body header.headerClass nav.navbar a(href="/") Home
a(href="/about") About main h1 Welcome to Pug p This is a sample template. ul li
Item 1 li Item 2 img(src="logo.png", alt="Logo") footer.footerClass p &copy;
2025 My Website
```

### Summary of Pug Syntax from the Subtitle File

1. **Writing Classes**:
   - Use a dot (`.`) followed by the class name.Example: `.header` creates a `<div>` with the `class="header"`.
   - Multiple classes can be chained using additional dots.Example: `.nav.nav-tours` creates `<div class="nav nav-tours">`.
2. **Defining HTML Elements**:
   - Start with the tag name, followed by a dot or parentheses for attributes.Example:
     ```
     header.header
     nav.nav
     ```
3. **Nesting Elements**:
   - Use indentation for nesting.Example:
     ```
     header.header
       nav.nav
         a(href="#") Link
     ```
4. **Comments**:
   - **Pug-specific Comments**: Start with `//`. These will not appear in the final HTML.Example:
     ```
     // This is a Pug comment
     ```
   - **Visible Comments in Output**: Start with `//-`.Example:
     ```
     //- This is a visible comment in the HTML output
     ```
5. **Attributes**:
   - Use parentheses after the element name.Example:
     ```
     a(href="https://example.com" target="_blank") Link
     ```
6. **Text Content**:
   - Directly write the text after the tag or element.Example:
     ```
     h1 Welcome to the Page
     p This is a paragraph.
     ```
7. **BEM Naming Convention** (optional, but mentioned):

   - Use double underscores (`__`) for elements and single dashes () for modifiers.Example:

     ```
     div.block__element--modifier

     ```

This summary covers the essential syntax you need for writing Pug templates effectively.
