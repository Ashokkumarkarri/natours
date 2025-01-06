# 012 Building the Tour Page - Part

## Quick Facts Section Recap

- Previously, we built the **Quick Facts** section using **mixins**.
- Mixins allow reusable chunks of Pug code, making our templates modular and efficient.

---

## Building the Guides Section

1. **Dynamic Guide Generation**:
   - The number of guides for each tour varies.
   - Use a **loop** to dynamically create guide elements based on `tour.guides`.
2. **Database Association**:
   - `tour.guides` contains user IDs in the database.
   - When populated using Mongoose, it contains user documents with properties like `name` and `photo`.
3. **Guide Details**:
   - Each guide needs:
     - **Photo**: `images/users/{guide.photo}`
     - **Name**: `guide.name`
     - **Role**: Either "Lead guide" or "Tour gui.
4. **Role Conditional**:
   - Pug's built-in conditionals are limited, so use JavaScript if statements:
     ```
     - if guide.role === 'lead-guide'
         Lead guide
     - else if guide.role === 'guide'
         Tour guide
     ```

---

## Description Box

1. **Dynamic Tour Name**:
   - Add the tour name dynamically using `tour.name`.
2. **Handling Descriptions**:
   - `tour.description` is a single string with paragraphs separated by newline characters (`\n`).
   - Split the string into an array:
     ```
     - const paragraphs = tour.description.split('\n'
     ```
   - Loop through the array to create a paragraph for each element:
     ```
     each paragraph in paragraphs
         p= paragrap
     ```

---

## Images Section

1. **Dynamic Image Rendering**:
   - Use a loop to render each image from `tour.images`.
   - Image source format: `images/tours/{image}`.
   - Add an **index** to distinguish between images using Pug's second loop variable:
     ```
     each image, i in tour.images
         img(src=`images/tours/${image}`, class=`image-${i + 1}`)
     ```
2. **Indentation Matters**:
   - Ensure proper nesting of elements (e.g., images inside their respective containers) for correct rendering.

---

## Reviews Section

1. **Populating Reviews**:
   - Reviews are stored in `tour.reviews` as an array.
   - Use Mongoose's `populate` method to retrieve related data (e.g., `user.name`, `user.photo`).
2. **Review Card Design**:
   - Create a **mixin** for the review card to simplify the template:
     ```
     mixin reviewCard(review)
         .review
             img(src=`images/users/${review.user.photo}`)
             .review-content
                 h4= review.user.name
                 p= review.review
     ```
   - Use the mixin in the loop:
