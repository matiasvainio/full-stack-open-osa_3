const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

morgan.token("temp", (req, res) => {
    return JSON.stringify(req.body, res.body);
});

app.use(
    morgan((tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
            tokens.temp(req, res),
        ].join(" ");
    })
);

let persons = [
    //     {
    //         name: "Arto Hellas",
    //         number: "050-123456789",
    //         id: 1,
    //     },
    //     {
    //         name: "Ada Lovelace",
    //         number: "39-44-5323523",
    //         id: 2,
    //     },
    //     {
    //         id: 3,
    //         name: "Dan Abramov",
    //         number: "12-43-234345",
    //     },
    //     {
    //         name: "Mary Poppendieck",
    //         number: "39-23-6423122",
    //         id: 4,
    //     },
];

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons.map((person) => person.toJSON()));
    });
});

app.get("/info", (request, response) => {
    const returnString = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`;
    response.send(returnString);
});

app.get("/api/persons/:id", (request, response) => {
    // const id = Number(request.params.id);
    // const person = persons.find((person) => person.id === id);

    // if (person) {
    //     response.json(person);
    // } else {
    //     response.status(404).end();
    // }
    Person.findById(request.params.id).then((person) => {
        response.json(person);
    });
});

app.delete("/api/persons/:id", (request, response) => {
    // const id = Number(request.params.id);
    // persons = persons.filter((person) => person.id !== id);
    Person.findById(request.params.id).then((person) => {
        response.status(204).end();
    });
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    const name = persons.find((person) => person.name === body.name);

    if (!body.name) {
        return response.status(400).json({
            error: "name missing",
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing",
        });
    } else if (name) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }

    const person = new Person({
        id: generateRandom(),
        name: body.name,
        number: body.number,
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
});

const generateRandom = () => {
    return Math.floor(Math.random() * 10000) + 1000;
};

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
