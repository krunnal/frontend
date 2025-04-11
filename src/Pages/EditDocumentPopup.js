// src/Pages/EditDocumentPopup.js
import React, { useState } from 'react';
import '../css/document.css'; // Adjust if necessary

const EditDocumentPopup = ({ document, onClose, onSave }) => {
    const [formData, setFormData] = useState(document);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Call the save function passed as a prop
        onClose(); // Close the popup
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Edit Document</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Document Type:
                        <input type="text" name="type" value={formData.type} onChange={handleChange} required />
                    </label>
                    <label>
                        Status:
                        <select name="status" value={formData.status} onChange={handleChange} required>
                            <option value={0}>In Progress</option>
                            <option value={1}>Complete</option>
                        </select>
                    </label>
                    <label>
                        Date:
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </label>
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </label>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditDocumentPopup;
