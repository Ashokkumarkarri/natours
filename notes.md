# 013 Including a Map with Mapbox - Part 1

### **Fixing a Bug in Tour Title**

- **Issue Identified**:
  - While viewing the "Park Camper" tour page, the title incorrectly displays as "The Forest Hiker."
  - This happens because the tour title is hardcoded as "The Forest Hiker" in the backend (`get tour handler`).
- **Solution**:
  - Replace the hardcoded title with a dynamic value from the tour data:
    ```jsx
    tour.name.toUpperCase();
    ```
  - This ensures the correct title is displayed for each tour.

---

### **Integrating a Map Using Mapbox**

1. **Purpose**:
   - Display all locations of a tour on a map within the website.
2. **Library Used**:
   - **Mapbox**: A front-end library that allows embedding interactive maps.
3. **Development Approach**:
   - Write client-side JavaScript to integrate Mapbox into the website.
   - Embed this functionality within the tour page template.

---

### **Steps to Integrate Mapbox**

### 1. Prepare Client-Side Code

- **Locate Public Assets**:
  - Client-side resources like CSS, images, and JavaScript files are stored in the `public` folder.
- **Create JavaScript File**:
  - Add a new file named `mapbox.js` in the `public/js` folder.
  - Include a basic script to test the integration:
    ```jsx
    console.log('Hello from the client side');
    ```

### 2. Add Script to Templates

- **Decide Placement**:
  - The `mapbox.js` script should only load on the tour page, not globally.
- **Extend Base Template**:
  - Modify the base template to include a new block named `head`.
    ```html
    {% block head %}
    <!-- Existing head content -->
    {% endblock %
    ```
- **Append the Script in the Tour Template**:
  - Use the `block append` feature to add the script without overwriting existing content:
    ```html
    {% block append head %}
    <script src="js/mapbox.js"></script>
    {% endblock %}
    ```
- **Alternative**: Use `block prepend` to insert the script at the beginning.
