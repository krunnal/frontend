import React, { useState, useEffect } from 'react';
import '../css/model.css'
import NomineeModal from './NomineeModel';

const Modal = ({
    modalVisible,
    setModalVisible,
    formData,
    handleChange,
    setFormData,
    assetType, // 'movable' or 'immovable'
    editAsset, // Asset to be edited (if any)
    setEditAsset, // To reset the editing state when done
    selectedAssetType,
    AddNomine
}) => {
    const [selectedNominee, setSelectedNominee] = useState("");
    const [percentage, setPercentage] = useState("");
    const [nomineeComment, setNomineeComment] = useState(""); // Comment for the nominee
    const [nomineeAdded, setNomineeAdded] = useState(false);
    const [totalPercentage, setTotalPercentage] = useState(0);
    const [remainingPercentage, setRemainingPercentage] = useState(0);  // Track remaining percentage
    const [nomineesWithDetails, setNomineesWithDetails] = useState([]); // Store nominees with their details
    const [errors, setErrors] = useState({}); // Object to store error messages
    const [showModal, setShowModal] = useState(false)

    // Reset nomineesWithDetails and remaining percentage when assetType changes
    useEffect(() => {
        if (editAsset) {
            setNomineesWithDetails(
                (editAsset.nominees || []).map((nominee, index) => ({
                    name: nominee,
                    percentage: editAsset.percentages ? editAsset.percentages[index] : 0,
                    comment: editAsset.comments ? editAsset.comments[index] : "",
                }))
            );
            const total = (editAsset.percentages || []).reduce((sum, perc) => sum + perc, 0);
            setTotalPercentage(total);
            setRemainingPercentage(100 - total); // Set remaining percentage
            const asset = editAsset.asset;
            // Set initial values for formData
            if (assetType === 'movable') {
                setFormData({
                    ...formData,
                    movableAssetType: asset.type,
                    movableAssetDescription: asset.description,
                    identyfyer: asset.Identifier,
                });
            } else if (assetType === 'immovable') {
                console.log(editAsset, "editAsset999999999999999999999999999")
                setFormData({
                    ...formData,
                    immovableAssetType: asset.type,
                    identyfyer: asset.Identyfyer,
                    immovableAssetDescription: asset.description,
                });
            }
        } else {
            // Clear form fields if no asset is being edited
            setFormData({
                ...formData,
                movableAssetType: "",
                movableAssetDescription: "",
                immovableAssetType: "",
                immovableAssetAddress: "",
                immovableAssetDescription: "",
            });
            setNomineesWithDetails([]);
            setTotalPercentage(0);
            setRemainingPercentage(100);
        }
    }, [editAsset, assetType]);

    const addNominee = (nominee) => {
        setFormData(prevData => ({
            ...prevData,
            nominees: [...prevData.nominees, nominee]
        }));
    };
    // Handle adding a new nominee
    const handleAddNominee = () => {
        // Validate the inputs
        const newErrors = {};

        if (!selectedNominee) {
            newErrors.selectedNominee = "Nominee is required.";
        }

        if (!percentage) {
            newErrors.percentage = "Percentage is required.";
        } else if (percentage < 0 || percentage > 100) {
            newErrors.percentage = "Percentage must be between 0 and 100.";
        }

        if (!nomineeComment) {
            newErrors.nomineeComment = "Nominee comment is required.";
        }


        // If there are any errors, stop the process and show the errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newNomineePercentage = parseFloat(percentage);
        const updatedTotalPercentage = totalPercentage + newNomineePercentage;

        if (updatedTotalPercentage > 100) {
            setErrors({ ...newErrors, percentage: "Total percentage cannot exceed 100." });
            return;
        }

        // Add the nominee details (name, percentage, comment) as an object in the nominees array
        setNomineesWithDetails((prev) => [
            ...prev,
            { name: selectedNominee, percentage: newNomineePercentage, comment: nomineeComment }
        ]);
        console.log(nomineesWithDetails, 'nomineesWithDetails------------')
        setSelectedNominee("");
        setPercentage("");
        setNomineeComment("");  // Clear the comment input field
        setTotalPercentage(updatedTotalPercentage);
        setNomineeAdded(true);
        setErrors({});  // Clear errors after successful addition
    };

    // Update remaining percentage whenever totalPercentage changes
    useEffect(() => {
        const remaining = 100 - totalPercentage;
        setRemainingPercentage(remaining);
    }, [totalPercentage]);

    // Function to truncate the comment after 2 words
    const truncateComment = (comment) => {
        const words = comment.split(" ");
        if (words.length > 2) {
            return `${words.slice(0, 4).join(" ")}...`;  // Only first two words + ellipsis
        } else {
            return comment;  // If less than 2 words, show the full comment
        }
    };

    // Handle saving the asset
    const handleSaveAsset = () => {
        // Validate the total percentage before saving
        const totalNomineePercentage = nomineesWithDetails.reduce((total, nominee) => total + nominee.percentage, 0);
        const remainingPercentage = 100 - totalNomineePercentage;



        if (totalNomineePercentage < 100) {
            setNomineesWithDetails((prev) => [
                ...prev,
                { name: "Residuary", percentage: remainingPercentage, comment: "Remaining Percentage" }
            ]);
        }
        // Validate asset type and description
        const newErrors = {};
        //  if (assetType === 'immovable') {

        //     if (!formData.identyfyer) {
        //         newErrors.identyfyer = "Identyfyer is required.";
        //     }
        // }

        // If any errors, show them and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Create new asset with nominees details
        const newAsset = assetType === 'movable'
            ? {
                id: generateUniqueId(),
                type: selectedAssetType,
                description: formData.movableAssetDescription,
                Identifyer: formData.identyfyer, // Include identifier for movable assets
                nominees: remainingPercentage > 0
                    ? [...nomineesWithDetails, { name: "Residuary", percentage: remainingPercentage, comment: "Remaining Percentage" }]
                    : nomineesWithDetails
                ,
            }
            : {
                id: generateUniqueId(),
                Identyfyer: formData.identyfyer,
                description: formData.immovableAssetDescription,
                type: selectedAssetType,
                nominees: remainingPercentage > 0
                    ? [...nomineesWithDetails, { name: "Residuary", percentage: remainingPercentage, comment: "Remaining Percentage" }]
                    : nomineesWithDetails
                ,
            };

        // Add new asset or update existing one in formData
        if (editAsset) {
            // For editing an existing asset
            setFormData((prevData) => ({
                ...prevData,
                [assetType + 'Assets']: prevData[assetType + 'Assets'].map((asset) =>
                    asset.id === editAsset.id ? newAsset : asset
                )
            }));
        } else {
            // For adding a new asset
            setFormData((prevData) => ({
                ...prevData,
                [assetType + 'Assets']: [...prevData[assetType + 'Assets'], newAsset]
            }));
        }

        // Close the modal and reset edit state (for new asset, reset form fields)
        setModalVisible(false);
        setEditAsset(null);

        // Clear the form fields if adding a new asset
        if (!editAsset) {
            setSelectedNominee("");
            setPercentage("");
            setNomineeComment("");
            setNomineesWithDetails([]);
            setTotalPercentage(0);
            setRemainingPercentage(100); // Reset to 100 when starting with a new asset

            // Clear immovable and movable specific fields after saving
            setFormData((prevData) => ({
                ...prevData,
                movableAssetType: "",
                movableAssetDescription: "",
                identyfyer: "",// Clear movable asset type
                immovableAssetDescription: "", // Clear movable asset description
                immovableAssetAddress: "",  // Clear immovable asset address
                immovableAssetType: "", // Clear immovable asset type
            }));
        }
    };


    const generateUniqueId = () => {
        return `asset-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    if (!modalVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">



                {/* Conditional Rendering for Movable vs Immovable Asset */}
                {assetType === 'immovable' ? (
                    <ImmovableAssetForm
                        formData={formData}
                        handleChange={handleChange}
                        selectedNominee={selectedNominee}
                        setSelectedNominee={setSelectedNominee}
                        percentage={percentage}
                        setPercentage={setPercentage}
                        nomineeComment={nomineeComment}  // Pass nominee comment
                        setNomineeComment={setNomineeComment}  // Setter for nominee comment
                        nomineesWithDetails={nomineesWithDetails}
                        setNomineesWithDetails={setNomineesWithDetails}
                        totalPercentage={totalPercentage}
                        remainingPercentage={remainingPercentage}  // Pass remaining percentage here
                        handleAddNominee={handleAddNominee}
                        handleSaveAsset={handleSaveAsset}
                        nomineeAdded={nomineeAdded}
                        selectedAssetType={selectedAssetType}
                        errors={errors}  // Pass errors object
                        handleClose={() => setModalVisible(false)}
                        AddNomine={AddNomine}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        addNominee={addNominee}
                        truncateComment={truncateComment}
                    />
                ) : null}
            </div>
        </div>
    );
};

const ImmovableAssetForm = ({
    formData,
    handleChange,
    selectedNominee,
    setSelectedNominee,
    percentage,
    setPercentage,
    selectedAssetType,
    nomineeComment,
    setNomineeComment,
    nomineesWithDetails,
    setNomineesWithDetails,
    totalPercentage,
    remainingPercentage,
    handleAddNominee,
    handleSaveAsset,
    nomineeAdded,
    errors,
    handleClose,
    AddNomine,
    showModal,
    setShowModal,
    addNominee,
    truncateComment
}) => (

    <div className="asset-wrapper">
        {/* Left Side: Form */}

        <div className="asset-form">
            <div className='combination'>{nomineeAdded ? "Edit Immovable Asset" : "Add Immovable Asset"}</div>

            <label>Asset Type:</label>
            <input
                type="text"
                name="immovableAssetType"
                value={selectedAssetType}
                onChange={handleChange}
            />

            <label>Identifier:</label>
            <input
                type="text"
                name="identyfyer"
                value={formData.identyfyer}
                onChange={handleChange}
                required
            />
            {errors.identyfyer && <p className="error">{errors.identyfyer}</p>}

            <label>Asset Description:</label>
            <textarea
                className="large-textarea"
                name="immovableAssetDescription"
                value={formData.immovableAssetDescription}
                onChange={handleChange}
                placeholder="Enter the description of the asset"
                rows="2" // Number of visible rows
                cols="40" // Number of visible columns
                required
            ></textarea>
            {errors.immovableAssetDescription && <p className="error">{errors.immovableAssetDescription}</p>}

            <div className="nominee-percentage-wrapper">
                <div className="nominee-percentage-row">
                    <div className="nominee-selector">
                        <label>Nominees:</label>
                        <select
                            value={selectedNominee}
                            onChange={(e) => {
                                const selectedValue = e.target.value;

                                if (!formData.immovableAssets || !Array.isArray(formData.immovableAssets)) {
                                    console.error("Immovable assets data is missing or not an array.");
                                    return;
                                }

                                // Validate that the nominee hasn't already been assigned to the same asset type
                                const isAlreadySelectedForType = formData.immovableAssets.some((asset) =>
                                    asset.type === selectedAssetType && // Match the current asset type
                                    asset.nominees && Array.isArray(asset.nominees) &&
                                    asset.nominees.some((nominee) => nominee.name === selectedValue)
                                );

                                if (selectedValue === "add-nominee") {
                                    setShowModal(true); // Open modal for adding a new nominee
                                } else if (isAlreadySelectedForType) {
                                    alert(
                                        `${selectedValue} has already been assigned to the ${selectedAssetType} asset type. Please select a different nominee.`
                                    );
                                } else {
                                    setSelectedNominee(selectedValue); // Set the selected nominee
                                }
                            }}
                        >

                            <option value="" disabled>
                                Select Person
                            </option>
                            {formData.nominees.map((nominee, index) => (
                                <option key={index} value={nominee.name}>
                                    {nominee.name}
                                </option>
                            ))}
                            <option value="add-nominee">Add Nominee</option> {/* Add Nominee option */}
                        </select>

                        {errors.selectedNominee && <p className="error">{errors.selectedNominee}</p>}
                    </div>


                    <div className="percentage-input">
                        <label>Percentage:</label>
                        <input
                            type="number"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            min="0"
                            max="100"
                            required
                        />
                        {errors.percentage && <p className="error">{errors.percentage}</p>}
                    </div>
                </div>

            </div>

            <label>Comment:</label>
            <textarea
                className="large-textarea"
                value={nomineeComment}
                onChange={(e) => setNomineeComment(e.target.value)}
                placeholder="Enter comment for the nominee"
                rows="2" // Number of visible rows
                cols="40" // Number of visible columns
                required
            ></textarea>
            {errors.nomineeComment && <p className="error">{errors.nomineeComment}</p>}



            <div className="remaining-percentage">
                <strong>Remaining Percentage is added in Residuary. {remainingPercentage}% </strong>
            </div>

            <button type="button" className="btn btn-red" onClick={handleClose}>
                Close
            </button>
            <button
                type="button"
                className={`btn ${nomineeAdded ? "btn-green" : "btn-primary"}`}
                onClick={handleAddNominee}
            >
                {nomineeAdded ? "Add another nominee" : "Add Nominee"}
            </button>
            <button type="button" className="btn btn-yellow" onClick={handleSaveAsset}>
                Add Asset
            </button>

        </div>

        {/* Right Side: Table */}
        <div className="asset-table">
            <div className='combination'>Table</div>
            {nomineesWithDetails.length > 0 ? (
                <table className="nominee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="percentage-column">Percentage</th>
                            <th className="comment-column">Comment</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nomineesWithDetails.map((nominee, index) => (
                            <tr key={index}>
                                <td>{nominee.name}</td>
                                <td className="percentage-column">{nominee.percentage}%</td>
                                <td className="comment-column">
                                    {truncateComment(nominee.comment)}
                                </td>
                                <td className="actions-column">
                                    <button>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No nominees added yet.</p>
            )}
        </div>

        {
            showModal && (
                <NomineeModal onClose={() => setShowModal(false)} onSave={addNominee} />
            )
        }
    </div >

);



export default Modal;
