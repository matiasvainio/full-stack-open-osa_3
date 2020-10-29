import React from "react";

const Filter = (props) => {
    const handleFilter = props.onChange;
    return (
        <div>
            filter shown with:
            <input onChange={handleFilter} />
        </div>
    );
};

export default Filter;
