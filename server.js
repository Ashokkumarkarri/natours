const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

//-------------------------------------------------------------------------------------------------------------

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.1,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a Price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
//name of the model  , schema
//allways use upper case ofr model names and varible.
// thats why I had used Captial T for the varible so that we will get to know that we are dealing with mode.

//-------------------------------------------------------------------------------------------------------------
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App runing on ${port}....`);
});
