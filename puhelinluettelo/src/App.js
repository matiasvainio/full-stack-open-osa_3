import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import "./app.css";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [number, setNumber] = useState("");
    const [addedMessage, setAddedMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        personService.getAll().then((returnedPersons) => {
            setPersons(returnedPersons);
        });
    }, []);

    const addName = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            number: number,
        };

        const alreadyOnList = persons.find((o) => o.name === newName);

        if (!alreadyOnList) {
            const createPerson = async () => {
                const a = await personService
                    .create(personObject)
                    .then((returnedPerson) => {
                        return returnedPerson;
                    })
                    .catch((error) => {
                        return error.response;
                    });

                return a;
            };

            const addPerson = async () => {
                const a = await createPerson();
                if (a.status !== 400) {
                    setPersons(persons.concat(a));
                    setAddedMessage(
                        `${personObject.name} was added to numbers`
                    );
                    setTimeout(() => {
                        setAddedMessage(null);
                    }, 2000);
                    setNewName("");
                    setNumber("");
                } else {
                    setErrorMessage(a.request.response);
                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 2000);
                }
            };

            addPerson();
        } else {
            if (
                window.confirm(
                    `${personObject.name} is already on the list, replace the old number with a new one?`
                )
            ) {
                updatePerson(alreadyOnList.id, personObject);
                setNewName("");
                setNumber("");
            }
        }
    };

    const handlePersonChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNumber(event.target.value);
    };

    const handleFilter = (event) => {
        setPersons(filterPersons(persons, event.target.value));
    };

    const filterPersons = (persons, f) => {
        return persons.filter((person) => person.name.includes(f));
    };

    const deletePerson = (person) => {
        if (window.confirm(`delete ${person.name}?`)) {
            personService.remove(person.id).then(() => {
                personService.getAll().then((returnedPersons) => {
                    setPersons(returnedPersons);
                });
            });
        }
        return;
    };

    const updatePerson = (id, person) => {
        console.log(person);
        personService.update(id, person).then((returnedPerson) => {
            setPersons(
                persons.map((person) =>
                    person.id !== id ? person : returnedPerson
                )
            );
        });
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={errorMessage} type="fail" />
            <h2>Search</h2>
            <Filter onChange={handleFilter} />
            <form onSubmit={addName}>
                <div>
                    <h2>Add a new</h2>
                    <PersonForm
                        name={newName}
                        number={number}
                        personChange={handlePersonChange}
                        numberChange={handleNumberChange}
                    />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <Notification message={addedMessage} type="success" />
            <h2>Numbers</h2>
            <Person persons={persons} deletePerson={deletePerson} />
        </div>
    );
};

const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }

    if (type === "fail") {
        return <div className="fail">{message}</div>;
    } else {
        return <div className="success">{message}</div>;
    }
};

export default App;
