const express = require("express");
const app = express();

const persons = [
    {
        name: "Arto Hellas",
        number: "050-123456789",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2,
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4,
    },
];

app.get("/api/persons", (require, response) => {
    response.json(persons);
});

app.get("/info", (require, response) => {
    const returnString = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`;
    response.send(returnString);
});

app.get("/api/persons/:id", (require, response) => {
    const id = Number(require.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

const port = 3001;
app.listen(port);
console.log(`server running on port ${port}`);
