import React from "react";

const PersonForm = (props) => {
    const { name, number, personChange, numberChange } = props;
    return (
        <div>
            <div>
                name:
                <input value={name} onChange={personChange} />
            </div>
            <div>
                number:
                <input value={number} onChange={numberChange} />
            </div>
        </div>
    );
};

export default PersonForm;
