const express = require('express');
const morgan = require('morgan');

const app = express();
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('temp', (req, res) => JSON.stringify(req.body, res.body));

app.use(
  morgan((tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    tokens.temp(req, res),
  ].join(' ')),
);

const persons = [];

app.get('/info', (request, response) => {
  Person.countDocuments({}, (err, count) => {
    const returnString = `<p>Phonebook has info for ${count} people</p>
    <p>${new Date().toString()}</p>`;
    response.send(returnString);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((returnedPersons) => {
    response.json(returnedPersons.map((person) => person.toJSON()));
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    id: request.params.id,
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      console.log(updatedPerson);
      response.json(updatedPerson.toJSON());
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;
  const name = persons.find((person) => person.name === body.name);

  console.log(request);

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  } if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  } if (name) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const generateRandom = () => Math.floor(Math.random() * 10000) + 1000;

  const person = new Person({
    id: generateRandom(),
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      console.log(savedPerson);
      response.json(savedPerson.toJSON());
    })
    .catch((error) => next(error));

  return 0;
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).send(error.message);
  }

  next(error);

  return 0;
};

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
