import React from "react";

const Person = (props) => {
    const persons = props.persons;
    const deletePerson = props.deletePerson;
    return (
        <ul>
            {persons.map((person, i) => {
                return (
                    <li key={i}>
                        {person.name} {person.number}{" "}
                        <button onClick={() => deletePerson(person)}>
                            delete
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default Person;
