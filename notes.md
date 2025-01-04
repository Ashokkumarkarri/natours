# 008 Setting up the Project Structure

### Notes: Refactoring and Organizing Code with PUG and MVC Architecture

1. **Understanding PUG Basics**:
   - PUG templates help in creating dynamic views for web applications.
   - Transitioning to an organized structure is essential for scalable and maintainable code.
2. **Refactoring for MVC Architecture**:
   - MVC (Model-View-Controller) separates application logic into three interconnected components:
     - **Model**: Manages the data.
     - **View**: Handles the user interface (UI).
     - **Controller**: Manages the logic and interactions between the model and view.
3. **Creating Routers and Controllers for Views**:
   - A separate router file is created for view-related routes to build dynamic websites.
   - This router organizes all the required routes for rendering views.
4. **Steps to Set Up a Router**:
   - Import Express: `const express = require('express');`
   - Create a router instance: `const router = express.Router();`
   - Define routes using `router.get()` for each view.
   - Export the router module: `module.exports = router;`
5. **Mounting the Router in the Main App**:
   - Import the view router in the main application file (e.g., `app.js`).
   - Mount the router:
     ```jsx
     const viewRouter = require('./routes/viewRoutes');
     app.use('/', viewRouter);
     ```
6. **Refactoring Controller Functions**:
   - Create a separate file for controllers (e.g., `viewsController.js`).
   - Define functions for each route, such as `getOverview`:
     ```jsx
     exports.getOverview = (req, res) => {
       res.status(200).render('overview');
     };
     ```
   - Replace inline route logic with controller functions in the router file.
7. **Adjusting Routes for Better UX**:
   - Replace route names like `/overview` with `/` to serve the main page when the application loads.
8. **Future Enhancements**:
   - Replace placeholder logic in controller functions with actual data fetching and rendering.
