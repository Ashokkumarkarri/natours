### Notes on Pug Templates

### **Introduction to Pug**

- Pug is a whitespace-sensitive syntax for writing HTML.
- The core idea is simplicity: you write HTML using just element names and indentation.
- It's essential to have basic HTML knowledge to work effectively with Pug.

---

### **Setting Up Basic HTML Structure in Pug**

1. **Doctype and HTML Element**:
   - All HTML documents start with a `<!DOCTYPE>` declaration and an `<html>` element.
   - In Pug, the syntax is simplified:
     - Write `doctype html` for the doctype.
     - Write `html` to define the root element.
2. **Nested Elements**:
   - Pug uses **indentation** to represent nested HTML elements.
   - For example, a `<head>` element inside `<html>` is written as:
     ```
     html
       head
     ```
3. **Title Element**:
   - Add the `<title>` inside the `<head>`:
     ```
     head
       title Natours
     ```
   - The content of the `title` appears in the browser tab.
4. **Body Element**:
   - The `<body>` element is a sibling of `<head>` and is written at the same indentation level:
     ```jsx
     html
       head
         title Natours
       body
         h1 Welcome to Natours
         p This is just some text.
     ```

---

### **Rendering the Template in the Browser**

- Save the Pug file, render it, and check in the browser.
- You will see:
  - The structure (HTML elements like `<head>`, `<body>`) in the browser's developer tools.
  - The page title in the browser tab.

---

### **Including Additional Elements**

1. **CSS Stylesheet**:
   - In standard HTML, a `<link>` elsheets:
     ```html
     <link rel="stylesheet" href="style.css" />
     ```
   - In Pug, attributes are added in parentheses after the element name:
     ```
     link(rel='stylesheet' href='style.css')
     ```
2. **Favicon**:
   - Similar to including a CSS file, add a `<link>` for the favicon:
     ```
     link(rel='icon' href='favicon.ico')
     ```

---

### **Attributes in Pug**

- Attributes are written inside parentheses.
- Syntax:
  ```
  element(attribute='value' anotherAttribute='value')
  ```
- Always use single quotes for values.

---

### **Advantages of Pug Syntax**

- No need for opening and closing tags.
- Eliminates unnecessary clutter in the code.
- Easy to read and write compared to traditional HTML.

---

### **Best Practices**

- Use consistent indentation (spaces are preferred over tabs).
- Keep your code clean and organized for better readability.

---

---

- **Pug Syntax:**
  - **Indentation:** Defines the hierarchy of elements.
  - **Attributes:**
    - Defined within parentheses after the element name.
    - Example: `link(rel='stylesheet' href='css/style.css')`
  - **Variables:**
    - Passed from Express using `res.render('base', { tour: 'The Forest Hiker', user: 'Jonas' });`
    - Accessed in Pug using `=` (e.g., `h1= tour`)
- **Code Types:**
  - **Buffered Code:**
    - Code that generates output (e.g., `h2= user.toUpperCase()`).
    - Can include JavaScript expressions.
  - **Unbuffered Code:**
    - Code that does not generate output.
    - Begins with (e.g., `const x = 9`).
  - **Interpolation:**
    - Used to insert variables within text.
    - Example: `h1 Natours | #{tour}`

---

---

---

### **1. Buffered Code**

- **Definition**: Buffered code generates output directly into the template. It uses an equal sign `=` to indicate that the result of the expression should be displayed in the output HTML.
- **Use Case**: Whenever you want to display dynamic data or evaluate an expression directly in the rendered HTML.
- **Syntax**:
  ```
  h2= user.toUpperCase()
  ```
  This will render an `<h2>` element, and the content will be the value of `user.toUpperCase()`.
- **Example**:
  ```
  html
    body
      - const user = "john doe"
      h2= user.toUpperCase()
  ```
  **Output**:
  ```html
  <html>
    <body>
      <h2>JOHN DOE</h2>
    </body>
  </html>
  ```
- **Notes**: Buffered code can include JavaScript expressions like string methods, mathematical calculations, or function calls.

---

### **2. Unbuffered Code**

- **Definition**: Unbuffered code is JavaScript code that does not generate any output in the HTML. It begins with a dash `` and is often used to declare variables, perform calculations, or execute logic.
- **Use Case**: When you need logic, variables, or calculations without displaying them in the output.
- **Syntax**:
  ```
  - const x = 9
  ```
  This will execute the code but not display anything in the rendered HTML.
- **Example**:
  ```
  html
    body
      - const user = "jane smith"
      - const age = 25
      h2= `Name: ${user}`
      p Age: #{age}
  ```
  **Output**:
  ```html
  <html>
    <body>
      <h2>Name: jane smith</h2>
      <p>Age: 25</p>
    </body>
  </html>
  ```
- **Notes**: Use unbuffered code for backend logic that does not directly affect the DOM.

---

### **3. Interpolation**

- **Definition**: Interpolation is a way to insert variables or expressions directly into text. It uses the syntax `#{expression}` to embed dynamic values within a line of text.
- **Use Case**: To mix static text with dynamic data in a single element.
- **Syntax**:
  ```
  h1 Welcome to #{tourName}
  ```
  This will embed the value of `tourName` in the heading text.
- **Example**:
  ```
  - const tourName = "Natours"
  - const location = "New York"
  html
    body
      h1 Welcome to #{tourName}
      p The tour starts in #{location}.
  ```
  **Output**:
  ```html
  <html>
    <body>
      <h1>Welcome to Natours</h1>
      <p>The tour starts in New York.</p>
    </body>
  </html>
  ```
- **Advanced Interpolation**:
  You can use expressions and calculations inside `#{}`.
      ```
      p Total Price: $#{price * 1.2} (including tax)
      ```

      **Output**:

      ```html
      <p>Total Price: $120 (including tax)</p>
      ```

---

### **Comparison of Buffered Code, Unbuffered Code, and Interpolation**

| **Feature**  | **Buffered Code**                    | **Unbuffered Code**                | **Interpolation**                       |
| ------------ | ------------------------------------ | ---------------------------------- | --------------------------------------- |
| **Output**   | Generates HTML output.               | No HTML output.                    | Generates HTML output.                  |
| **Syntax**   | `=` after the tag.                   | `-` before the JavaScript code.    | `#{expression}` inside text.            |
| **Use Case** | Display dynamic data or expressions. | Perform logic or define variables. | Embed variables or expressions in text. |

---
