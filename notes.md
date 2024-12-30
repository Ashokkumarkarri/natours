## 025 Geospatial Queries\_ Finding Tours Within Radius

We are building an Route using that we can get tours when are in certain radius or distance.

**Explanation:**

1. **Route Definition:**
   - Define a route in `tourRouter.js` for `GET /tours-within/:distance/:center/:unit`.
   - This route will handle requests for tours within a specified distance of a given center point.
2. **Controller Function:**
   - Extract parameters from the request in `tourController.js`.
   - Validate the `latlng` parameter to ensure it's in the correct format (latitude, longitude).
   - Calculate the radius in radians based on the distance and unit.
   - Use the `$geoWithin` operator with `$centerSphere` to query for tours within the specified radius.
   - Send the results as a JSON response.
3. **Model Definition:**
   - Define the `startLocation` field in the `tourSchema` as a GeoJSON Point.
   - Create a 2dsphere index on the `startLocation` field to optimize geospatial queries.

**Key Points:**

- **Geospatial Indexing:** The 2dsphere index is crucial for efficient geospatial queries.
- **$geoWithin Operator:** This operator is used to find documents within a specific geometric shape.
- **$centerSphere:** This subdocument defines a sphere using its center coordinates and radius.
- **Radius Calculation:** The radius is calculated in radians by dividing the distance by the Earth's radius.
- **Error Handling:** Proper error handling is included to catch invalid inputs and handle potential issues.

This implementation provides a basic framework for performing geospatial queries to find tours within a certain distance of a given location.

---

### **Code Explanation**

### **Controller Function: `getToursWithin`**

This function retrieves tours within a certain distance from a given geographical point.

1. **Parameter Extraction**:

   ```jsx
   const { distance, latlng, unit } = req.params;
   const [lat, lng] = latlng.split(',');
   ```

   - Extracts `distance`, `latlng` (latitude and longitude), and `unit` (e.g., `mi` or `km`) from the request parameters.
   - Splits `latlng` into latitude (`lat`) and longitude (`lng`).

2. **Radius Calculation**:

   ```jsx
   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
   ```

   - MongoDB requires the radius in radians for geospatial queries.
   - Converts `distance` into radians using the Earth's radius:
     - **3963.2** miles (for `mi` unit).
     - **6378.1** kilometers (for `km` unit).

3. **Validation**:

   ```jsx
   if (!lat || !lng) {
     next(
       new AppError(
         'Please provide latitude and longitude in the format lat,lng',
         400,
       ),
     );
   }
   ```

   - Checks if both `lat` and `lng` are provided.
   - Throws an error if the format is incorrect.

4. **Geospatial Query**:

   ```jsx
   const tours = await Tour.find({
     startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
   });
   ```

   - Uses MongoDB's `$geoWithin` operator with `$centerSphere` to find tours:
     - `$centerSphere` takes a center point (`[lng, lat]`) and a radius in radians.
     - Searches for tours with `startLocation` within the defined sphere.

5. **Response**:

   ```jsx
   res.status(200).json({
     status: 'Success',
     results: tours.length,
     data: {
       data: tours,
     },
   });
   ```

   - Sends a JSON response with:
     - Status (`Success`).
     - Number of matching tours (`results`).
     - The tour data (`data`).

---

### **Schema Index**

```jsx
tourSchema.index({ startLocation: '2dsphere' });
```

- Adds a **2dsphere index** to the `startLocation` field in the `tourSchema`.
- Optimizes geospatial queries for points stored in GeoJSON format.

---

### **Route Definition**

```jsx
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
```

- Defines the route `/tours-within/:distance/center/:latlng/unit/:unit` in `tourRouter.js`.
- Maps the `GET` request to the `getToursWithin` function in `tourController.js`.

---

### **Key Concepts**

- **Geospatial Queries**:
  - `$geoWithin` and `$centerSphere` enable MongoDB to find documents based on geographical coordinates.
- **Validation**:
  - Ensures the input is correct (e.g., lat/lng format).
- **Radius Conversion**:
  - Converts distance to radians to match MongoDB's requirements.
- **Indexing**:
  - A `2dsphere` index on `startLocation` speeds up queries.

---

This is a step-by-step breakdown of how the code works to handle geospatial queries in MongoDB using Node.js.
