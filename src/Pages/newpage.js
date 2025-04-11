import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const PDFUpload = () => {
  // State to store form data
  const [formName, setFormName] = useState('SampleForm');
  const [randNum, setRandNum] = useState('12345'); // Can be generated or provided
  const [pdfContent, setPdfContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(100); // Example balance, replace with actual user balance

  // Function to generate PDF content and convert to Base64
  const generatePdfContent = () => {
    const doc = new jsPDF();
    doc.text('Hello, this is a generated PDF!', 10, 10);
    const pdfBase64 = doc.output('datauristring');  // Generate Base64 string of the PDF
    setPdfContent(pdfBase64);
  };

  // Function to handle form submission (upload PDF)
  const handleSavePdfRequest = async () => {
    if (!pdfContent) {
      setErrorMessage('Please generate the PDF first.');
      return;
    }

    if (balance < 20) {
      const rechargeNeeded = 20 - balance;
      setErrorMessage(`Insufficient balance. You need 20 units, but you have ${balance}. Please recharge ${rechargeNeeded} units.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    // Get the token from sessionStorage
    const authToken = sessionStorage.getItem('jwtToken');
    if (!authToken) {
      setErrorMessage('Authentication token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    const payload = {
      pdf_content: pdfContent,
       action: 'savepdf',
       product_id:'None'
    };

    try {
      const response = await fetch(
        'https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', // Replace with actual API URL
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Add token from sessionStorage
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success) {
        setBalance(data.balance);  // Update the balance
        setPdfLink(data.pdfLink);  // Set the PDF link from response
      } else {
        setErrorMessage(data.message);  // Show the message if failure
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while processing the request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>PDF Upload and Balance Check</h1>

      {/* Form to take user inputs */}
      <div>
        <label>
          Form Name:
          <input 
            type="text" 
            value={formName} 
            onChange={(e) => setFormName(e.target.value)} 
          />
        </label>
      </div>

      <div>
        <label>
          Random Number (Rand Num):
          <input 
            type="text" 
            value={randNum} 
            onChange={(e) => setRandNum(e.target.value)} 
          />
        </label>
      </div>

      <div>
        <button onClick={generatePdfContent}>
          Generate PDF Content
        </button>
      </div>

      {/* Display generated PDF content as Base64 */}
      <div>
        <strong>PDF Content (Base64):</strong>
        <textarea value={pdfContent} readOnly rows="5" cols="60" />
      </div>

      <div>
        <strong>Current Balance:</strong> {balance} units
      </div>

      {/* Error message */}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {/* Button to upload the PDF */}
      <div>
        <button onClick={handleSavePdfRequest} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>

      {/* Display PDF link if successful */}
      {pdfLink && (
        <div>
          <strong>PDF Uploaded Successfully! </strong>
          <a href={pdfLink} target="_blank" rel="noopener noreferrer">Click here to view the PDF</a>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
