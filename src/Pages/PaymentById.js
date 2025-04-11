import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Invoice = () => {
    const location = useLocation(); // Hook to get passed state
    const { orderData } = location.state || {}; // Destructure order data passed via navigate

    const [invoiceName, setInvoiceName] = useState('');
    const [state, setState] = useState('');
    const [showInvoice, setShowInvoice] = useState(false); // Flag to show invoice content

    const handleStateChange = (e) => {
        setState(e.target.value);
    };

    const handleInvoiceNameChange = (e) => {
        setInvoiceName(e.target.value);
    };

    const handleGenerateInvoice = () => {
        // Ensure that orderData is available
        if (!orderData) {
            alert("No order data available");
            return;
        }

        // Calculate GST based on the selected state
        let gstRate = 0;
        if (state === 'Maharashtra') {
            gstRate = 0.09; // 9% GST for Maharashtra
        } else if (state) {
            gstRate = 0.18; // 18% GST for other states
        }

        // Calculate the taxes based on the GST rate
        const Amount = orderData.Amount; // Total amount
        const cgst = ((Amount * gstRate) / 2).toFixed(2); // CGST
        const sgst = ((Amount * gstRate) / 2).toFixed(2); // SGST
        const subtotal = Amount; // Subtotal equals the amount
        const total = (parseFloat(subtotal) + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

        // Set the state and show the invoice
        setShowInvoice(true);
    };

    const generatePDF = () => {
        const Amount = orderData.Amount; // Total amount

        // Ensure the required variables are defined
        let subtotal = Amount;
        let cgst = ((Amount * 0.09) / 2).toFixed(2); // Default CGST for Maharashtra (9%)
        let sgst = ((Amount * 0.09) / 2).toFixed(2); // Default SGST for Maharashtra (9%)
        let total = (parseFloat(subtotal) + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

        // If the state is not Maharashtra, use 18% GST instead
        if (state !== 'Maharashtra' && state) {
            cgst = ((Amount * 0.18) / 2).toFixed(2); // 18% GST for other states
            sgst = ((Amount * 0.18) / 2).toFixed(2); // 18% GST for other states
            total = (parseFloat(subtotal) + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);
        }

        const doc = new jsPDF();

        // Set basic font and size
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        // Title and Header
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 51, 102);
        doc.text('INVOICE', 105, 20, null, null, 'center');

        // GSTN, PAN, SAC details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 51, 102);
        doc.text(`GSTN: 27AJCPG8343B1ZK | PAN: AJCPG8343B | SAC: 998313`, 105, 30, null, null, 'center');
        
        // Border Line after PAN info
        doc.setDrawColor(0); 
        doc.setLineWidth(0.5); 
        doc.line(20, 40, 190, 40); 
        
        // Right Address Block
        const address = [
            ['Six Steps'],
            ['Plot-46B, Flat 2 Varad Apt'],
            ['Rambaug Colony, Kothrud'],
            ['Pune, Maharashtra 411038'],
            ['India'],
        ];
    
        doc.autoTable({
            head: [['Invoice Address']],
            body: address,
            startY: 45,
            margin: { left: 120 },
            styles: { fontSize: 12, cellPadding: 3, font: 'helvetica', textColor: [0, 51, 102] },
        });

        let currentY = doc.lastAutoTable.finalY + 10;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 51, 102);

        // Left aligned BILL TO section
        doc.text('BILL TO:', 20, currentY);
        currentY += 10;
        doc.text(invoiceName, 20, currentY); // Dynamic name based on user input
        currentY += 10;

        // Right aligned invoice details
        doc.text(`Invoice Number: ${orderData.PaymentId}`, 120, currentY);
        currentY += 10;
        doc.text(`Invoice Date: ${new Date(orderData.PaymentCompletedTime).toLocaleDateString()}`, 120, currentY);
        currentY += 10;
        doc.text(`Payment Due: ${new Date(orderData.PaymentCompletedTime).toLocaleDateString()}`, 120, currentY);
        currentY += 10;

        // Apply a larger font size for the amount due
        doc.setFontSize(14);
        doc.text(`Amount Due (${orderData.Currency}): ${Amount}`, 120, currentY);
        currentY += 20;

        // Table for service description
        doc.autoTable({
            head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
            body: [
                ['WillForm Service - MH', '1', `${Amount}`, `${Amount}`]
            ],
            startY: currentY,
            styles: { fontSize: 12, cellPadding: 3, font: 'helvetica', textColor: [50, 50, 50] },
            headStyles: { fillColor: [135, 206, 235], textColor: [255, 255, 255] },
            columnStyles: { 
                3: { halign: 'right' } 
            }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // Add taxes, subtotal, and total
        doc.setTextColor(0, 102, 204);
        doc.setFontSize(12);
        doc.text(`Subtotal: ${subtotal}`, 145, currentY);
        currentY += 10;
        doc.text(`CGST ${state === 'Maharashtra' ? '9%' : '18%'}: ${cgst}`, 145, currentY);
        currentY += 10;
        doc.text(`SGST ${state === 'Maharashtra' ? '9%' : '18%'}: ${sgst}`, 145, currentY);
        currentY += 10;
        doc.text(`Total: ₹${total}`, 145, currentY);
        currentY += 10;
        doc.text(`Amount Due (INR): ${total}`, 145, currentY);

        // Add Notes/Terms
        currentY += 20;
        doc.setTextColor(50, 50, 50);
        doc.text('Notes / Terms:', 20, currentY);
        currentY += 10;

        const notes = 'Thank you for your business. Please make the payment by the due date. If you have any questions, feel free to contact us.';
        doc.text(notes, 20, currentY, { maxWidth: 170, lineHeightFactor: 1.5 });

        // Save the PDF
        doc.save('invoice.pdf');
    };

    return (
        <div className="invoice-container" style={{
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
            marginTop: '50px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
        }}>

            {/* Input Fields for Invoice Name and State */}
            {!showInvoice && (
                <div>
                    <div>
                        <label htmlFor="invoiceName">Invoice Name:</label>
                        <input
                            type="text"
                            id="invoiceName"
                            value={invoiceName}
                            onChange={handleInvoiceNameChange}
                            placeholder="Enter Invoice Name"
                        />
                    </div>

                    <div>
                        <label htmlFor="state">State:</label>
                        <select id="state" value={state} onChange={handleStateChange}>
                            <option value="">Select State</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button onClick={handleGenerateInvoice} style={{
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                            Generate Invoice
                        </button>
                    </div>
                </div>
            )}

            {/* Invoice Content and PDF Download Button */}
            {showInvoice && (
                <div>
                    {/* Invoice Header */}
                    <div className="header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h2>INVOICE</h2>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>GSTN: 27AJCPG8343B1ZK | PAN: AJCPG8343B | SAC: 998313</p>
                    </div>

                    {/* Line after the header */}
                    <div style={{ borderTop: '1px solid black', marginBottom: '20px' }}></div>

                    {/* Right Address Block */}
                    <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 'bold' }}>
                        <div>Six Steps</div>
                        <div>Plot-46B, Flat 2 Varad Apt</div>
                        <div>Rambaug Colony, Kothrud</div>
                        <div>Pune, Maharashtra 411038</div>
                        <div>India</div>
                    </div>

                    {/* Invoice Details */}
                    <div className="invoice-details" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p><strong>BILL TO</strong></p>
                                <p>{invoiceName}</p>
                            </div>

                            <div>
                                <p><strong>Invoice Number:</strong> {orderData.PaymentId}</p>
                                <p><strong>Invoice Date:</strong> {new Date(orderData.PaymentCompletedTime).toLocaleDateString()}</p>
                                <p><strong>Payment Due:</strong> {new Date(orderData.PaymentCompletedTime).toLocaleDateString()}</p>
                                <p><strong>Amount Due ({orderData.Currency}):</strong> ₹{orderData.Amount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Service List */}
                    <div className="service-list" style={{ marginBottom: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#87CEEB' }}>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Quantity</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Unit Price</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px' }}>Render Service - MH</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>1</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>₹{orderData.Amount}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>₹{orderData.Amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Download Invoice Button */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button onClick={generatePDF} style={{
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                            Download Invoice PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoice;
