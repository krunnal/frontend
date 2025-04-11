import React, { useState } from 'react';
import '../css/nominee.css'; // Ensure your CSS file is included

const NomineeModal = ({ onClose, onSave }) => {
    const [nominee, setNominee] = useState({
        name: '',
        age: '',
        relation: '',
        customRelation: '' // Add a separate field for custom relation input
    });
    const [errors, setErrors] = useState({}); // State for error messages

    // Handle input change
    console.log("hello")
    const handleChange = (e) => {
        const { name, value } = e.target;

        // If the user selects "Other", clear the customRelation field and allow typing
        if (name === "relation" && value !== "Other") {
            setNominee(prev => ({ ...prev, [name]: value, customRelation: '' })); // Reset customRelation when not "Other"
        } else {
            setNominee(prev => ({ ...prev, [name]: value }));
        }

        // Clear error for the current field when the user types
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validate form fields
    const validateFields = () => {
        const newErrors = {};
        if (!nominee.name) newErrors.name = "Name is required.";
        if (!nominee.age) newErrors.age = "Age is required.";
        if (!nominee.relation) newErrors.relation = "Relation is required.";
        if (nominee.relation === "Other" && !nominee.customRelation) {
            newErrors.customRelation = "Custom relation is required.";
        }
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = () => {
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop submission if there are errors
        }

        // If "Other" is selected, save the custom relation
        const finalNominee = nominee.relation === "Other" ? { ...nominee, relation: nominee.customRelation } : nominee;

        onSave(finalNominee);
        setNominee({ name: '', age: '', relation: '', customRelation: '' }); // Reset fields after saving
        onClose(); // Close modal after saving
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add Nominee</h2>

                <label>
                    Full Name:
                    <input
                        type="text"
                        name="name"
                        value={nominee.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={nominee.age}
                        onChange={handleChange}
                    />
                    {errors.age && <span className="error">{errors.age}</span>}
                </label>

                <label>
                    Relation:
                    <select
                        name="relation"
                        value={nominee.relation}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Relation</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                        <option value="Sister">Sister</option>
                        <option value="Brother">Brother</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.relation && <span className="error">{errors.relation}</span>}
                </label>

                {/* Conditionally render the custom relation input field when "Other" is selected */}
                {nominee.relation === 'Other' && (
                    <label>
                        Custom Relation:
                        <input
                            type="text"
                            name="customRelation"
                            value={nominee.customRelation}
                            onChange={handleChange}
                            placeholder="Enter your custom relation"
                        />
                        {errors.customRelation && <span className="error">{errors.customRelation}</span>}
                    </label>
                )}

                
                <button onClick={onClose} className='cancel-button'>Cancel</button>
                <button onClick={handleSubmit} className='save-nominee1'>Save Nominee</button>
            </div>
        </div>
    );
};

export default NomineeModal;
