## 026 Geospatial Aggregation\_ Calculating Distances

This route will help you **calculate the distance** from a given point (latitude and longitude) to all the tours stored in your database, using **geospatial aggregation**.

### What the route does:

1. **Calculate Distance**: It calculates the distance from the specified latitude and longitude (the user's location) to all tours in the database using the `geoNear` stage in the aggregation pipeline.
2. **Returns Tours with Distances**: It returns a list of tours along with the calculated distances, which are converted to kilometers (or miles based on the unit parameter).

### Geospatial Aggregation to Calculate Distances

1. **Overview**:
   - In this lecture, we will calculate distances to all the tours from a certain point using geospatial aggregation.
2. **Setting Up the Route**:
   - Define a new route `router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);`
   - The route will take two parameters: `latlng` (latitude and longitude) and `unit` (for distance measurement unit).
3. **Handling Parameters**:
   - Extract `latlng` and `unit` from `req.params`.
   - Split the `latlng` into latitude and longitude values.
   - Check if both latitude and longitude are provided; if not, return an error.
4. **Geospatial Aggregation**:
   - Use the `Tour.aggregate()` method to start the aggregation pipeline.
   - The key geospatial aggregation stage is `$geoNear`.
     - This stage must always be the **first stage** in the pipeline.
     - The `near` field specifies the reference point from which distances will be calculated.
     - The `distanceField` specifies the name of the field that stores the calculated distances (e.g., `distance`).
     - The `distanceMultiplier` is used to convert the distance into the desired unit (kilometers or miles).
5. **Handling Multiple Fields**:
   - If multiple geospatial fields exist in the collection, use the `keys` parameter to specify which field should be used for the distance calculation.
   - In this case, the `startLocation` field is used, which already has a 2dsphere geospatial index.
6. **Using GeoJSON Format**:
   - The `near` field requires the coordinates to be in GeoJSON format: `{ type: 'Point', coordinates: [lng, lat] }`.
   - Convert the latitude and longitude into numbers by multiplying by 1.
7. **Final Aggregation Pipeline**:
   - Use `$geoNear` for calculating distances.
   - After calculating the distance, use `$project` to show only the relevant fields (distance and name of the tour).
8. **Distance Unit Conversion**:
   - Convert the distance to kilometers by dividing by 1000.
   - If the unit is miles (`unit === 'mi'`), multiply the distance by `0.000621371` to convert meters to miles.
   - You can apply this conversion using the `distanceMultiplier` field in the `$geoNear` stage.
9. **Middleware Considerations**:
   - If using aggregation middleware (e.g., adding a `match` stage), make sure the `geoNear` stage is the first one.
   - To avoid errors, either modify the middleware or remove it.
10. **Final Response**:

- Return the distances and names of the tours in the response:`res.status(200).json({ status: 'Success', data: { data: distance } });`

---

### Code Example:

```js
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const distance = await Tour.aggregate([
    {
      //geoNear should be the first stage in the pipeline
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      //to show only the fields that we want to see
      $project: {
        //names of the fields that we want to see
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      data: distance,
    },
  });
});
```
