import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LastWillAndTestament = () => {
    const location = useLocation();
    const { firstName, dob, country, city, beneficiaries, spouseOrFatherName, lastName, gender, maritalStatus } = location.state || {};

    const [pdfUrl, setPdfUrl] = useState(null); // Store the PDF URL for the viewer

    // Function to generate and display the PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        const maxWidth = 190; // Max width for text
        let currentY = 10; // Initial Y position for text
        const pageHeight = doc.internal.pageSize.height; // Get page height

        // Function to add text and handle page breaks
        const addText = (text, yPosition) => {
            const lines = doc.splitTextToSize(text, maxWidth);
            let y = yPosition;

            // Loop through each line and add to PDF
            lines.forEach((line) => {
                if (y + 10 > pageHeight) {
                    doc.addPage(); // Add a new page if content exceeds current page height
                    y = 10; // Reset Y position for new page
                }
                doc.text(line, 14, y);
                y += 6; // Reduced space between lines to make it more compact
            });

            return y; // Return new Y position after adding the text
        };

        // Title
        doc.text(`LAST WILL AND TESTAMENT`, 14, currentY);
        currentY += 10;

        // Determine the relationship and adjust the introduction text
        let relationshipPhrase = '';
        
        if (spouseOrFatherName) {
            if (gender === 'Male') {
                relationshipPhrase = `son of ${spouseOrFatherName}`;
            } else if (gender === 'Female' && maritalStatus === 'married') {
                relationshipPhrase = `wife of ${spouseOrFatherName}`;
            }
        } else {
            relationshipPhrase = gender === 'Male' ? `son of ${spouseOrFatherName}` : 'wife of ' + spouseOrFatherName; // Default handling
        }

        // Add the introductory content
        currentY = addText(`I, ${firstName} , ${relationshipPhrase}, residing at ${city} in ${country}, born on ${dob}, being of sound mind and memory, hereby declare this to be my Last Will and Testament, revoking all previous Wills and Codicils made by me.`, currentY);
        currentY += 6;

        // Article I - Appointment of Administrator
        currentY = addText(`Article I: Appointment of Administrator`, currentY);
        currentY = addText(`I expressly choose not to appoint an Executor for my estate. Instead, I request that the court appoint an Administrator to oversee the administration of my estate in accordance with the provisions of this Will and applicable law.`, currentY);
        currentY += 6;

        // Article II - Distribution of Assets
        currentY = addText(`Article II: Distribution of Assets`, currentY);
        currentY = addText(`I direct that all my assets, both real and personal, tangible and intangible, be divided equally among the following beneficiaries:`, currentY);

        // Beneficiaries table
        const tableColumn = ["Beneficiary Name", "Relationship", "Address"];
        const tableRows = beneficiaries.map(ben => [
            ben.name || '[Beneficiary Name]',
            ben.relation || '[Relationship]',
            ben.address || '[Address]'
        ]);

        // Insert table with autoTable
        const tableStartY = currentY + 6;
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: tableStartY,
            theme: 'grid',
            didDrawCell: (data) => {
                if (data.cell.section === 'body' && data.cell.y + 10 > pageHeight) {
                    // If the table content exceeds the page, add a new page
                    doc.addPage();
                }
            }
        });

        currentY = doc.autoTable.previous.finalY + 6; // Update Y position after the table

        // Additional Articles
        const articles = [
            {
                title: `Article III: Payment of Debts and Expenses`,
                content: `I instruct that all my legally enforceable debts, funeral expenses, estate taxes, and administrative costs be settled from my estate before any distributions are made to the beneficiaries.`
            },
            {
                title: `Article IV: Residual Clause`,
                content: `If any beneficiary listed above predeceases me, their share shall be distributed equally among the surviving beneficiaries, unless otherwise directed by this Will.`
            },
            {
                title: `Article V: Death of Beneficiary`,
                content: `Should any beneficiary pass away before the execution of this Will, I direct that their legal heirs, as determined by applicable law, shall inherit the share intended for that beneficiary.`
            },
            {
                title: `Article VI: Guardian for Minor Beneficiaries`,
                content: `In the event that any beneficiary listed in this Will, or any beneficiary that becomes entitled to a share through Article V, is a minor at the time of my death, I nominate the legal guardian of that minor as the custodian of the minor’s inheritance.`
            }
        ];

        // Loop through articles and add them to the PDF
        articles.forEach(article => {
            currentY = addText(article.title, currentY);
            currentY = addText(article.content, currentY);
            currentY += 6; // Smaller space between sections
        });

        // Signature and Witnesses sections
        currentY = addText(`Signature:`, currentY);
        currentY = addText(`_________________________`, currentY);
        currentY = addText(`Full Name:`, currentY);
        currentY += 6;

        currentY = addText(`Witnesses:`, currentY);
        currentY = addText(`1. _________________________`, currentY);
        currentY = addText(`Name:`, currentY);
        currentY = addText(`Address:`, currentY);
        currentY = addText(`2. _________________________`, currentY);
        currentY = addText(`Name:`, currentY);
        currentY = addText(`Address:`, currentY);

        currentY += 10;
        currentY = addText(`Date of Will:`, currentY);
        currentY = addText(`This document was executed on the Day/Month/Year ______________`, currentY);

        // Generate PDF and convert it to URL for preview/display
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl); // Store PDF URL for display
    };

    // Generate the PDF immediately after receiving data
    useEffect(() => {
        if (firstName && dob && country && city && beneficiaries) {
            generatePDF(); // Generate the PDF, but do not download it automatically
        }
    }, [firstName, dob, country, city, beneficiaries]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'Last_Will_and_Testament.pdf';
        link.click();
    };

    return (
        <div>
            <h2>Your Last Will and Testament</h2>

            {/* Show the PDF directly in the iframe if it's available */}
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    title="Last Will and Testament PDF"
                ></iframe>
            )}

            {/* Button to download PDF */}
            <button onClick={handleDownload} style={{ marginTop: '20px' }}>
                Download PDF
            </button>
        </div>
    );
};

export default LastWillAndTestament;
