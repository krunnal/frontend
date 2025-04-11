// src/Pages/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/documents">Documents</Link></li>
                <li><Link to="#">My Profile</Link></li>
                <li><Link to="/billing">Billing</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
