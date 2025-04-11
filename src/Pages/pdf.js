// import { useLocation } from 'react-router-dom';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import { useState, useEffect, useMemo } from 'react';
// import { Worker, Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';


// const PdfDisplayPage = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [pdfLink, setPdfLink] = useState(null);

//     const location = useLocation();
//     const randumnumber = location.state?.yourPrefillData;

//     // Always call hooks at the top level
    

//     // Display an error message for missing randumnumber
//     if (!randumnumber) {
//         return <p>Error: Invalid navigation state. Please go back and try again.</p>;
//     }

//     const fetchPdfLink = async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             const jwtToken = sessionStorage.getItem('jwtToken');
//             if (!jwtToken) throw new Error('JWT Token is missing.');

//             const eventData = {
//                 action: 'returnpdf',
//                 ItemType: `Testament_will:${randumnumber}`,
//             };

//             const response = await fetch(
//                 'https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization',
//                 {
//                     method: 'POST',
//                     headers: {
//                         Authorization: `Bearer ${jwtToken}`,
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(eventData),
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error(`Error fetching PDF: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.success && data.pdfLink) {
                
//                 setPdfLink(data.pdfLink);
//                 console.log('Cleaned PDF Link:', data.pdfLink);
//             } else {
//                 setError('Error: No PDF link returned.');
//             }
//         } catch (error) {
//             setError(`Error fetching PDF: ${error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <button onClick={fetchPdfLink} disabled={loading}>
//                 {loading ? 'Loading PDF...' : 'Generate PDF'}
//             </button>

//             {error && <p style={{ color: 'red' }}>{error}</p>}

//             {pdfLink ? (
//                 <div>
//                     <button onClick={() => window.open(pdfLink, '_blank')} style={{ marginTop: '20px' }}>
//                         Download PDF
//                     </button>
//                 </div>
//             ) : (
//                 <p>No PDF available yet. Please generate one first.</p>
//             )}
//         </div>
//     );
// };

// export default PdfDisplayPage;
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const PdfFetcher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfLink, setPdfLink] = useState(null);
  const location = useLocation();
    const randamnumber = location.state?.prefillData

  const fetchPdfLink = async () => {
    setLoading(true);
    setError(null);

    try {
      const jwtToken = sessionStorage.getItem('jwtToken');
      if (!jwtToken) throw new Error('JWT Token is missing.');

      const eventData = {
        action: 'returnpdf',
        ItemType: `Testament_will:${randamnumber}`, // using random number
        product_id:'abcd'
      };

      const response = await fetch(
        'https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        }
      );
console.log(response,"response---------------------")
      if (!response.ok) {
        throw new Error(`Error fetching PDF: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.pdfLink) {
        setPdfLink(data.pdfLink);
        console.log('Cleaned PDF Link:', data.pdfLink);
        
      } else {
        setError('Error: No PDF link returned.');
      }
    } catch (error) {
      setError(`Error fetching PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to open the PDF link in a new window


  return (
    <div>
      <button onClick={fetchPdfLink} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch PDF'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pdfLink && !error && (
        <div>
          <p>PDF Link fetched successfully. You can open it in a new window.</p>
        </div>
      )}
    </div>
  );
};

export default PdfFetcher;



// import React, { useState } from 'react';
// import React, { useState, useEffect } from 'react';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// const PDFViewer = () => {
//     const [pdfUrl, setPdfUrl] = useState('https://output-bucket299.s3.amazonaws.com/34385438-a091-7021-e264-2e535e8ef53c/uploaded-pdfs/Document_20250108_060300_178562.pdf?AWSAccessKeyId=ASIAQ7IJZI7EJGGXUD5O&Signature=hdZhgEfw11Y5s59muimZhtF4rgE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEIb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIDxogZYU0lwUeLJauKAPITgaNSzwQnA90eiAVKBmliY3AiAq3ZyEmninRJbEy3NbkOQkCBG9BEA%2FxrGTiGTLWhMgFyrqAghvEAQaDDA2NzEyOTM5NTE0NCIMiIbAQWXREFoaqieSKscCNPZHGPC04ZuM6HnpM6YBBn95RbmWotgCMT4w33vghl3%2FRZjWBeK0sctjqFCnfldpIPbewv3yrfiKYwkBRqLOvvS%2FW1dACS4uo9%2FIl%2BOYYh%2FNfb%2BL%2FkU6qNQedYEXgEO2WBz7AV%2F1aGGr5mwWoE6oi8mFYRoSay73CfjUO%2BoclxP1WG1Ry56V8107LI2ISteGK6fYNSvWGoK%2BVwac0g4oIZn4Rbfp%2FEuJWxijhO8nE7nHcB%2F2g0DmXEbiPTK%2BzSCZNFd0dHWd7HTJJZyUVBGH7xuBIdPYFvpZ37KdNoJzVwpfFgeADD9kFlU9X19613RWd469D3Mf4ANU7Ye4MgrulCUfb3fRx2nOdUowHDLJ74F0KHJsSPz3YxdGUkxQQuku2BfizuATcSLVQu0PLwk8ZRk7xIEPIdrfjYdQE0jjGaU6meGxmjanMOOn%2BLsGOp8BrT7M%2BBgFIby1ozgLaG2l379ctyfRn2sZIvsdIrnYub2zNuQa3v9UxEm88lj2UNm%2BDqy6iYOsEsEhUX8J%2BjGWqWUtNXU7I7UsYiOCtwZ5xmG3a9J3iLt%2FenU0N75GhPdFTosObAlP6LifX1HoPvjiwGhjnVxVk%2BupqL52tUJf%2FcmAAz0Pg4w3KjUjsdNvFMYdU4nAFjVxPBIFjjWfN0%2Fx&Expires=1736319843');
//     const defaultLayout = defaultLayoutPlugin();

//     return (
//         <div style={{ height: '500px' }}>
//             {pdfUrl ? (
//                 <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js"> {/* Updated to match the core version */}
//                     <Viewer fileUrl={pdfUrl} plugins={[defaultLayout]} />
//                 </Worker>
//             ) : (
//                 <p>Loading PDF...</p>
//             )}
//         </div>
//     );
// };

// export default PDFViewer;

// import { useLocation } from 'react-router-dom';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import { useState } from 'react';

// const PdfDisplayPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [pdfLink, setPdfLink] = useState(null);
//   const location = useLocation();
//   const randumnumber = location.state?.yourPrefillData;

//   console.log(randumnumber, 'randumnumber123');

//   // Create the default layout plugin for the PDF viewer
//   const defaultLayout = defaultLayoutPlugin();

//   // Fetch the PDF link from the backend API
//   const fetchPdfLink = async () => {
//     setLoading(true);
//     setError(null);
  
//     try {
//       const jwtToken = sessionStorage.getItem('jwtToken');  // Ensure JWT is available in sessionStorage
//       const eventData = {
//         action: 'returnpdf',
//         ItemType: `Testament_will:${randumnumber}`,  // Pass the dynamic random number
//       };
  
//       const response = await fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${jwtToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(eventData),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Error fetching PDF: ${response.status}`);
//       }
  
//       const data = await response.json();
  
//       if (data.success && data.pdfLink) {
//         // Clean the URL to remove any unwanted characters like quotes
//         const cleanedPdfLink = data.pdfLink.replace(/['"]+/g, '').trim();
//         setPdfLink(cleanedPdfLink);  // Set the cleaned PDF link
//         console.log('Cleaned PDF Link:', cleanedPdfLink);  // Debugging the link
//       } else {
//         setError('Error: No PDF link returned');
//       }
//     } catch (error) {
//       setError(`Error fetching PDF: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div>
//       {/* Button to trigger fetching the PDF link */}
//       <button onClick={fetchPdfLink} disabled={loading}>
//         {loading ? 'Loading PDF...' : 'Generate PDF'}
//       </button>

//       {/* Display error if present */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {/* Conditionally render the PDF content if the link is available */}
//       {pdfLink ? (
//         <div>
//           <h2>Generated PDF</h2>

//           {/* PDF Viewer with @react-pdf-viewer */}
//           <div style={{ height: '600px', width: '100%' }}>
//           <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
//   <Viewer 
//     fileUrl={pdfLink || ''}  // Use pdfLink directly without any modifications
//     plugins={[defaultLayout]} 
//   />
// </Worker>

// </div>

//           {/* Download button */}
//           <button
//             onClick={() => window.open(pdfLink, '_blank')}
//             style={{ marginTop: '20px' }}
//           >
//             Download PDF
//           </button>
//         </div>
//       ) : (
//         <p>No PDF available yet. Please generate one first.</p>
//       )}
      
//     </div>
//   );
// };

// export default PdfDisplayPage;



// const WillTemplate = () => {
//     // Sample data - you can replace these with dynamic variables
//     const location = useLocation();
//     const prefillData = location.state?.yourPrefillData;




//     const AdditionalInstruction = 'Ensure all assets are equally distributed to children.';
//     //const FullName = 'Rahul Shinde';




//     // Function to generate PDF
//     const generatePDF = () => {
//         console.log(prefillData, "prefillData----------------");
//         const element = document.getElementById("will-template");
    
//         const options = {
//             margin: 1,
//             filename: 'Last_Will_and_Testament.pdf',
//             image: { type: 'jpeg', quality: 0.98 },
//             html2canvas: { scale: 4 },
//             jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//         };
    
//         // Generate the PDF
//         html2pdf().from(element).set(options).toPdf().get('pdf').then(function(pdf) {
//             // Save the PDF locally on the user's machine
//             pdf.save();
    
//             // Convert the PDF to a Blob to send to the backend
//             pdf.output('blob').then((pdfBlob) => {
//                 // Convert the Blob to a FormData object for sending to the backend
//                 const formData = new FormData();
//                 formData.append('file', pdfBlob, 'Last_Will_and_Testament.pdf');
    
//                 // Get the user ID (this would come from your session or local storage)
//                 // You can replace this with the actual user ID from your app
//                 const userId = 'user-id-example'; // For example, if you're storing user ID in session storage
    
//                 // Send the PDF to the backend
//                 sendToBackend(formData);
//             });
//         });
//     };
    
//     // Function to send the PDF data and user_id to the backend
//     const sendToBackend = (formData) => {
//         const jwtToken = sessionStorage.getItem('jwtToken');
//         const submissionData = new FormData();
//         submissionData.append('file', formData.get('file'), 'Last_Will_and_Testament.pdf');
//         submissionData.append('action', 'submit');
    
//         fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${jwtToken}`,
//             },
//             body: submissionData, // Use FormData directly here
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('File successfully uploaded:', data);
//         })
//         .catch(error => {
//             console.error('Error uploading file:', error);
//         });
//     };
    
//     const getResidueDistributionText = () => {
//         if (!prefillData) {
//             return 'No distribution information available.';
//         }
    
//         if (prefillData.reresiduaryName) {
//             return prefillData.reresiduaryName;
//         } else if (prefillData.customName) {
//             return prefillData.customName;
//         } else {
//             return 'Sharing equally among all nominees.';
//         }
//     };
    

//     return (
//         <div className="container">
//             <div id="will-template" className="will-template">
//                 {/* Instructions and Disclaimer Section */}
//                 <section id="instructions">
//                     <h1>Important Instructions to Make Your Will Legally Valid</h1>
//                     <p><strong>Read:</strong></p>
//                     <ul>
//                         <li>Read your will carefully, and make sure you understand everything.</li>
//                         <li>If there’s anything you feel like you don’t understand, please speak with a lawyer.</li>
//                     </ul>

//                     <p><strong>Sign:</strong></p>
//                     <ul>
//                         <li>Find two witnesses. They must be at least 18 and mentally competent.</li>
//                         <li>You and your witnesses must sign and date your will in person.</li>
//                         <li>While in the presence of your witnesses, verbally acknowledge that this is your Last Will and Testament. For example, you could say: “This is my Last Will and Testament that I am signing and it represents my wishes for the distribution of my property at the time of my death.”</li>
//                         <li>Sign your name on each page of the Will using the signature boxes provided. On the last page, also fill in the date where indicated.</li>
//                         <li>Then have your witnesses sign and date where indicated.</li>
//                     </ul>

//                     <p><strong>Keep Safe:</strong></p>
//                     <ul>
//                         <li>Keep your original, signed will in a safe and accessible place, such as a fireproof box in your home.</li>
//                         <li>Be careful not to remove any staples from your will, or allow pages to be ripped, as this may raise concerns in the probate court that your will had been altered.</li>
//                         <li>Notify your executor nominees of the location of your will, and make sure they have access.</li>
//                         <li>You can make and distribute copies of your signed will for reference to loved ones.</li>
//                     </ul>

//                     <p><strong>Update:</strong></p>
//                     <ul>
//                         <li>It is a good idea to update your will when you marry, have children, divorce, move or go through other major life changes.</li>
//                         <li>If you would like to update your will, you can log into your account and make any changes you’d like.</li>
//                         <li>Do not attempt to amend your will by adding, crossing out, or modifying text in your existing will.</li>
//                         <li>To avoid confusion, you may want to destroy any old wills you have created.</li>
//                     </ul>

//                     <p><strong>Important Next Steps:</strong></p>
//                     <ul>
//                         <li>Having a valid will in place is a great first step, but there are many important assets that your will does not handle.</li>
//                         <li>Get 2 or more witnesses to sign the Will.</li>
//                         <li>Register the will if you wish, but it is not compulsory.</li>
//                         <li>Inform your loved ones where they can access the will.</li>
//                         <li>Appointing an executor may be expensive and you may choose to find a low-cost alternative. But bear in mind, it is of utmost importance that the appointed executor is reliable and trustworthy.</li>
//                     </ul>

//                     <p><strong>Need Help?</strong></p>
//                     <ul>
//                         <li>To learn more, please visit <a href="http://lmnopservices.com" target="_blank" rel="noopener noreferrer">lmnopservices.com</a> and speak to our assistant.</li>
//                     </ul>

//                     <p><strong>Disclaimer:</strong></p>
//                     <p>LMNOPservices is a service provided by Six Steps. We strive to ensure that its automated services are complete, but Six Steps will not be liable for any legal complications that may arise on use of the standardized will. Contact us if you need a customized will or speak to lawyers specializing in estate management.</p>
//                 </section>
//                 {/* Will Template Content */}
//                 <div style={{ pageBreakBefore: 'always', height: '20px' }}></div>
//                 <h1>LAST WILL AND TESTAMENT</h1>

//                 <section>
//                     <p>
//                         <p>
//                             I, <strong>{prefillData.name}</strong>, {
//                                 prefillData.gender === "Male"
//                                     ? `son of`
//                                     : (prefillData.maritalStatus === "Single" || prefillData.maritalStatus === "Divorced")
//                                         ? `daughter of`
//                                         : `wife of`
//                             } <strong>{prefillData.spouseOrFatherName}</strong>.
//                         </p>

//                         residing at <strong>{prefillData.address}, {prefillData.city}, {prefillData.state}, {prefillData.country}</strong>, Born on <strong>{prefillData.age}</strong>,
//                         having  their {prefillData.idType
//                         } is {prefillData.idNumber}, declare this to be my final Will, and I revoke all Wills and Codicils previously made by me.
//                         I declare that this Will is made entirely of my own free will, without any coercion, pressure, or undue influence from any person or entity.
//                         I affirm that I am of sound mind and fully aware of my actions.
//                     </p>

//                     <h2>ARTICLE I: DECLARATIONS</h2>
//                     <p><strong>A. Marital Status</strong> — As of the date of this Will, I am {prefillData.maritalStatus === 'single' || "divorced" ? 'unmarried and single' : `married to ${prefillData.spouseOrFatherName}`}.</p>



//                     {prefillData.customExecutor.name ? (
//                         <section>
//                             <h2>ARTICLE II: EXECUTOR PROVISIONS</h2>
//                             <p><strong>A. Executor</strong> — I want to nominate <strong>{prefillData.customExecutor.name}</strong> to serve as Executor of my estate and to carry out the instructions in this Will.</p>
//                             <p><strong>B. Executor Powers</strong> — I grant to my Executor the powers necessary to execute the provisions of the will.</p>
//                             <p><strong>C. Expenses</strong> — My Executor on successful completion of its duties shall be reimbursed for the reasonable costs and expenses incurred in connection with such Executor’s duties. The remuneration will be done from my estate. The details of remuneration are agreed upon with the Executor and Ancillary executor.</p>
//                             <p><strong>D. Indemnity</strong> — My Executor shall be indemnified and held harmless from any liability for any action taken, or for the failure to take any action, if done in good faith and without gross negligence.</p>
//                             <p><strong>E. Ancillary Executors</strong> — If for any reasons the appointed Executor cannot, or chooses not to, serve or carry out the duties, the ancillary Executor if nominated shall presume the role of the primary executor and will have the same powers, benefits, and indemnity as if they were the primary executor.</p>
//                             <p><strong>F. Power to Elect</strong> — No executor will have the powers to select any executor. If a situation arises where there is no executor willing to carry out the duties, I request the competent court to appoint an able administrator to carry out the administration of the assets. The expenses for which will be covered from my assets.</p>
//                         </section>
//                     ) : (
//                         <section>
//                             <h2>ARTICLE II: EXECUTOR PROVISIONS</h2>
//                             <p>I do not want to nominate any executor for this will.</p>
//                         </section>
//                     )}

//                     <section>
//                         <h2>ARTICLE III: TANGIBLE PERSONAL PROPERTY</h2>
//                         <p><strong>A. </strong> As used in this Article, the term “Tangible Personal Property” shall mean all household goods, appliances, furniture and furnishings, pictures, silverware, china, glass, books, clothing, jewelry, or other articles of personal use or ornaments, and other tangible personal property of a nature, use, or classification similar to the foregoing. Except as may be provided elsewhere in this Will or in a memorandum regarding tangible personal property incorporated by reference into this Will (including gifts of Tangible Personal Property items associated with a gift of real property, if applicable), upon the Testator’s death, the Executor shall distribute the balance of the Tangible Personal Property to the beneficiaries listed in <strong>Article VII</strong>, with particular items to be allocated as they may agree, or if they cannot agree, as the Executor shall determine in the Executor’s discretion.

//                             If any Beneficiary hereunder is a minor, the Executor may distribute such minor’s share to such minor or for such minor’s use to such minor’s parents, guardians, or any person with whom such minor is residing or who has the care or control of such minor without further responsibility, and the receipt of the person to whom such minor’s share is distributed shall be a complete discharge of the Executor. The cost of packing and shipping such property to any such beneficiary shall be charged against this Will as an administration expense.
//                         </p>
//                     </section>


//                     <section>
//                         <h2>ARTICLE IV: MISCELLANEOUS</h2>

//                         <p><strong>A. Severability</strong> — If any provision of this Will is held to be unenforceable or invalid, the remaining provisions shall remain in full force and effect to the fullest extent permissible under governing law.</p>

//                         <p><strong>B. Survivorship</strong> — No beneficiary shall be deemed to have survived me unless such beneficiary remains alive or remains in existence, as the case may be. Any person, who is prohibited by law from inheriting property from me, unless he/she is a minor, shall be treated as having failed to survive me.</p>

//                         <p><strong>C. Payment of Expenses</strong> — All funeral expenses, and all expenses incurred in connection with the administration of my estate shall be paid out of the residue of my estate without apportionment. To the extent the residue of my estate is insufficient for the payment of such expenses, then any excess expenses shall be paid on a pro rata basis from all of the assets passing by reason of my death.</p>

//                         <p><strong>D. Savings Clause</strong> — For the purposes of this Will, either gender shall be interpreted as encompassing the other gender, and the singular shall encompass the plural and vice versa, and the meaning shall dictate.</p>

//                         <p><strong>E. Distribution To Descendants</strong> — When a distribution is to be made to a person’s descendants, it will be made as per stirpes, meaning the descendants of a predeceased beneficiary will inherit the share that would have gone to that beneficiary if they had survived.</p>

//                         <p><strong>F. Discretion</strong> — Whenever in this Will an action is authorized in the discretion of my Executor or an Administrator, the term “discretion” shall mean the sole, absolute, and unfettered discretion of such Executor or Administrator.</p>

//                         <p><strong>G. Spendthrift Provisions</strong> — Prior to the actual receipt of property by any beneficiary, no property (income or principal) distributable under this Will shall, voluntarily or involuntarily, be subject to anticipation or assignment by any beneficiary, or to the attachment by or to the interference or control of any creditor or assignee of any beneficiary, or taken or reached by any legal or equitable process in satisfaction of any debt or liability of any beneficiary. Any attempted transfer or encumbrance of any interest in such property by any beneficiary prior to distribution shall be void.</p>

//                         <p><strong>H. No Contest</strong> — If any beneficiary of my estate in any manner, directly or indirectly, contests the probate or validity of this Will or any of its provisions, or institutes or joins in, except as a party defendant, any proceeding to contest the probate or validity of this Will or to prevent any provision hereof from being carried out in accordance with the terms hereof, then all benefits provided for such beneficiary are revoked and shall pass as if that contesting beneficiary had failed to survive me.

//                             The provisions of this Subarticle H shall be enforceable unless in a court action determining whether this no contest clause should be enforced, the party bringing the contest establishes that the contest was brought and maintained in good faith and that probable cause existed for bringing the contest. Each benefit conferred herein is made on the condition precedent that the beneficiary receiving such benefit shall accept and agree to all of the provisions of this Will, and the provisions of this Subarticle H are an essential part of each and every benefit.</p>
//                     </section>

//                     <div style={{ pageBreakBefore: 'always', height: '20px' }}></div>
//                     <section>
//                         <h2>ARTICLE V: GUARDIANSHIP PROVISIONS</h2>

//                         <p>In the event that any beneficiary is below the legal age of majority at the time of my death, I appoint the beneficiary's legal guardian as the caretaker of the beneficiary's share until the beneficiary reaches the age of 21 years.</p>

//                         <p>The appointed caretaker is authorized to utilize the beneficiary’s share exclusively for their essential livelihood, education, and well-being. The caretaker shall have the discretion to manage the funds as they deem appropriate for the beneficiary’s needs, but not for any other purposes.</p>

//                         <p>The provisions of this Article shall take effect only if the need to nominate a guardian arises following my death. If no such need arises, this section shall not be applicable.</p>
//                     </section>


//                     <section>
//                         <h2>ARTICLE VI: BENEFICIARY DETAILS</h2>
//                         <p>Below are the details of the beneficiaries that I wish to allocate a share of my assets. If a beneficiary listed herein is not explicitly assigned a share in the estate as outlined in ARTICLE VII, they shall have no grounds to contest this decision. Beneficiaries named in this Article may be included in the residual estate if expressly stated. Any individual/s not named as beneficiaries herein, regardless of their relationship to me, shall have no right to challenge their exclusion from this will.</p>

//                         <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//                             <thead>
//                                 <tr>
//                                     <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Beneficiary Name</th>
//                                     <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Relationship</th>
//                                     <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Age</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {prefillData.nominees
//                                     .map((beneficiary, index) => (
//                                         <tr key={index}>
//                                             <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{beneficiary.name}</td>
//                                             <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{beneficiary.relation}</td>
//                                             <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{beneficiary.age}</td>
//                                         </tr>
//                                     ))}
//                             </tbody>
//                         </table>
//                     </section>
//                     <div style={{ pageBreakBefore: 'always', height: '20px' }}></div>
//                     <section>
//                         <h2>ARTICLE VII: ASSET DISTRIBUTION</h2>
//                         <p>
//                             I, <strong>{prefillData.name}</strong>, wish to dispose of my assets in the following manner. This memorandum shall serve to dispose of assets to specific beneficiaries as provided below.
//                         </p>
//                         <p>
//                             If upon disposal of the below tangible personal property a beneficiary is deceased, then the described item shall instead be distributed with the remaining tangible personal property as provided in the Will.
//                         </p>

//                         {/* Asset Distribution Table */}
//                         <h1>Assets</h1>
//                         <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//                             <thead>
//                                 <tr>
//                                     <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Asset</th>
//                                     <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Description</th>
//                                     <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Beneficiary</th>
//                                     <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Percentage</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {prefillData.immovableAssets.map((item, index) => (
//                                     <tr key={index}>
//                                         {/* Asset Type */}
//                                         <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
//                                             {item.type}
//                                         </td>

//                                         {/* Description/Comment */}
//                                         <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
//                                             {item.nominees[0]?.comment || 'No comment available'}
//                                         </td>

//                                         {/* Beneficiary (Nominee Name) */}
//                                         <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
//                                             {item.nominees.map((nominee, nomineeIndex) => (
//                                                 <div key={nomineeIndex}>
//                                                     {nominee.name}
//                                                 </div>
//                                             ))}
//                                         </td>

//                                         {/* Percentage */}
//                                         <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
//                                             {item.nominees.map((nominee, nomineeIndex) => (
//                                                 <div key={nomineeIndex}>
//                                                     {nominee.percentage}%
//                                                 </div>
//                                             ))}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>



//                     </section>

//                     <h2>ARTICLE VIII: RESIDUE</h2>
//                     <h2>ARTICLE VIII: RESIDUE</h2>
//                     <p>
//                         All of the residue of my estate, including any property not specifically mentioned in this Will, shall be distributed to the following:
//                     </p>
//                     <p>{getResidueDistributionText()}</p>


//                     <h2>ARTICLE IX: ADDITIONAL INSTRUCTIONS</h2>
//                     <p><strong>{AdditionalInstruction}</strong></p>
//                 </section>

//                 <section>
//                     <h2>IN WITNESS WHEREOF</h2>
//                     <p>
//                         I sign my name to this Will in <strong>city :______________, State :______________, Country :___________</strong>.
//                     </p>
//                     <div className="signature-line">
//                         <p><strong>Signature of Testator:</strong> ___________</p>
//                         <p><strong>Date:</strong> ___________</p>
//                     </div>
//                 </section>

//                 <div style={{ pageBreakBefore: 'always', height: '20px' }}></div>
//                 <section>
//                     <h2>WITNESSES</h2>

//                     <p>
//                         On the date written below, the maker of this Will, <strong>FullName:___________________________________</strong>, declared to us, the undersigned,
//                         that this instrument was the maker’s Will, and requested us to act as witnesses to it. We understand that this
//                         instrument is the maker’s Will. At the maker’s request, and in the maker’s presence, we now sign below as witnesses.
//                         We believe the maker is over age eighteen (18), is of sound mind and memory, and to the best of our knowledge,
//                         this Will was not procured by duress, menace, fraud, or undue influence. Each of us is now age eighteen (18) or older,
//                         is a competent witness, and resides at the address set forth below.
//                     </p>

//                     <div className="signature-line">
//                         <div className="signature-row">
//                             <p><strong>Signature of First Witness:</strong> ___________</p>
//                         </div>
//                         <div className="signature-row">
//                             <p><strong>Signature of Second Witness:</strong> ___________</p>
//                         </div>
//                     </div>

//                     <div className="signature-line">
//                         <div className="signature-row">
//                             <p><strong>Name of First Witness:</strong> ___________</p>
//                         </div>
//                         <div className="signature-row">
//                             <p><strong>Name of Second Witness:</strong> ___________</p>
//                         </div>
//                     </div>

//                     <div className="signature-line">
//                         <div className="signature-row">
//                             <p><strong>Address of First Witness:</strong> ___________</p>
//                         </div>
//                         <div className="signature-row">
//                             <p><strong>Address of Second Witness:</strong> ___________</p>
//                         </div>
//                     </div>

//                     <div className="signature-line">
//                         <div className="signature-row">
//                             <p><strong>Date:</strong> ___________</p>
//                         </div>
//                         <div className="signature-row">
//                             <p><strong>Date:</strong> ___________</p>
//                         </div>
//                     </div>

//                 </section>

//             </div>

//             {/* Button to generate and download PDF */}
//             <button onClick={generatePDF}>Download Will as PDF</button>
//         </div>
//     );
// };

// export default WillTemplate;
