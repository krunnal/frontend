// src/SurveysList.js
import React from 'react';

const SurveysList = ({ surveys }) => {
    return (
        <div className="documents-list">
            {surveys.map((survey, index) => (
                <div className="document-item" key={index}>
                    <div className="document-details">
                        <div className="info">
                            <h3>{survey.title}</h3>
                            <span className="sub-info">In My Surveys · Last Modified {survey.date}</span>
                        </div>
                    </div>
                    <div className="document-progress">
                        <span>{survey.progress}</span>
                        <button className="menu-button">&bull;&bull;&bull;</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SurveysList;
