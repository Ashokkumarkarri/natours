here we are trying to solve a business problem.
we want to analyze the data, how many tours are there per month
postman:http://localhost:8000/api/v1/tours/monthly-plan/2021

---

# Aggregation Pipeline for getMonthlyPlan

This aggregation pipeline is designed to group tours based on their start dates within a specific year and to retrieve the number of tours for each month.

## Pipeline Steps:

1. **Unwind $startDates:**

   - The `$unwind` stage deconstructs the `startDates` array and returns one document for each element in the array.

2. **Match startDates between the given year:**

   - The `$match` stage filters the tours to ensure that the selected tours have start dates that fall within the specified year (e.g., 2021).

3. **Group by month:**

   - The `$group` stage uses `$month` to extract the month from `startDates` and groups the documents by this value. It also counts the number of tours starting in each month and collects the names of the tours for that month.

4. **Add month field:**

   - The `$addFields` stage creates a new field `month` that stores the value of the grouped month.

5. **Project output:**

   - The `$project` stage excludes the `_id` field and allows the other fields to be returned in the result.

6. **Sort by number of tour starts:**

   - The `$sort` stage orders the results by the number of tours starting in descending order.

7. **Limit the number of results:**
   - The `$limit` stage restricts the result to 12 documents, which should provide the data for the 12 months of the year.

```js
exports.getMonthlyPlan = async (req, res) => {
try {
const year = req.params.year \* 1; //2021 we get year year from user
const plan = await Tour.aggregate([
{
$unwind: '$startDates', //If a tour document has an array of startDates, applying $unwind will produce separate documents for each date.
},
{
$match: {
startDates: {
$gte: new Date(`${year}-01-01`),
$lte: new Date(`${year}-12-31`),
},
},
},
{
$group: {
_id: { $month: '$startDates' },
numToursStarts: { $sum: 1 }, //how many tours
tours: { $push: '$name' }, //which tours
},
},
{
$addFields: { month: '$_id' },
},
{
$project: {
_id: 0,
},
},
{ $sort: { numToursStarts: -1 } },
{
$limit: 12, // how many you want to see
},
]);

    res.status(200).json({
      status: 'Success',
      data: {
        plan: plan,
      },
    });

} catch (err) {
res.status(400).json({
status: 'fail',
message: err,
});
}
};
```

```json
{
  "status": "Success",
  "data": {
    "plan": [
      {
        "numToursStarts": 3,
        "tours": ["The Forest Hiker", "The Sports Lover", "The Sea Explorer"],
        "month": 7
      },
      {
        "numToursStarts": 2,
        "tours": ["The Sports Lover", "The Wine Taster"],
        "month": 9
      },
      {
        "numToursStarts": 2,
        "tours": ["The City Wanderer", "The Sea Explorer"],
        "month": 6
      },
      {
        "numToursStarts": 2,
        "tours": ["The Forest Hiker", "The Star Gazer"],
        "month": 10
      }
    ]
  }
}
```
