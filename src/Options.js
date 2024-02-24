import React from "react";

const Options = ({ choices = [], onSelect }) => {
  return (
    <div>
      {choices.map(d => (
        <button
          onClick={() => {
            onSelect(d);
          }}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
};

export default Options;
