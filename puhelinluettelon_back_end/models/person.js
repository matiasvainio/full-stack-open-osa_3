const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, unique: true, minlength: 3 },
  number: { type: String, minlength: 8 },
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (document, object) => {
    const returnableObject = object;
    // eslint-disable-next-line no-underscore-dangle
    returnableObject.id = object._id.toString();
    // eslint-disable-next-line no-underscore-dangle
    delete returnableObject._id;
    // eslint-disable-next-line no-underscore-dangle
    delete returnableObject.__v;
    return returnableObject;
  },
});

module.exports = mongoose.model('Person', personSchema);
