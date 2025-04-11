import React, { useState } from 'react';

const PDFViewer = () => {
    const [pdf, setPdf] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const objectURL = URL.createObjectURL(file);
            setPdf(objectURL);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
            />
            {pdf && (
                <iframe
                    src={pdf}
                    width="100%"
                    height="500px"
                    title="PDF Viewer"
                />
            )}
        </div>
    );
};

export default PDFViewer;



