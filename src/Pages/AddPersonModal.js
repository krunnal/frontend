import React, { useState } from 'react';

const AddPersonModal = ({ isOpen, onClose, onAddPerson }) => {
  const [personData, setPersonData] = useState({
    name: '',
    relationship: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onAddPerson(personData);
    onClose();
  };

  if (!isOpen) return null; // If the modal isn't open, don't render it

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add a Beneficiary (Person)</h2>
        <label>
          Full Legal Name*
          <input
            type="text"
            name="name"
            value={personData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Relationship to You*
          <input
            type="text"
            name="relationship"
            value={personData.relationship}
            onChange={handleInputChange}
          />
        </label>
        <div className="modal-buttons">
          <button type="button" onClick={handleSubmit}>Add</button>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;
