const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json()); //middleware

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from the server side',
//     app: 'Natours',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('posting');
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1; //Last object in array's ID +1
  const newTour = Object.assign({ id: newId }, req.body); //object.assign will combine two obj together.
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {}
  );
  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

//To start the server
const port = 3000;
app.listen(port, () => {
  console.log(`App runing on ${port}....`);
});
