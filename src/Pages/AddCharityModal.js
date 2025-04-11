import React, { useState } from 'react';

const AddCharityModal = ({ isOpen, onClose, onAddCharity }) => {
  const [charityData, setCharityData] = useState({
    nonprofitName: '',
    ein: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCharityData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onAddCharity(charityData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add a Beneficiary (Charity)</h2>
        <label>
          Nonprofit Name*
          <input
            type="text"
            name="nonprofitName"
            value={charityData.nonprofitName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          EIN (if known)
          <input
            type="text"
            name="ein"
            value={charityData.ein}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Address (Street 1)*
          <input
            type="text"
            name="street1"
            value={charityData.street1}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Address (Street 2)
          <input
            type="text"
            name="street2"
            value={charityData.street2}
            onChange={handleInputChange}
          />
        </label>
        <label>
          City*
          <input
            type="text"
            name="city"
            value={charityData.city}
            onChange={handleInputChange}
          />
        </label>
        <label>
          State*
          <input
            type="text"
            name="state"
            value={charityData.state}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Zip Code*
          <input
            type="text"
            name="zipCode"
            value={charityData.zipCode}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Leave a message to the nonprofit
          <textarea
            name="message"
            value={charityData.message}
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

export default AddCharityModal;
