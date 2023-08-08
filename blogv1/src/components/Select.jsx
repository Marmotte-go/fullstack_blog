import React, { useState } from "react";
import "./Select.scss";

const Select = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="select-container">
      <fieldset>
        <legend>{label}</legend>
        <div className="select-dropdown" onClick={() => setIsOpen(!isOpen)}>
          {value || "Select an option"}
          {isOpen && (
            <div className="select-options">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="select-option"
                  onClick={() => handleSelect(option.name)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
};

export default Select;
