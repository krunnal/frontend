import React from "react";
import '../css/notificationmodal.css'
const NotificationModal = ({ isOpen, onClose, message }) => {
    return isOpen ? (
        <div className="notification-modal-overlay">
            <div className="notification-modal-content">
                <p className="notification-modal-message">{message}</p>
                <button onClick={onClose} className="notification-modal-close-button">
                    OK
                </button>
            </div>
        </div>
    ) : null;
};

export default NotificationModal;
