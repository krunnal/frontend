import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/FreeWill.css";
import translations from './translation';

const countries = [
    "United States", "Canada", "India", "Australia", "Germany", "France", "Brazil", "China", "Japan", "Russia",
    "United Kingdom", "Italy", "Mexico", "South Korea", "Spain", "Saudi Arabia", "South Africa", "Argentina",
    "Nigeria", "Egypt", "Indonesia", "Pakistan", "Bangladesh", "Thailand", "Vietnam", "Malaysia", "Philippines"
    // Add more countries as needed
];

const FreeWillForm = () => {
    const [formData, setFormData] = useState({
        action: "freewellsubmit",
        country: '',
        language: 'English',
        firstName: '',
        city: '',
        dob: '',
        address: '', // New address field
        gender: '',  // New gender field
        maritalStatus: '', // Marital status
        spouseOrFatherName: '', // Dynamic field
        beneficiaries: [{ name: '', address: '', relation: '' }] // Initialize with one beneficiary
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e, index = null) => {
        const { name, value } = e.target;

        if (index !== null) {
            // Update the specific beneficiary's data
            const updatedBeneficiaries = [...formData.beneficiaries];
            updatedBeneficiaries[index] = {
                ...updatedBeneficiaries[index],
                [name]: value
            };

            // Update the formData state with the modified beneficiaries array
            setFormData({ ...formData, beneficiaries: updatedBeneficiaries });
        } else {
            // Update regular form fields
            setFormData({ ...formData, [name]: value });
        }

        setErrors({ ...errors, [name]: '' }); // Clear the error for the current field
    };

    const addBeneficiary = () => {
        setFormData({
            ...formData,
            beneficiaries: [...formData.beneficiaries, { name: '', address: '', relation: '' }] // Add new beneficiary
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.country) newErrors.country = 'Country name is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.dob) newErrors.dob = 'Date of Birth is required';
        if (!formData.address) newErrors.address = 'Address is required';  // Address validation
        if (!formData.gender) newErrors.gender = 'Gender is required';  // Gender validation
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required'; // Marital status validation

        // Validate beneficiaries
        formData.beneficiaries.forEach((beneficiary, idx) => {
            if (!beneficiary.name) newErrors[`beneficiaryName${idx}`] = 'Beneficiary name is required';
            if (!beneficiary.address) newErrors[`beneficiaryAddress${idx}`] = 'Address is required';
            if (!beneficiary.relation) newErrors[`beneficiaryRelation${idx}`] = 'Relation is required';
        });

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            // Navigate to GeneratePDF page and pass form data
            navigate("/genratepdf", { state: formData });
        }
    };

    const currentTranslations = translations[formData.language] || translations["English"];

    return (


        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* Language and Country Fields */}
                <div className='header'>


                    <div className='form-section' id="section1">
                        <div className="dropdown">

                            <div className='header1'>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>{currentTranslations.language}:</label>
                                        <select name="language" value={formData.language} onChange={handleChange} required>
                                            <option value="" disabled>Select a language</option>
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Marathi">Marathi</option>
                                        </select>

                                    </div>
                                    <div className="input-group">
                                        <label>{currentTranslations.country}:</label>
                                        <select name="country" value={formData.country} onChange={handleChange} required>
                                            <option value="" disabled>Select a country</option>
                                            {countries.map((country, index) => (
                                                <option key={index} value={country}>{country}</option>
                                            ))}
                                        </select>
                                        {errors.country && <span className="error">{errors.country}</span>}

                                    </div>
                                </div>
                                {/* Date of Birth */}
                                <div className="input-group">
                                    <label>{currentTranslations.fullName}:  </label>
                                    <input type="text" name="firstName" placeholder="Full Name" value={formData.firstName} onChange={handleChange} />
                                    {errors.firstName && <p className="error">{errors.firstName}</p>}

                                </div>


                                {/* Full Name */}
                                <div className='input-row'>
                                    <div className="input-group">
                                        <label>{currentTranslations.dob}: </label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                        />
                                        {errors.dob && <div className="error">{errors.dob}</div>}

                                    </div>
                                    {/* City */}
                                    <div className="input-group">
                                        <label>{currentTranslations.city}:</label>
                                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                                        {errors.city && <div className="error">{errors.city}</div>}

                                    </div>
                                </div>
                                {/* Address */}
                                <div className="input-group">
                                    <label>{currentTranslations.address}: </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Your Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                    {errors.address && <div className="error">{errors.address}</div>}

                                </div>

                                {/* Gender Selection */}
                                <div className="input-group">
                                    <label>{currentTranslations.gender}: </label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && <div className="error">{errors.gender}</div>}

                                </div>
                                {/* Marital Status */}
                                <div className="input-group">
                                    <div className="form-section" id="section2">
                                        <label>{currentTranslations.maritalStatus}:</label>

                                        {/* Marital Status Radio Buttons */}
                                        <div className="radio-group">
                                            <label
                                                className={`marital-status-box ${formData.maritalStatus === 'single' ? 'selected' : ''}`}
                                            > {currentTranslations.single}

                                                <input
                                                    type="radio"
                                                    name="maritalStatus"
                                                    value="single"
                                                    onChange={handleChange}
                                                    checked={formData.maritalStatus === 'single'}
                                                />

                                            </label>
                                            <label
                                                className={`marital-status-box ${formData.maritalStatus === 'married' ? 'selected' : ''}`}
                                            >{currentTranslations.married}
                                                <input
                                                    type="radio"
                                                    name="maritalStatus"
                                                    value="married"
                                                    onChange={handleChange}
                                                    checked={formData.maritalStatus === 'married'}
                                                    required
                                                />
                                            </label>


                                            <label
                                                className={`marital-status-box ${formData.maritalStatus === 'divorced' ? 'selected' : ''}`}
                                            >{currentTranslations.divorced}
                                                <input
                                                    type="radio"
                                                    name="maritalStatus"
                                                    value="divorced"
                                                    onChange={handleChange}
                                                    checked={formData.maritalStatus === 'divorced'}
                                                    required
                                                />
                                            </label>
                                        </div>

                                        {/* Error Handling for Marital Status */}
                                        {errors.maritalStatus && <span className="error">{errors.maritalStatus}</span>}

                                        {/* Conditional Name Input Based on Gender and Marital Status */}
                                        {formData.gender === 'Male' || (formData.gender === 'Female' && formData.maritalStatus !== 'single') ? (
                                            <label>
                                                {formData.gender === 'Male'
                                                    ? currentTranslations.enterFatherName
                                                    : currentTranslations.enterSpouseName}
                                                :
                                                <input
                                                    type="text"
                                                    name="spouseOrFatherName"
                                                    value={formData.spouseOrFatherName}
                                                    onChange={handleChange}
                                                />
                                                {errors.spouseOrFatherName && <span className="error">{errors.spouseOrFatherName}</span>}
                                            </label>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Beneficiaries Section */}

                                <div className="beneficiary-group">
                                    <label>Beneficiaries:</label>
                                    {formData.beneficiaries.map((beneficiary, index) => (
                                        <div key={index} className="beneficiary-row">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Beneficiary Name"
                                                    value={beneficiary.name}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    placeholder="Address"
                                                    value={beneficiary.address}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="relation"
                                                    placeholder="Relation"
                                                    value={beneficiary.relation}
                                                    onChange={(e) => handleChange(e, index)}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                </div>

                                <div className="button-containe">
                                    <button
                                        type="button"
                                        onClick={addBeneficiary}
                                        className="add-beneficiary-btn"
                                    >
                                        Add Beneficiary
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        Submit
                                    </button>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </form >
        </div >


    );
};

export default FreeWillForm;
