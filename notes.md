### Purpose of a Templating Engine

- **Dynamic Content**: Enables injecting data (e.g., tours, users, reviews) into HTML for a dynamic and interactive website.
- **Code Reusability**: Reuse templates like headers, footers, and navigation bars across multiple pages.
- **Improved Maintainability**: Separates HTML structure from logic, making code cleaner and easier to maintain.

---

### Choosing a Templating Engine

- **Pug**:
  - Popular for Express due to its concise, readable syntax.
  - Widely used in web development.
- **Other Options**:
  - Handlebars and EJS can be used if they better fit your project requirements.

---

### Setting Up Pug in Express

1. **Specify the Templating Engine**:
   - Tell Express to use the Pug engine:
     ```jsx
     app.set('view engine', 'pug');
     ```
   - No manual installation or requiring of the engine in the code is necessary after installation.
2. **Define the Views Directory**:
   - Specify where the Pug templates will be stored:
     ```jsx
     const path = require('path');
     app.set('views', path.join(__dirname, 'views'));
     ```
   - **Why `path.join()`?**
     - Ensures platform-independent path handling, avoiding issues with slashes.
   - **Path Module**:
     - Built into Node.js, ensures compatibility across operating systems.

---

### Steps to Set Up the Views Folder

1. Create a folder named **views** in your project directory.
2. This aligns with the **Model-View-Controller (MVC)** architecture:
   - **Models**: Handle data and logic.
   - **Controllers**: Manage application logic.
   - **Views**: Render data for the client.

---

### Creating a Basic Pug Template

1. **Syntax Overview**:
   - Concise and indentation-based:
     - Example: `h1 The Park Camper` equals `<h1>The Park Camper</h1>`.
2. **Steps**:
   - Create a file `base.pug` inside the **views** folder.
   - Add:This renders `<h1>The Park Camper</h1>`.
     ```
     h1 The Park Camper
     ```

---

### Rendering a Pug Template

1. **Define a Route**:

   ```jsx
   app.get('/', (req, res) => {
     res.render('base');
   });
   ```

   - **`res.render()`**: Renders the `base.pug` file and sends the generated HTML to the browser.

2. **Views Directory**:
   - Express automatically looks for templates in the **views** directory.

---

### Key Considerations

1. **Pug Installation**:
   - Install Pug in your project:
     ```bash
     npm install pug
     ```
2. **Dynamic Content**:
   - Pug supports variables, loops, and conditionals to make templates dynamic.
3. **MVC Architecture**:
   - Templates are essential in the **Model-View-Controller** paradigm.

---

### Summary

- **Templating engines** like Pug simplify dynamic website creation by separating structure and data.
- Setting up involves configuring the engine, defining the views directory, and creating templates.
- Using Pug, you can create concise, reusable, and maintainable HTML templates while following the MVC architecture for organized code.
