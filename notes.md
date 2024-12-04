### 004 Modelling Locations (Geospatial Data)

### 1. **What is Geospatial Data?**

- Geospatial data is information that represents **locations, lines, and shapes** on Earth using **longitude and latitude coordinates**.
- This data can describe:
  - **Points**: Specific locations (e.g., a tour start point).
  - **Lines**: Paths or routes (e.g., a hiking trail).
  - **Polygons**: Areas or boundaries (e.g., a park).

### 2. **MongoDB's Support for Geospatial Data**

- MongoDB **natively supports geospatial data**, making it easier to store and query geographical locations.
- Geospatial data is represented using **GeoJSON** (Geographical JSON format), which is a widely accepted standard.

### 3. **Using Geospatial Data in a Schema**

- To include geospatial data in your MongoDB documents, you need to define fields that follow the **GeoJSON specification**.
- **Example Schema** for a tour application:

### **Start Location**

This represents the **starting point** of the tour:

```jsx
startLocation: {
  type: {
    type: String,          // Mandatory field to define the geometry type
    default: 'Point',      // Default is 'Point' for single locations
    enum: ['Point'],       // Only 'Point' is allowed
  },
  coordinates: [Number],   // Array of numbers [longitude, latitude]
  address: String,         // Custom field for the address of the location
  description: String,     // Custom field to describe the location
}
```

- **Key Fields Explained**:
  - `type`: A string that specifies the type of geometry.
    - Allowed values: `'Point'`, `'LineString'`, `'Polygon'`.
    - Default: `'Point'`.
  - `coordinates`: An array of two numbers representing `[longitude, latitude]`.
  - `address`: Optional field to store the address.
  - `description`: Optional field to add details about the location.

### **Other Locations (Stops During the Tour)**

An array is used to represent multiple locations (e.g., stops during the tour):

```jsx
locations: [
  {
    type: {
      type: String,
      default: 'Point', // Single points for each stop
      enum: ['Point'], // Only 'Point' is allowed
    },
    coordinates: [Number], // [longitude, latitude]
    address: String, // Address of the stop
    description: String, // Description of the stop
    day: Number, // Day of the tour for this location
  },
];
```

- **Key Difference from `startLocation`**:
  - The `locations` field is an **array of objects** to represent multiple stops.
  - Each object has an additional field, `day`, which indicates the day of the tour for that stop.

### 4. **Understanding GeoJSON**

GeoJSON requires specific properties for storing geospatial data:

1. **type**:
   - Indicates the type of geometry.
   - Common types:
     - `'Point'`: Single location.
     - `'LineString'`: A path with multiple coordinates.
     - `'Polygon'`: A boundary defined by multiple coordinates.
2. **coordinates**:
   - An array of `[longitude, latitude]` values.
   - Example for a point: `[77.209, 28.6139]` (Longitude, Latitude of Delhi, India).

### 5. **Why Use Arrays for Locations?**

- Arrays allow embedding **multiple location objects** within a document.
- Each object in the array can have:
  - A specific `type` and `coordinates`.
  - Custom fields like `address`, `description`, and `day`.

This structure helps in storing and querying detailed data for each stop.

### 6. **Key Points to Remember**

- MongoDB supports **geospatial data out of the box**.
- Geospatial data is used to represent **locations, routes, and areas**.
- **GeoJSON Requirements**:
  - `type`: Specifies the geometry type (e.g., `'Point'`).
  - `coordinates`: Specifies `[longitude, latitude]`.
- **Additional Fields**:
  - You can add custom fields like `address`, `description`, and `day` for enhanced functionality.

### 7. **Practical Example of a Document**

```json
{
  "name": "Amazing Tour",
  "startLocation": {
    "type": "Point",
    "coordinates": [77.209, 28.6139],
    "address": "Delhi, India",
    "description": "Starting point of the tour"
  },
  "locations": [
    {
      "type": "Point",
      "coordinates": [77.412, 28.686],
      "address": "Stop 1",
      "description": "First stop of the tour",
      "day": 1
    },
    {
      "type": "Point",
      "coordinates": [78.032, 27.175],
      "address": "Taj Mahal, Agra",
      "description": "Second stop of the tour",
      "day": 2
    }
  ]
}
```

### 8. **Advantages of Using Geospatial Data in MongoDB**

- Simplifies **location-based queries** (e.g., finding nearby places).
- Enables **complex geospatial operations** like calculating distances and intersections.
- Provides **native support** for geospatial indexes and queries.

With this setup, you can effectively use MongoDB for applications that require geospatial functionality, such as maps, travel apps, and logistics systems.
