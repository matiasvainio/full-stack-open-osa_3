const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.irl9e.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    id: process.argv[3],
    name: process.argv[4],
    number: process.argv[5],
});

if (person.name) {
    person.save().then((response) => {
        console.log(
            `added ${person.name} number ${person.number} to phonebook`
        );
        mongoose.connection.close();
    });
} else {
    console.log("Phonebook:");
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}
