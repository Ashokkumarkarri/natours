## 009 Building the Tour Overview - Part 1

### Building the Tour Overview Page in Node.js

In this lecture, we focused on creating the **Tour Overview Page**, which will display a list of tours from our database. Currently, the page is empty, and the goal is to populate it with real content. Here’s a step-by-step breakdown of the process:

---

## Steps to Build the Tour Overview Page:

1. **Get Tour Data from the Collection**
   - We need to fetch all the tour data from the database collection using the **Tour Model**.
   - This involves querying the database and retrieving all the records.
2. **Build the Template**
   - Create a Pug template to structure how the data will be displayed on the webpage.
   - This step defines the visual layout but is handled separately from the controller logic.
3. **Render the Template with Data**
   - Combine the fetched tour data with the created template to generate the final dynamic webpage.
   - Pass the data as an object to the template rendering function.

---

## Implementation in Code

### Controller Logic:

- Navigate to the `getOverview` controller function, which is responsible for handling requests to the overview page.
- **Steps to Implement**:

  1. **Import the Tour Model**:

     ```jsx
     const Tour = require('../models/tourModel');
     ```

  2. **Use an Async Function**:

     - Since database queries are asynchronous, mark the controller function as `async` and use a helper function like `catchAsync` to handle errors efficiently.

     ```jsx
     exports.getOverview = catchAsync(async (req, res, next) => {
       const tours = await Tour.find(); // Fetch all tours
       res.status(200).render('overview', {
         title: 'All Tours',
         tours, // Pass tours data to the template
       });
     });
     ```

  3. **Retrieve Data**:
     - Use Mongoose's `.find()` method to get all tour documents from the collection.
  4. **Pass Data to Template**:
     - Render the `overview` template and provide the tour data as part of the `locals` object.

---

## Building the Pug Template

1. **Set Up the Overview Template**:

   - Replace the placeholder in the `overview.pug` file with a proper layout.

   ```
   each tour in tours
       .card
           h3= tour.name
           p= tour.summary
   ```

2. **Use Existing Static HTML as Reference**:
   - Open the static `overview.html` file located in the `public` folder for guidance on how to structure the new template dynamically.
   - Ensure the layout matches the static design but uses Pug syntax and dynamically injects data.

---

## Key Concepts Reinforced

- **Reusability**:
  - All the logic and models created earlier can now be reused seamlessly, demonstrating the importance of modularity.
- **Dynamic Rendering**:
  - Templates like `overview.pug` dynamically adapt based on the data passed to them.

---

## Final Thoughts

By following these steps:

- The **Tour Overview Page** fetches data from the database and dynamically displays it using Pug templates.
- This process illustrates the seamless integration of backend data with frontend templates, a core concept in modern web development.
