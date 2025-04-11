import React from "react";
import '../css/confirm.css'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    return isOpen ? (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal-content">
                <h2 className="confirmation-modal-header">Confirm Action</h2>
                <p className="confirmation-modal-message">{message}</p>
                <div className="confirmation-modal-actions">
                    <button
                        onClick={onConfirm}
                        className="confirmation-modal-confirm-button"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onClose}
                        className="confirmation-modal-cancel-button"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default ConfirmationModal;
