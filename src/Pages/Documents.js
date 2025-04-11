import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/document.css'; // Import the CSS file
import axios from 'axios';
import ConfirmationModal from '../Pages/confirmationModel'
import NotificationModal from '../Pages/notificationModal'
const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [pendingDeleteDocs, setPendingDeleteDocs] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [showDeletedItems, setShowDeletedItems] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [docToProcess, setDocToProcess] = useState(null);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [notificationMessage, setNotificationMessage] = React.useState("");
    const navigate = useNavigate();

    // Fetch documents and check the response format (Base64 or JSON)
    const fetchDocuments = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        setLoading(true);
        const eventData = { action: 'getDocuments',product_id:'None',subaction :'Documents' }

        try {
            const response = await fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            const rawResponse = await response.text(); // Read raw response text

            // Try parsing as JSON
            const data = JSON.parse(rawResponse); // Will throw an error if not valid JSON

            console.log("Documents fetched successfully:", data);


            // Separate documents based on the `pendingDelete` value
            const pendingDeleteDocs = data.documents.filter(doc => doc.pendingDelete?.BOOL === true);
            const regularDocs = data.documents.filter(doc => doc.pendingDelete?.BOOL !== true);
            console.log("Documents fetched successfully:", regularDocs);
            console.log("Documents fetched successfully pending", pendingDeleteDocs)
            // Save the filtered data into separate states
            setDocuments(regularDocs); // Documents without pendingDelete as true
            setPendingDeleteDocs(pendingDeleteDocs); // Documents with pendingDelete as true
        } catch (error) {
            console.error("Error fetching documents:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);
    const handleModalClose = () => {
        setModalOpen(false); // Close the modal without action
    };

    const handleEditClick = (doc) => {
        try {
            const formData = JSON.parse(doc.FormData.S || '{}'); // Safely parse FormData

            const randNum = formData.rand_num || '';
            sessionStorage.setItem('randNum', randNum);

            navigate('/submit/1', { state: { prefillData: formData } });
        } catch (error) {
            console.error('Error parsing FormData:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update search term state
    };

    const filteredDocuments = documents.filter((doc) => {
        console.log(doc, 'doc------------------');
        const itemType = doc.ItemType?.S || '';
        const generatedAt = doc.GeneratedAt?.S || '';
        const documentType = doc.DocumentType?.S || '';
        let formName = '';
        let documentName = '';

        try {
            const formData = doc.FormData ? JSON.parse(doc.FormData.S) : {};
            formName = formData.form_name || '';
            documentName = formData.documentName || '';
        } catch (error) {
            console.error('Error parsing FormData for filtering:', error);
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
            itemType.toLowerCase().includes(lowerCaseSearchTerm) ||
            generatedAt.includes(searchTerm) ||
            formName.toLowerCase().includes(lowerCaseSearchTerm) ||
            documentName.toLowerCase().includes(lowerCaseSearchTerm) ||
            documentType.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    const filteredPendingDeleteDocs = pendingDeleteDocs.filter((doc) => {
        console.log(doc, 'doc------------------');
        const itemType = doc.ItemType?.S || '';
        const generatedAt = doc.GeneratedAt?.S || '';
        const documentType = doc.DocumentType?.S || '';
        let formName = '';
        let documentName = '';

        try {
            const formData = doc.FormData ? JSON.parse(doc.FormData.S) : {};
            formName = formData.form_name || '';
            documentName = formData.documentName || '';
        } catch (error) {
            console.error('Error parsing FormData for filtering:', error);
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
            itemType.toLowerCase().includes(lowerCaseSearchTerm) ||
            generatedAt.includes(searchTerm) ||
            formName.toLowerCase().includes(lowerCaseSearchTerm) ||
            documentName.toLowerCase().includes(lowerCaseSearchTerm) ||
            documentType.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });




    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Extract just the date part
    };

    const handlePage = () => {
        navigate('/');
    };

    const handleSave = (updatedDocument) => {
        setDocuments((prevDocuments) =>
            prevDocuments.map((doc) => (doc.id === updatedDocument.id ? updatedDocument : doc))
        );
    };
    const handleCheckboxChange = (itemType) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(itemType)
                ? prevSelected.filter((type) => type !== itemType) // Remove if already selected
                : [...prevSelected, itemType] // Add if not selected
        );
    };
    const handleBulkDelete = async () => {
        if (isButtonClicked) return; // Prevent multiple clicks

        if (selectedItems.length === 0) {
            alert("No items selected for deletion!");
            return;
        }

        setIsButtonClicked(true);

        try {
            // Pass the array of selected item types to the delete handler
            await handleDeleteClick(selectedItems);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsButtonClicked(false); // Re-enable the button after the operation
        }
    };
    // Handle the "Return PDF" functionality
    const handleReturnPDF = async (doc) => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const eventData = {
            action: 'returnpdf',
            ItemType: doc.ItemType.S,  // Pass document ItemType
            FileName: doc.FileName.S,
            product_id:'None'  // Pass the document FileName
        };

        try {
            const response = await fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`Error fetching PDF: ${response.status}`);
            }

            const data = await response.json();

            // Check if PDF link is returned
            if (data.success && data.pdfLink) {
                // Open PDF in a new tab
                window.open(data.pdfLink, '_blank');
            } else {
                console.error('Error: No PDF link returned');
            }
        } catch (error) {
            console.error("Error fetching PDF:", error.message);
        }
    };
    const handleShowDeletedItems = () => {
        setShowDeletedItems(true); // Show only the documents that are marked for pending delete
    };
    const handleBackToDocuments = () => {
        setShowDeletedItems(false); // Show regular documents again
    };

    const handleDeleteClick = (doc) => {
        const itemTypes = doc.map((item) => item.ItemType?.S);

        if (itemTypes.length === 0) {
            alert("No items selected for deletion.");
            return;
        }

        setModalMessage(
            `Are you sure you want to ${showDeletedItems ? "restore" : "delete"
            } the following items?}`
        );
        setDocToProcess(doc);
        setModalOpen(true);
    };

    const processItems = async () => {
        setModalOpen(false);
        if (!docToProcess || docToProcess.length === 0) {
            console.error("No items to process.");
            return;
        }

        const itemTypes = docToProcess.map((item) => item.ItemType?.S);
        const jwtToken = sessionStorage.getItem("jwtToken");

        const eventData = {
            action: "deleteitem",
            item_types: itemTypes,
            product_id:'abc'
        };

        try {
            const response = await fetch(
                "https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(eventData),
                }
            );

            if (!response.ok) {
                throw new Error(`Error processing items: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                if (showDeletedItems) {
                    setNotificationMessage(`Items restored successfully`);
                    setNotificationOpen(true);
                    setDocuments((prevDocuments) => {
                        const restoredDocs = docToProcess.filter(
                            (newDoc) =>
                                !prevDocuments.some(
                                    (existingDoc) =>
                                        existingDoc.ItemType?.S === newDoc.ItemType?.S
                                )
                        );
                        return [...prevDocuments, ...restoredDocs];
                    });

                    setPendingDeleteDocs((prevPendingDocs) =>
                        prevPendingDocs.filter(
                            (docToRestore) =>
                                !docToProcess.some(
                                    (restoredDoc) =>
                                        restoredDoc.ItemType?.S === docToRestore.ItemType?.S
                                )
                        )
                    );
                } else {
                    setNotificationMessage(`Items deleted successfully`);
                    setNotificationOpen(true);
                    setPendingDeleteDocs((prevDocs) => [...prevDocs, ...docToProcess]);

                    setDocuments((prevDocuments) =>
                        prevDocuments.filter(
                            (document) =>
                                !docToProcess.some(
                                    (deletedDoc) =>
                                        deletedDoc.ItemType?.S === document.ItemType?.S
                                )
                        )
                    );
                }
                setSelectedItems([]);
            } else {
                console.error("Failed to process items:", data);
            }
        } catch (error) {
            console.error("Error processing items:", error.message);
        } finally {
            setModalOpen(false);
            setDocToProcess(null);
        }
    };
    return (
        <div>
            <h2>Documents</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search....."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </div>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <h1>Fetching data....</h1>
                </div>
            ) : (showDeletedItems ? filteredPendingDeleteDocs.length === 0 : filteredDocuments.length === 0) ? (
                <div className="no-documents">
                    <h3>No documents found.....</h3>
                    <button onClick={handlePage}>Home page</button>
                </div>
            ) : (
                <div>
                    <div className="button-cont">
                        <button
                            className="delete-selected"
                            onClick={handleBulkDelete}
                            disabled={isButtonClicked || selectedItems.length === 0}
                        >
                            <span className="icon">🗑️</span> {showDeletedItems ? 'Restore Selected' : 'Delete Selected'}
                        </button>
                        {!showDeletedItems ? (
                            <button
                                className="returnpdf"
                                onClick={handleShowDeletedItems}
                            >
                                <span className="icon">🗑️</span> Deleted Items
                            </button>
                        ) : (
                            <button
                                className="returnpdf"
                                onClick={handleBackToDocuments}
                                disabled={!showDeletedItems}
                            >
                                Back to Documents
                            </button>
                        )}
                    </div>


                    <table className="documents-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const allItemTypes = (showDeletedItems ? filteredPendingDeleteDocs : filteredDocuments).map(
                                                    (doc) => doc || "N/A"
                                                );
                                                setSelectedItems(allItemTypes);
                                            } else {
                                                setSelectedItems([]);
                                            }
                                        }}
                                        checked={
                                            selectedItems.length === (showDeletedItems ? filteredPendingDeleteDocs.length : filteredDocuments.length) &&
                                            (showDeletedItems ? filteredPendingDeleteDocs.length : filteredDocuments.length) > 0
                                        }
                                    />
                                </th>
                                <th>Document Type</th>
                                <th>Date</th>
                                <th>Document Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(showDeletedItems ? filteredPendingDeleteDocs : filteredDocuments).map((doc, index) => {
                                const itemType = doc.ItemType ? doc.ItemType.S : "N/A";
                                const generatedAt = doc.GeneratedAt ? formatDate(doc.GeneratedAt.S) : "N/A";
                                const formData = doc.FormData ? JSON.parse(doc.FormData.S) : { documentName: "N/A" };
                                const documentStatus = doc.DocumentStatus ? doc.DocumentStatus.S : "N/A";

                                return (
                                    <tr key={itemType + index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(doc)}
                                                onChange={() => handleCheckboxChange(doc)}
                                            />
                                        </td>
                                        <td>{itemType}</td>
                                        <td>{generatedAt}</td>
                                        <td>{formData.documentName}</td>
                                        <td>
                                            <div className="action-buttons">
                                                {documentStatus === "0" ? (
                                                    <>{showDeletedItems ? <button className="deleteButton" onClick={() => handleDeleteClick([doc])}>
                                                        Restore
                                                    </button> : <> <button className="edit" onClick={() => handleEditClick(doc)}>
                                                        Edit
                                                    </button>
                                                        <button className="deleteButton" onClick={() => handleDeleteClick([doc])}>
                                                            Delete
                                                        </button></>}

                                                    </>
                                                ) : (
                                                    <>{showDeletedItems ? <button className="deleteButton" onClick={() => handleDeleteClick([doc])}>
                                                        Restore
                                                    </button> : <><button className="returnpdf" onClick={() => handleReturnPDF(doc)}>
                                                        Return PDF
                                                    </button>
                                                        <button className="deleteButton" onClick={() => handleDeleteClick([doc])}>
                                                            Delete
                                                        </button> </>}

                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={processItems}
                message={modalMessage}
            />
            <NotificationModal
            isOpen={notificationOpen}
            onClose={() => setNotificationOpen(false)}
            message={notificationMessage}
        />
        </div>

    );
};

export default Documents;
