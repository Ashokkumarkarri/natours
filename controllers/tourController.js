const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    requestedAt: req.requestTime,
    // data: {
    //   tours: tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1; //we are converting the str to int
  // const tour = tours.find((el) => el.id === id); //returns true or false

  // res.status(200).json({
  //   status: 'success',
  //   result: tours.length,
  //   data: {
  //     tour: tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {
    // const newTour=new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour is here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
