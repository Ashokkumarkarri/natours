## 010 Building the Tour Overview - Part 2

### **Summary: Rendering Tour Cards in a Web App**

1. **Objective**: Display tour data dynamically on a webpage using data from the database.
2. **Template Setup**:
   - Use Pug to loop through the `tours` array and render each card.
   - Populate fields like tour name, image, difficulty, duration, and summary.
3. **Dynamic Fields**:
   - **Images**: Construct paths using `tour.imageCover` (e.g., `/images/tours/${tour.imageCover}`).
   - **Details**: Show start location, first start date, number of stops, and group size.
   - **Dates**: Format dates for readability using JavaScript (`toLocaleString`).
4. **Footer Information**:
   - Display price (`$${tour.price}`) and ratings (e.g., `4.5 (120 ratings)`).
5. **Testing**:
   - Verify data fields match the database schema.
   - Check all rendered content on the webpage for accuracy.

This approach ensures the tour cards are populated and styled dynamically based on database content.
