import React, { useState, useEffect } from 'react';
import NomineeModal from './NomineeModel'; // Ensure the path is correct
import '../css/submit.css'; // Include your CSS
import { useNavigate, useLocation } from 'react-router-dom';
import Bar from './Navbar';
import Modal from './model';
import translations from './translation';
import { toWords } from 'number-to-words';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import * as jwtDecode from 'jwt-decode';
import { jsPDF } from 'jspdf';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import AddPersonModal from './AddPersonModal';
import AddCharityModal from './AddCharityModal'
import { formToJSON } from 'axios';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.10.377/es5/build/pdf.worker.min.js`;

const WillForm = () => {

    const location = useLocation();
    const prefillData = location.state?.prefillData;
    const [popup, setPopup] = useState({ message: '', type: '', balance: '' })
    const [randumnumber, setRandanum] = useState(null)
    const [value, setvalue] = useState(null)
    const [step, setStep] = useState(1)
    // To handle any error
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [pdfContent, setPdfContent] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [isSection1Complete, setIsSection1Complete] = useState(false);
    const [selectedNominee, setSelectedNominee] = useState('');
    const [pdfLink, setPdfLink] = useState(null); // Store PDF link
    const [loading, setLoading] = useState(false); // Track loading state for fetching
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const { section } = useParams();
    const currentSection = parseInt(section, 10) || 1;
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // State to manage success
    const [message, setMessage] = useState(''); // State to store success message  // Loading state
    const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
    const [isCharityModalOpen, setIsCharityModalOpen] = useState(false);
    const [selectedAssetType, setSelectedAssetType] = useState('');

    const [personFormData, setPersonFormData] = useState({ name: '', relationship: '' });
    const [charityFormData, setCharityFormData] = useState({
        nonprofitName: '',
        ein: '',
        address: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zipCode: '',
        message: ''
    });
    const [validSections, setValidSections] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
    });
    const [formData, setFormData] = useState({
        action: 'save',
        product_id: 'None',
        form_name: 'Testament_will',
        numberOfChildren: '', // Add number of children to the state
        documentName: "",
        name: '',
        childrenNames: [],
        religion: "",
        language: "English",
        dob: '',
        gender: 'Male',
        address: '',
        city: '',
        state: '',
        rand_num: '',
        country: '',
        pincode: '',
        maritalStatus: '',
        spouseOrFatherName: '',
        nominees: [],
        immovableAssets: [],
        movableAssets: [],
        idNumber: '',
        idType: '',
        executorNomination: 'no',
        customExecutor: {
            name: '',
            address: '',
            relation: ''
        },
        custom: {
            name: "",
            address: "",
        },
        backupExecutor: 'no',
        customBackupExecutor: {
            name: '',
            address: '',
            relation: ''
        },
        residuaryEstate: 'evenly',
        customResiduaryInstructions: '',
        petYes: false,
        petDetails: {
            amount: '',
            asset: ''
        },
        immovableAssets: [],
        movableAssets: [],
        immovableAssetType: '',
        immovableAssetAddress: '',
        immovableAssetNominees: [],
        immovableAssetPercentage: '',
        immovableAssetPercentages: [],
        movableAssetType: '',
        movableAssetDescription: '',
        movableAssetNominees: [],
        movableAssetPercentageShares: [],
        guardianNomination: 'Select',
        customGuardian: '',
        backupGuardian: 'Select',
        customBackupGuardian: '',
        customMessage: '',
        noContestClause: false,
        immovableAssetDescription: '',
        residuaryName: '',


        custom: {
            name: '',
            address: ''
        },
        immovableAssetNominee: [],
        beneficiaries: [],
        movableAssetAddress: '',
        movableAssetNominee: [],
        movableAssetPercentage: '',



    });
    const [assetType, setAssetType] = useState('')
    const [editAsset, setEditAsset] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState('');
    const [customNomineeRelationship, setCustomNomineeRelationship] = useState('');
    const [assetToEdit, setAssetToEdit] = useState(null); // or set a default value

    const countries = [
        "United States", "Canada", "India", "Australia", "Germany", "France", "Brazil", "China", "Japan", "Russia",
        "United Kingdom", "Italy", "Mexico", "South Korea", "Spain", "Saudi Arabia", "South Africa", "Argentina",
        "Nigeria", "Egypt", "Indonesia", "Pakistan", "Bangladesh", "Thailand", "Vietnam", "Malaysia", "Philippines"
        // Add more countries as needed
    ];
    //const [currentSection, setCurrentSection] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (prefillData) {
            // Parse FormData from stringified JSON
            console.log(prefillData)
            const parsedFormData = prefillData.FormData ? JSON.parse(prefillData.FormData.S) : prefillData;
            setFormData((prevData) => ({
                ...prevData,
                ...parsedFormData, // Merge parsed data into the existing formData
                // You can add any other fields here that are not part of FormData but are needed from prefillData
            }));
        }
        console.log("formdata---", formData)
    }, [prefillData]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        // If the field is 'pincode', validate it to be a numeric value of exactly 6 digits
        if (name === 'pincode') {
            // Allow numeric input and ensure the value is not longer than 6 digits
            if (/^\d{0,6}$/.test(newValue)) {
                // Update the formData state if it's valid
                setFormData(prevData => ({
                    ...prevData,
                    [name]: newValue,
                }));

                // Clear the error if the input is valid
                if (errors[name]) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [name]: undefined,
                    }));
                }
            }

            // If the input is not a valid 6-digit number, show an error
            if (newValue && newValue.length !== 6) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: 'Pincode must be exactly 6 digits.',
                }));
            }
        } else {
            // For other fields, just update the formData
            setFormData(prevData => ({
                ...prevData,
                [name]: newValue,
            }));
        }
    };



    // Handle closing modals

    console.log(formData, "formdata9999999999999999999999999999999999999999")

    function getRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    function getOrCreateRandomNumber() {
        // Check if random number already exists in sessionStorage
        let randNum = sessionStorage.getItem('randNum');

        if (!randNum) {
            // If not present, create a new one
            randNum = getRandomString(12);  // For example, create a 12-character random string
            sessionStorage.setItem('randNum', randNum);  // Store the new value in sessionStorage
        }

        return randNum;  // Return the random number (whether fetched from sessionStorage or newly generated)
    }

    // Usage
    // Will either be the value from sessionStorage or a newly generated string
    const handleAddImmovableAsset = () => {
        const newAsset = {
            type: formData.immovableAssetType,
            address: formData.immovableAssetAddress,
            nominees: formData.immovableAssetNominees,
            percentage: formData.immovableAssetPercentages

        };
        setFormData((prevData) => ({
            ...prevData,
            immovableAssets: [...prevData.immovableAssets, newAsset]
        }));
        console.log(formData, "formdata-----")
        setModalVisible(false);
    };

    const handleNestedChange = (e, parentKey) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [parentKey]: {
                ...prevData[parentKey],
                [name]: value
            }
        }));
    };

    const addNominee = (nominee) => {
        setFormData(prevData => ({
            ...prevData,
            nominees: [...prevData.nominees, nominee]
        }));
    };

    const validateSection = () => {
        const newErrors = {}; // Initialize a new errors object for the current section

        // Check the current section and validate the form data accordingly
        switch (currentSection) {
            case 1:
                if (!formData.name) newErrors.name = 'Name is required';
                if (!formData.documentName) newErrors.documentName = 'Documentname is required';
                if (!formData.religion) {
                    newErrors.religion = 'Religion is required';
                } else {
                    if (formData.religion === 'Muslim') {
                        newErrors.religion = 'You are not applicable for this will form because of Muslim religion.';
                        alert("You are not applicable for this will form.");
                        navigate('/');  // Redirect to another page if the religion is Muslim
                    }
                }

                if (!formData.dob) {
                    newErrors.dob = 'Date of Birth is required';
                } else {
                    const dob = new Date(formData.dob);
                    const today = new Date();
                    const age = today.getFullYear() - dob.getFullYear();
                    const monthDiff = today.getMonth() - dob.getMonth();
                    if (age < 18 || (age === 18 && monthDiff < 0)) {
                        newErrors.dob = 'You must be at least 18 years old';
                    }
                }
                if (!formData.address) newErrors.address = 'Address is required';
                if (!formData.city) {
                    newErrors.city = 'City is required';
                } else {
                    if (["Kolkata", "Mumbai", "Madras"].includes(formData.city)) {
                        alert("For assistance, please reach out via our live chat!");
                        // Optionally provide a link to a live chat or redirect here
                    }
                }
                if (!formData.state) newErrors.state = 'State is required';
                if (!formData.country) newErrors.country = 'Country is required';
                if (!formData.pincode) newErrors.pincode = 'Pincode is required';
                if (!formData.idType) newErrors.idType = 'Idtype is required';
                if (!formData.idNumber) newErrors.idNumber = 'Id Number is required'
                break;

            case 2:
                if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
                if (formData.maritalStatus === 'married' && !formData.spouseOrFatherName) {
                    newErrors.spouseOrFatherName = 'Spouse/Father Name is required';
                }
                break;

            case 3:
                if (formData.nominees.length === 0) {
                    newErrors.nominees = 'At least one nominee is required';
                }
                break;

            case 4:
                if (formData.immovableAssets.length === 0) {
                    newErrors.immovableAssets = 'Please provide at least one immovable asset.';
                }
                break;

            // case 5:
            //     if (formData.movableAssets.length === 0) {
            //         newErrors.movableAssets = 'Please provide at least one movable asset.';
            //     }
            //     break;

            // case 6:
            //     if (formData.executorNomination === 'yes' && !formData.customExecutor.name) {
            //         newErrors.customExecutor = 'Executor details are required.';
            //     }
            //     break;

            default:
                break;
        }

        // Update the validSections state based on whether the current section has errors
        setValidSections((prevState) => ({
            ...prevState,
            [currentSection]: Object.keys(newErrors).length === 0,  // If no errors, section is valid
        }));

        // Return the errors object for the current section
        return newErrors;
    };




    const handlePrev = () => {
        if (currentSection > 1) {
            navigate(`/submit/${currentSection - 1}`); // Navigate to the previous section
        }
    };
    const handleSave = async () => {
        setIsLoading(true);
        const randnum = getOrCreateRandomNumber();
        console.log(randnum)
        const validationErrors = validateSection();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});


        const updatedFormData = {
            ...formData,
            rand_num: randnum,
            // Set the random number here
        };

        console.log(updatedFormData)
        const jwtToken = sessionStorage.getItem('jwtToken'); // Replace 'your_token_key' with the actual key
        try {
            const response = await fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
                method: 'POST', // Specify the request method
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFormData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("data Saved successfully:", data);
            // sessionStorage.removeItem('randNum')
            if (data.success) {
                setIsLoading(false);
                setIsSuccess(true);
                setMessage("Your data was saved successfully!");
                navigate(`/submit/${currentSection + 1}`);
                // Navigate to the next section


            } else {
                setIsLoading(false);
                setIsSuccess(false);
                setMessage(data.message || "Something went wrong.");
            }

        } catch (error) {
            console.error("Error fetching documents:", error.message);
        }

    }

    const handleSelectOption = (value) => {
        setSelectedOption(value);
        if (value === '')
            setSelectedNominee(''); // Reset nominee selection when changing options
        if (value !== 'custom') {
            setFormData((prevData) => ({
                ...prevData,
                custom: { name: '', address: '' } // Clear custom fields if not custom
            }));
        }
    };

    // Handle the second dropdown for selecting a nominee
    const handleSelectNominee = (value) => {
        setSelectedNominee(value);
        setFormData((prevData) => ({
            residuaryName: value
        }));

    };

    // Handle changes in the custom nominee name input
    const setCustomNomineeName = (name) => {
        setFormData((prevData) => ({

            custom: name
        }));
    };

    // Handle changes in the custom nominee address input

    const model = () => {
        console.log("hellooo")
        setShowModal(true)
    }

    const handleDate = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear the error for the current input field
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: undefined,
            }));
        }

        // Additional validation for Date of Birth
        if (name === 'dob') {
            const dob = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (age < 18 || (age === 18 && monthDiff < 0)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    dob: 'You must be at least 18 years old',
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    dob: undefined, // Clear the error if valid
                }));
            }
        }
    };
    const addChild = () => {
        setFormData(prevData => ({
            ...prevData,
            childrenNames: [...prevData.childrenNames]
        }));
    };
   

    const submitFormData = () => {
        const validationErrors = validateSection(); // Assuming you have validateSection function
        console.log(validationErrors);
        const generatePdfContent = () => {
            const doc = new jsPDF();

            let yPos = 20;  // Starting y position

            // Helper function to handle page breaks
            const checkPageBreak = () => {
                if (yPos > doc.internal.pageSize.height - 30) {
                    doc.addPage();
                    yPos = 20;  // Reset yPos for new page
                }
            };

            // Helper function to add wrapped text and update yPos with line spacing
            const addWrappedText = (text, fontSize = 12, maxWidth = 190, fontStyle = "normal", lineSpacing = 4) => {
                doc.setFontSize(fontSize);
                doc.setFont("helvetica", fontStyle);
                doc.text(text, 10, yPos, { maxWidth: maxWidth });
                const textHeight = doc.getTextDimensions(text, { maxWidth: maxWidth }).h;
                yPos += textHeight + lineSpacing;  // Move yPos down by the height of the text + custom line spacing
                checkPageBreak();
            };

            const drawLine = (yPos) => {
                doc.line(10, yPos, doc.internal.pageSize.width - 10, yPos); // Horizontal line
            };

            // Add section headers with larger, bold fonts
            const addSectionHeader = (text, fontSize = 16) => {
                const pageWidth = doc.internal.pageSize.width;  // Get the page width
                doc.setFontSize(fontSize);
                doc.setFont("helvetica", "bold");

                // Calculate the width of the text
                const textWidth = doc.getTextWidth(text);

                // Calculate the starting x position to center the text
                const xPos = (pageWidth - textWidth) / 2;

                // Add the text at the calculated position
                doc.text(text, xPos, yPos);
                yPos += 10;  // Adjust yPos after the header
                checkPageBreak();
            };
            // Section 1: Instructions
            addSectionHeader('Important Instructions to Make Your Will Legally Valid', 18);
            addWrappedText('Read:');
            addWrappedText('• Read your will carefully, and make sure you understand everything.');
            addWrappedText('• If there’s anything you feel like you don’t understand, please speak with a lawyer.');

            addWrappedText('Sign:');
            addWrappedText('• Find two witnesses. They must be at least 18 and mentally competent.');
            addWrappedText('• You and your witnesses must sign and date your will in person.');
            addWrappedText('• While in the presence of your witnesses, verbally acknowledge that this is your Last Will and Testament.');
            addWrappedText('• Sign your name on each page of the Will using the signature boxes provided. On the last page, also fill in the date where indicated.');
            addWrappedText('• Then have your witnesses sign and date where indicated.');

            addWrappedText('Keep Safe:');
            addWrappedText('• Keep your original, signed will in a safe and accessible place, such as a fireproof box in your home.');
            addWrappedText('• Be careful not to remove any staples from your will, or allow pages to be ripped, as this may raise concerns in the probate court that your will had been altered.');
            addWrappedText('• Notify your executor nominees of the location of your will, and make sure they have access.');
            addWrappedText('• You can make and distribute copies of your signed will for reference to loved ones.');

            addWrappedText('Update:');
            addWrappedText('• It is a good idea to update your will when you marry, have children, divorce, move or go through other major life changes.');
            addWrappedText('• If you would like to update your will, you can log into your account and make any changes you’d like.');
            addWrappedText('• Do not attempt to amend your will by adding, crossing out, or modifying text in your existing will.');
            addWrappedText('• To avoid confusion, you may want to destroy any old wills you have created.');

            addWrappedText('Important Next Steps:');
            addWrappedText('• Having a valid will in place is a great first step, but there are many important assets that your will does not handle.');
            addWrappedText('• Get 2 or more witnesses to sign the Will.');
            addWrappedText('• Register the will if you wish, but it is not compulsory.');
            addWrappedText('• Inform your loved ones where they can access the will.');
            addWrappedText('• Appointing an executor may be expensive and you may choose to find a low-cost alternative. But bear in mind, it is of utmost importance that the appointed executor is reliable and trustworthy.');

            addWrappedText('Need Help?');
            addWrappedText('• To learn more, please visit http://lmnopservices.com and speak to our assistant.');

            addWrappedText('Disclaimer:');
            addWrappedText('LMNOPservices is a service provided by Six Steps. We strive to ensure that its automated services are complete, but Six Steps will not be liable for any legal complications that may arise on use of the standardized will. Contact us if you need a customized will or speak to lawyers specializing in estate management.');

            // Page Break Before Last Will & Testament
            doc.addPage();
            yPos = 20;  // Reset yPos for new page

            addSectionHeader('LAST WILL AND TESTAMENT', 18);

            // Personal Information and Declarations
            addWrappedText(`I, ${formData.name}, ${formData.gender === "Male" ? 'son of' : (formData.maritalStatus === "Single" || formData.maritalStatus === "Divorced") ? 'daughter of' : 'wife of'} ${formData.spouseOrFatherName}.`);

            addWrappedText(`residing at ${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}, Born on ${formData.age}, having their ${formData.idType} is ${formData.idNumber}, declare this to be my final Will, and I revoke all Wills and Codicils previously made by me.`);

            addWrappedText('I declare that this Will is made entirely of my own free will, without any coercion, pressure, or undue influence from any person or entity. I affirm that I am of sound mind and fully aware of my actions.');

            // Article I: Declarations
            addSectionHeader('ARTICLE I: DECLARATIONS', 14);
            addWrappedText(`A. Marital Status — As of the date of this Will, I am ${formData.maritalStatus === 'single' || formData.maritalStatus === 'divorced' ? 'unmarried and single' : `married to ${formData.spouseOrFatherName}`}.\n`);

            // Article II: Executor Provisions
            if (formData.customExecutor.name) {
                addSectionHeader('ARTICLE II: EXECUTOR PROVISIONS', 14);

                addWrappedText('A. Executor — I want to nominate ' + formData.customExecutor.name + ' to serve as Executor of my estate and to carry out the instructions in this Will.');

                addWrappedText('B. Executor Powers — I grant to my Executor the powers necessary to execute the provisions of the will.');

                addWrappedText('C. Expenses — My Executor on successful completion of its duties shall be reimbursed for the reasonable costs and expenses incurred in connection with such Executor’s duties. The remuneration will be done from my estate. The details of remuneration are agreed upon with the Executor and Ancillary executor.');

                addWrappedText('D. Indemnity — My Executor shall be indemnified and held harmless from any liability for any action taken, or for the failure to take any action, if done in good faith and without gross negligence.');

                addWrappedText('E. Ancillary Executors — If for any reasons the appointed Executor cannot, or chooses not to, serve or carry out the duties, the ancillary Executor, if nominated, shall assume the role of the primary executor and will have the same powers, benefits, and indemnity as if they were the primary executor.');

                addWrappedText('F. Power to Elect — No executor will have the powers to select any executor. If a situation arises where there is no executor willing to carry out the duties, I request the competent court to appoint an able administrator to carry out the administration of the assets. The expenses for which will be covered from my assets.');
            } else {
                addSectionHeader('ARTICLE II: EXECUTOR PROVISIONS', 14);
                addWrappedText('I do not want to nominate any executor for this will.');
            }

            addSectionHeader('ARTICLE III: TANGIBLE PERSONAL PROPERTY', 14);
            addWrappedText(`A. As used in this Article, the term “Tangible Personal Property” shall mean all household goods, appliances, furniture and furnishings, pictures, silverware, china, glass, books, clothing, jewelry, or other articles of personal use or ornaments, and other tangible personal property of a nature, use, or classification similar to the foregoing. Except as may be provided elsewhere in this Will or in a memorandum regarding tangible personal property incorporated by reference into this Will (including gifts of Tangible Personal Property items associated with a gift of real property, if applicable), upon the Testator’s death, the Executor shall distribute the balance of the Tangible Personal Property to the beneficiaries listed in Article VII, with particular items to be allocated as they may agree, or if they cannot agree, as the Executor shall determine in the Executor’s discretion.`);

            addWrappedText(`If any Beneficiary hereunder is a minor, the Executor may distribute such minor’s share to such minor or for such minor’s use to such minor’s parents, guardians, or any person with whom such minor is residing or who has the care or control of such minor without further responsibility, and the receipt of the person to whom such minor’s share is distributed shall be a complete discharge of the Executor. The cost of packing and shipping such property to any such beneficiary shall be charged against this Will as an administration expense.`);

            addSectionHeader('ARTICLE IV: MISCELLANEOUS', 14);

            addWrappedText('A. Severability — If any provision of this Will is held to be unenforceable or invalid, the remaining provisions shall remain in full force and effect to the fullest extent permissible under governing law.');
            addWrappedText('B. Survivorship — No beneficiary shall be deemed to have survived me unless such beneficiary remains alive or remains in existence, as the case may be. Any person, who is prohibited by law from inheriting property from me, unless he/she is a minor, shall be treated as having failed to survive me.');
            addWrappedText('C. Payment of Expenses — All funeral expenses, and all expenses incurred in connection with the administration of my estate shall be paid out of the residue of my estate without apportionment. To the extent the residue of my estate is insufficient for the payment of such expenses, then any excess expenses shall be paid on a pro rata basis from all of the assets passing by reason of my death.');
            addWrappedText('D. Savings Clause — For the purposes of this Will, either gender shall be interpreted as encompassing the other gender, and the singular shall encompass the plural and vice versa, and the meaning shall dictate.');
            addWrappedText('E. Distribution To Descendants — When a distribution is to be made to a person’s descendants, it will be made as per stirpes, meaning the descendants of a predeceased beneficiary will inherit the share that would have gone to that beneficiary if they had survived.');
            addWrappedText('F. Discretion — Whenever in this Will an action is authorized in the discretion of my Executor or an Administrator, the term “discretion” shall mean the sole, absolute, and unfettered discretion of such Executor or Administrator.');
            addWrappedText('G. Spendthrift Provisions — Prior to the actual receipt of property by any beneficiary, no property (income or principal) distributable under this Will shall, voluntarily or involuntarily, be subject to anticipation or assignment by any beneficiary, or to the attachment by or to the interference or control of any creditor or assignee of any beneficiary, or taken or reached by any legal or equitable process in satisfaction of any debt or liability of any beneficiary. Any attempted transfer or encumbrance of any interest in such property by any beneficiary prior to distribution shall be void.');
            addWrappedText('H. No Contest — If any beneficiary of my estate in any manner, directly or indirectly, contests the probate or validity of this Will or any of its provisions, or institutes or joins in, except as a party defendant, any proceeding to contest the probate or validity of this Will or to prevent any provision hereof from being carried out in accordance with the terms hereof, then all benefits provided for such beneficiary are revoked and shall pass as if that contesting beneficiary had failed to survive me.');
            addWrappedText('The provisions of this Subarticle H shall be enforceable unless in a court action determining whether this no contest clause should be enforced, the party bringing the contest establishes that the contest was brought and maintained in good faith and that probable cause existed for bringing the contest. Each benefit conferred herein is made on the condition precedent that the beneficiary receiving such benefit shall accept and agree to all of the provisions of this Will, and the provisions of this Subarticle H are an essential part of each and every benefit.');
            // Section for Asset Distribution

            addSectionHeader('ARTICLE V: GUARDIANSHIP PROVISIONS', 14);

            addWrappedText('In the event that any beneficiary is below the legal age of majority at the time of my death, I appoint the beneficiary\'s legal guardian as the caretaker of the beneficiary\'s share until the beneficiary reaches the age of 21 years.');
            addWrappedText('The appointed caretaker is authorized to utilize the beneficiary’s share exclusively for their essential livelihood, education, and well-being. The caretaker shall have the discretion to manage the funds as they deem appropriate for the beneficiary’s needs, but not for any other purposes.');
            addWrappedText('The provisions of this Article shall take effect only if the need to nominate a guardian arises following my death. If no such need arises, this section shall not be applicable.');
            addSectionHeader('ARTICLE VI: BENEFICIARY DETAILS', 14);
            addWrappedText('Below are the details of the beneficiaries that I wish to allocate a share of my assets. If a beneficiary listed herein is not explicitly assigned a share in the estate as outlined in ARTICLE VII, they shall have no grounds to contest this decision. Beneficiaries named in this Article may be included in the residual estate if expressly stated. Any individual/s not named as beneficiaries herein, regardless of their relationship to me, shall have no right to challenge their exclusion from this will.');

            // Table header
            const tableStartY = yPos;
            const columnWidth = [70, 60, 30];
            const headerHeight = 10;  // Height of the header row
            const rowHeight = 8;      // Height of each row

            // Set font for the header
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");

            // Set the header background color to sky blue
            doc.setFillColor(135, 206, 250); // Sky blue color (RGB: 135, 206, 250)

            // Draw the header cells with the sky blue color
            doc.rect(10, tableStartY, columnWidth[0], headerHeight, 'F'); // Beneficiary Name
            doc.rect(80, tableStartY, columnWidth[1], headerHeight, 'F'); // Relationship
            doc.rect(150, tableStartY, columnWidth[2], headerHeight, 'F'); // Age

            // Set text color to black for the header text
            doc.setTextColor(0, 0, 0);

            // Add text to the header cells
            doc.text('Beneficiary Name', 10 + 5, tableStartY + 6); // +5 for padding from the left
            doc.text('Relationship', 80 + 5, tableStartY + 6);      // +5 for padding from the left
            doc.text('Age', 150 + 5, tableStartY + 6);               // +5 for padding from the left

            yPos += headerHeight;  // Move Y position down after header

            // Set font for table rows (regular text)
            doc.setFont("helvetica", "normal");

            // Table rows for each beneficiary
            formData.nominees.forEach((beneficiary, index) => {
                const rowYPos = yPos + (index * rowHeight); // Adjust Y position for each row

                // Draw alternating row background colors (optional)
                if (index % 2 === 0) {
                    doc.setFillColor(240, 248, 255); // Light color for even rows (Alice blue)
                    doc.rect(10, rowYPos, columnWidth[0], rowHeight, 'F');
                    doc.rect(80, rowYPos, columnWidth[1], rowHeight, 'F');
                    doc.rect(150, rowYPos, columnWidth[2], rowHeight, 'F');
                } else {
                    doc.setFillColor(255, 255, 255); // White for odd rows
                    doc.rect(10, rowYPos, columnWidth[0], rowHeight, 'F');
                    doc.rect(80, rowYPos, columnWidth[1], rowHeight, 'F');
                    doc.rect(150, rowYPos, columnWidth[2], rowHeight, 'F');
                }

                // Add beneficiary details to each cell
                doc.setTextColor(0, 0, 0);  // Set text color to black
                doc.text(beneficiary.name, 10 + 5, rowYPos + 5); // +5 for padding
                doc.text(beneficiary.relation, 80 + 5, rowYPos + 5);
                doc.text(beneficiary.age.toString(), 150 + 5, rowYPos + 5);

                // Increase Y position for the next row
                yPos += rowHeight;
            });
            // Adding ARTICLE VII title with a specific size (14)


            const spaceAfterTable = 10; // Adjust space (in points) after the table before the section header
            yPos += spaceAfterTable;


            addSectionHeader('ARTICLE VII: ASSET DISTRIBUTION', 14);

            // Introduction to asset distribution
            addWrappedText('I, {formData.name}, wish to dispose of my assets in the following manner. This memorandum shall serve to allocate my assets to the specific beneficiaries as outlined below.');

            // Contingency for deceased beneficiaries
            addWrappedText('In the event that any beneficiary predeceases me or is otherwise unable to accept the described asset, the asset shall instead be distributed with the remaining tangible personal property in accordance with the provisions of my Will.');

            // Asset Distribution Table Header
            addWrappedText('Asset Distribution', 14);

            // Asset Distribution Table Start (Note: for actual tables, you'll need a way to display it dynamically in your UI)
            addWrappedText('Below is a table detailing the assets and their respective distribution to the named beneficiaries:', 14);
            drawLine(yPos);
            // Opening the table
            const assetTableStartY = yPos;
            const assetColumnWidth = [50, 70, 50, 30];  // Adjust column widths for Asset, Description, Beneficiary, Percentage
            const assetHeaderHeight = 10;  // Height of the header row
            const assetRowHeight = 8;      // Height of each row

            // Set font for the header
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");

            // Set the header background color to sky blue
            doc.setFillColor(135, 206, 250); // Sky blue color (RGB: 135, 206, 250)

            // Draw the header cells with the sky blue color
            doc.rect(10, assetTableStartY, assetColumnWidth[0], assetHeaderHeight, 'F'); // Asset
            doc.rect(60, assetTableStartY, assetColumnWidth[1], assetHeaderHeight, 'F'); // Description
            doc.rect(130, assetTableStartY, assetColumnWidth[2], assetHeaderHeight, 'F'); // Beneficiary
            doc.rect(180, assetTableStartY, assetColumnWidth[3], assetHeaderHeight, 'F'); // Percentage

            // Set text color to black for the header text
            doc.setTextColor(0, 0, 0);

            // Add text to the header cells
            doc.text('Asset', 10 + 5, assetTableStartY + 6);      // +5 for padding from the left
            doc.text('Description', 60 + 5, assetTableStartY + 6); // +5 for padding from the left
            doc.text('Beneficiary', 130 + 5, assetTableStartY + 6); // +5 for padding from the left
            doc.text('Percentage', 180 + 5, assetTableStartY + 6);  // +5 for padding from the left

            yPos += assetHeaderHeight;  // Move Y position down after header

            // Set font for table rows (regular text)
            doc.setFont("helvetica", "normal");

            // Table rows for each asset
            formData.immovableAssets.forEach((item, index) => {
                const rowYPos = yPos + (index * assetRowHeight); // Adjust Y position for each row

                // Draw alternating row background colors (optional)
                if (index % 2 === 0) {
                    doc.setFillColor(240, 248, 255); // Light color for even rows (Alice blue)
                    doc.rect(10, rowYPos, assetColumnWidth[0], assetRowHeight, 'F');
                    doc.rect(60, rowYPos, assetColumnWidth[1], assetRowHeight, 'F');
                    doc.rect(130, rowYPos, assetColumnWidth[2], assetRowHeight, 'F');
                    doc.rect(180, rowYPos, assetColumnWidth[3], assetRowHeight, 'F');
                } else {
                    doc.setFillColor(255, 255, 255); // White for odd rows
                    doc.rect(10, rowYPos, assetColumnWidth[0], assetRowHeight, 'F');
                    doc.rect(60, rowYPos, assetColumnWidth[1], assetRowHeight, 'F');
                    doc.rect(130, rowYPos, assetColumnWidth[2], assetRowHeight, 'F');
                    doc.rect(180, rowYPos, assetColumnWidth[3], assetRowHeight, 'F');
                }

                // Add asset details to each cell
                doc.setTextColor(0, 0, 0);  // Set text color to black
                doc.text(item.type, 10 + 5, rowYPos + 5); // +5 for padding
                doc.text(item.description || 'No description available', 60 + 5, rowYPos + 5);

                // Add beneficiaries and their percentages
                const beneficiariesAndPercentages = item.nominees
                    .map(nominee => `${nominee.name} (${nominee.percentage}%)`)
                    .join(', ');
                doc.text(beneficiariesAndPercentages, 130 + 5, rowYPos + 5);
                doc.text(beneficiariesAndPercentages, 180 + 5, rowYPos + 5);

                // Increase Y position for the next row
                yPos += assetRowHeight;
            });
            const spaceAfterTable2 = 10; // Adjust space (in points) after the table before the section header
            yPos += spaceAfterTable2;
            // Closing the table and section explanation
            addWrappedText('End of Asset Distribution.', 14);

            // ARTICLE VIII: RESIDUE

            addSectionHeader('ARTICLE VIII: RESIDUE', 14);

            // Introduction to the residue distribution
            addWrappedText('All of the residue of my estate, including any property not specifically mentioned in this Will, shall be distributed to the following:', 14);

            // Residue Distribution Text (assuming `getResidueDistributionText()` is a function that returns the distribution text)
            // addWrappedText(getResidueDistributionText(), 14);

            // ARTICLE IX: ADDITIONAL INSTRUCTIONS

            addSectionHeader('ARTICLE IX: ADDITIONAL INSTRUCTIONS', 14);

            // Additional instructions (assuming `AdditionalInstruction` is a variable holding the instructions)
            // addWrappedText(AdditionalInstruction, 14);

            // Finalize the document
            // IN WITNESS WHEREOF Section

            addSectionHeader('IN WITNESS WHEREOF', 14);

            // City, State, Country information with placeholders for user input
            addWrappedText('I sign my name to this Will in city: ____________, State: ____________, Country: ___________.', 14);

            // Signature and date fields
            addWrappedText('Signature of Testator: ___________', 14);
            addWrappedText('Date: ___________', 14);

            // Page break for the next section (this is usually handled in the UI, so no direct `addWrappedText` equivalent)
            addWrappedText('', 14);  // Empty line to represent a page break (you might handle page breaks in the UI)

            addWrappedText('WITNESSES', 14);

            // The main text for the Witness section
            addWrappedText('On the date written below, the maker of this Will, Full Name: ___________________________________, declared to us, the undersigned, that this instrument was the maker’s Will, and requested us to act as witnesses to it. We understand that this instrument is the maker’s Will. At the maker’s request, and in the maker’s presence, we now sign below as witnesses. We believe the maker is over age eighteen (18), is of sound mind and memory, and to the best of our knowledge, this Will was not procured by duress, menace, fraud, or undue influence. Each of us is now age eighteen (18) or older, is a competent witness, and resides at the address set forth below.', 14);

            // Signature lines for witnesses (First and Second Witness)
            addWrappedText('Signature of First Witness: ___________', 14);
            addWrappedText('Signature of Second Witness: ___________', 14);

            // Names of witnesses
            addWrappedText('Name of First Witness: ___________', 14);
            addWrappedText('Name of Second Witness: ___________', 14);

            // Addresses of witnesses
            addWrappedText('Address of First Witness: ___________', 14);
            addWrappedText('Address of Second Witness: ___________', 14);

            // Date fields for the witnesses
            addWrappedText('Date: ___________', 14);
            addWrappedText('Date: ___________', 14);

            yPos += 10;


            // Add more sections as required
            // Continue appending each part of the will document

            // Output PDF as base64 string
            const pdfBase64 = doc.output('datauristring');
            const base64String = pdfBase64.split(',')[1];
            setPdfContent(base64String);
        };

        if (!pdfContent) {
            generatePdfContent();
            console.log(pdfContent, "pdfContentpdfContentpdfContentpdfContentpdfContent")// Generate PDF content on submit if not already generated
            return;
        }
        // Check if there are validation errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else {
            setIsLoading(true);
            const jwtToken = sessionStorage.getItem('jwtToken'); // Get JWT token from session

            // Generate the PDF content (make sure this function properly updates pdfContent)
            generatePdfContent(); // Ensure this function updates pdfContent as a Base64-encoded string

            // Prepare form data (this will include both form data and the generated PDF)
            console.log(pdfContent, "pdfContentpdfContentpdfContentpdfContentpdfContent")

            // Add PDF content to the formData (Base64-encoded string)
            const randnum = getOrCreateRandomNumber()
            setRandanum(randnum)
            const updatedFormData = {
                ...formData,  // Add the random number to the form data
                pdf_content: pdfContent,
                rand_num: randnum,
                action: 'savepdf',
                // Add action type
            };
            console.log(updatedFormData, 'updatedFormData---------------------------')
            console.log(pdfContent, "pdfContentpdfContentpdfContentpdfContentpdfContent")

            // You can append additional form fields as needed

            // Send the FormData to the backend
            fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(updatedFormData),// Send the FormData object containing PDF and other form data
            })
                .then(res => res.json())
                .then(data => {
                    setIsLoading(false);
                    console.log(data, "data===================================")
                    if (!data.success) {
                        setIsSuccess(false);
                        setMessage(data.message || 'Something went wrong.');
                        setPopup({ message: data.message, type: 'error' });
                    } else {
                        if (data.pdfLink) {
                            // Open the PDF link in a new window/tab

                            console.log(data.pdfLink)
                            // Create a temporary download link to download the PDF
                            // window.open(data.pdfLink, '_blank');
                        } else {
                            setPopup({ message: 'PDF link not found in the response.', type: 'error' });
                        }

                        const newBalance = data.balance - 20;

                        // Convert the new balance to words (ensure the toWords function is implemented)
                        const balanceInWords = toWords(newBalance);

                        // Set the message with the new balance and words
                        setPopup({
                            balance: data.balance,
                            message: 'Downdload Pdf to click below',
                            //  message: `Your balance is ${data.balance}. After a deduction of 20, your balance is ${newBalance} (${balanceInWords}).`,
                            type: 'success',
                        });

                        console.log(data, 'Balance data received');
                    }
                })
                .catch(error => {
                    setIsLoading(false);
                    console.error('Unexpected error occurred:', error);
                    setPopup({ message: 'An unexpected error occurred. Please try again later.', type: 'error' });
                });
        }
    };



    const clearFormFields = () => {
        setFormData({ action: 'save', exampleField: '' }); // Reset form fields
    };

    const handleClosePopup = () => {
        setPopup({ message: '', type: '' }); // Close popup
        // navigate('/pdf', { state: { yourPrefillData: formData } });

    };

    const redirectToPreviousPage = () => {
        const currentUrl = encodeURIComponent(window.location.href);
        navigate('/pay', { state: { yourPrefillData: formData } });
    };
    const handleNext1 = () => {
        if (step === 1) {
            setStep(2);
        }
    };
    const handlePrev1 = () => {
        if (step == 2) {
            setStep(1)
        }
    }
    const pdfDownload = async () => {
        // navigate('/pdf', { state: { yourPrefillData: randumnumber } });
        const jwtToken = sessionStorage.getItem('jwtToken');
        const eventData = {
            action: 'returnpdf',
            ItemType: `Testament_will:${randumnumber}`,
            product_id: 'None'
        };

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error(`Error fetching PDF: ${response.status}`);
            }

            const data = await response.json();

            // Check if PDF link is returned and is valid
            if (data.success && data.pdfLink) {
                window.open(data.pdfLink, '_blank');
                //setPdfLink(data.pdfLink);
                console.log('PDF Link:', data.pdfLink); // Debugging the link

                const response = await fetch(data.pdfLink); // Replace with your dynamic data.pdfLink
                if (!response.ok) {
                    throw new Error("Failed to fetch the PDF");
                }

                const pdfBlob = await response.blob();
                const pdfUrl = URL.createObjectURL(pdfBlob);


                setPdfLink(pdfUrl); // Save the link for displaying
                console.log("PDF fetched successfully:", pdfUrl);


            } else {
                setError('Error: No PDF link returned');
            }
        } catch (error) {
            setError(`Error fetching PDF: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // const handleDownload = () => {
    //     if (pdfLink) {
    //         const link = document.createElement('a');
    //         link.href = pdfLink;
    //         link.download = 'document.pdf'; // Default file name
    //         link.click();
    //     }
    // };

    // useEffect(() => {
    //     if (pdfLink) {
    //         setPdfLoaded(true);
    //     }
    // }, [pdfLink]);

    // Function to determine header text based on section

    // Function to truncate text after the first 2 words
    const truncateText = (text, wordLimit) => {
        const words = text.split(" ");
        if (words.length > wordLimit) {
            return `${words.slice(0, wordLimit).join(" ")}...`; // Only the first `wordLimit` words + ellipsis
        }
        return text; // If fewer than the word limit, return the full text
    };


    return (
        <>

            <Bar currentSection={currentSection} validSections={validSections} />
            <div className='header1'>

            </div>
            <div className="container">
                <form id="willForm" onSubmit={submitFormData}>
                    <input type="hidden" name="form_name" value="Testament_will" />
                    {/* Basic Details Section */}
                    {currentSection === 1 && step === 1 && (
                        <div className='header'>


                            <div className='form-section' id="section1">
                                <div className="dropdown">

                                    <div className='header1'>
                                        <div className="input-group">
                                            <label>Document Name:</label>
                                            <input type="text" name="documentName" value={formData.documentName} onChange={handleChange} required />
                                            {errors.documentName && <span className="error">{errors.documentName}</span>}
                                        </div>
                                        <div className="input-row">
                                            <div className="input-group">
                                                <label>Religion:</label>
                                                <select name="religion" value={formData.religion} onChange={handleChange} required>
                                                    <option value="">Select Religion</option>
                                                    <option value="Hindu">Hindu</option>
                                                    <option value="Muslim">Muslim</option>
                                                    <option value="Christian">Christian</option>
                                                    <option value="Sikh">Sikh</option>
                                                    <option value="Buddhist">Buddhist</option>
                                                    <option value="Jain">Jain</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                                {errors.religion && <span className="error">{errors.religion}</span>}
                                            </div>
                                            <div className="input-group">
                                                <label>Country:</label>
                                                <select name="country" value={formData.country} onChange={handleChange} required>
                                                    <option value="">Select Country</option>
                                                    <option value="Andhra Pradesh">{translations[formData.language].states.andhraPradesh}</option>
                                                    <option value="Arunachal Pradesh">{translations[formData.language].states.arunachalPradesh}</option>
                                                    <option value="Assam">{translations[formData.language].states.assam}</option>
                                                    <option value="Bihar">{translations[formData.language].states.bihar}</option>
                                                    <option value="Chhattisgarh">{translations[formData.language].states.chhattisgarh}</option>
                                                    <option value="Goa">{translations[formData.language].states.goa}</option>
                                                    <option value="Gujarat">{translations[formData.language].states.gujarat}</option>
                                                    <option value="Haryana">{translations[formData.language].states.haryana}</option>
                                                    <option value="Himachal Pradesh">{translations[formData.language].states.himachalPradesh}</option>
                                                    <option value="Jharkhand">{translations[formData.language].states.jharkhand}</option>
                                                    <option value="Karnataka">{translations[formData.language].states.karnataka}</option>
                                                    <option value="Kerala">{translations[formData.language].states.kerala}</option>
                                                    <option value="Madhya Pradesh">{translations[formData.language].states.madhyaPradesh}</option>
                                                    <option value="Maharashtra">{translations[formData.language].states.maharashtra}</option>
                                                    <option value="Manipur">{translations[formData.language].states.manipur}</option>
                                                    <option value="Meghalaya">{translations[formData.language].states.meghalaya}</option>
                                                    <option value="Mizoram">{translations[formData.language].states.mizoram}</option>
                                                    <option value="Nagaland">{translations[formData.language].states.nagaland}</option>
                                                    <option value="Odisha">{translations[formData.language].states.odisha}</option>
                                                    <option value="Punjab">{translations[formData.language].states.punjab}</option>
                                                    <option value="Rajasthan">{translations[formData.language].states.rajasthan}</option>
                                                    <option value="Sikkim">{translations[formData.language].states.sikkim}</option>
                                                    <option value="Tamil Nadu">{translations[formData.language].states.tamilNadu}</option>
                                                    <option value="Telangana">{translations[formData.language].states.telangana}</option>
                                                    <option value="Tripura">{translations[formData.language].states.tripura}</option>
                                                    <option value="Uttar Pradesh">{translations[formData.language].states.uttarPradesh}</option>
                                                    <option value="Uttarakhand">{translations[formData.language].states.uttarakhand}</option>
                                                    <option value="West Bengal">{translations[formData.language].states.westBengal}</option>
                                                    <option value="Andaman and Nicobar Islands">
                                                        {translations[formData.language].states.andamanNicobar}
                                                    </option>
                                                    <option value="Chandigarh">{translations[formData.language].states.chandigarh}</option>
                                                    <option value="Dadra and Nagar Haveli and Daman and Diu">
                                                        {translations[formData.language].states.dadraNagarHaveli}
                                                    </option>
                                                    <option value="Lakshadweep">{translations[formData.language].states.lakshadweep}</option>
                                                    <option value="Delhi">{translations[formData.language].states.delhi}</option>
                                                    <option value="Puducherry">{translations[formData.language].states.puducherry}</option>
                                                </select>
                                                {errors.country && <span className="error">{errors.country}</span>}
                                            </div>
                                        </div>
                                        <div className="input-row">
                                            <div className="input-group">
                                                <label>Date of Birth:</label>
                                                <input type="date" name="dob" value={formData.dob} onChange={handleDate} required />
                                                {errors.dob && <span className="error">{errors.dob}</span>}
                                            </div>
                                            <div className="input-group">
                                                <label>Language:</label>
                                                <select name="language" value={formData.language} onChange={handleChange} required>
                                                    <option value="">Select Language</option>
                                                    <option value="English">English</option>
                                                    <option value="Hindi">Hindi</option>
                                                    <option value="Marathi">Marathi</option>
                                                </select>
                                                {errors.language && <span className="error">{errors.language}</span>}
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Name:</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                            {errors.name && <span className="error">{errors.name}</span>}
                                        </div>
                                        <div className="input-group">
                                            <label>Address:</label>
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                                            {errors.address && <span className="error">{errors.address}</span>}
                                        </div>
                                        <div className="button-container">
                                            <button type="button" className='nextButton' onClick={handleNext1}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {currentSection === 1 && step == 2 && (
                        <div className='header'>
                            <div className='form-section'>

                                <div className='header1'>
                                    {/* Basic Details fields go here */}
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>City:</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                                            {errors.city && <span className="error">{errors.city}</span>}
                                        </div>
                                        <div className="input-group">
                                            <label>Pincode:</label>
                                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
                                            {errors.pincode && <span className="error">{errors.pincode}</span>}
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>{translations[formData.language].state}: </label>
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                required
                                                style={{ color: formData.state ? '#000' : '#999' }} // Adjust color based on selection
                                            >
                                                <option value="" disabled style={{ color: '#999' }}>
                                                    {translations[formData.language].states.select}
                                                </option>
                                                <option value="Andhra Pradesh">{translations[formData.language].states.andhraPradesh}</option>
                                                <option value="Arunachal Pradesh">{translations[formData.language].states.arunachalPradesh}</option>
                                                <option value="Assam">{translations[formData.language].states.assam}</option>
                                                <option value="Bihar">{translations[formData.language].states.bihar}</option>
                                                <option value="Chhattisgarh">{translations[formData.language].states.chhattisgarh}</option>
                                                <option value="Goa">{translations[formData.language].states.goa}</option>
                                                <option value="Gujarat">{translations[formData.language].states.gujarat}</option>
                                                <option value="Haryana">{translations[formData.language].states.haryana}</option>
                                                <option value="Himachal Pradesh">{translations[formData.language].states.himachalPradesh}</option>
                                                <option value="Jharkhand">{translations[formData.language].states.jharkhand}</option>
                                                <option value="Karnataka">{translations[formData.language].states.karnataka}</option>
                                                <option value="Kerala">{translations[formData.language].states.kerala}</option>
                                                <option value="Madhya Pradesh">{translations[formData.language].states.madhyaPradesh}</option>
                                                <option value="Maharashtra">{translations[formData.language].states.maharashtra}</option>
                                                <option value="Manipur">{translations[formData.language].states.manipur}</option>
                                                <option value="Meghalaya">{translations[formData.language].states.meghalaya}</option>
                                                <option value="Mizoram">{translations[formData.language].states.mizoram}</option>
                                                <option value="Nagaland">{translations[formData.language].states.nagaland}</option>
                                                <option value="Odisha">{translations[formData.language].states.odisha}</option>
                                                <option value="Punjab">{translations[formData.language].states.punjab}</option>
                                                <option value="Rajasthan">{translations[formData.language].states.rajasthan}</option>
                                                <option value="Sikkim">{translations[formData.language].states.sikkim}</option>
                                                <option value="Tamil Nadu">{translations[formData.language].states.tamilNadu}</option>
                                                <option value="Telangana">{translations[formData.language].states.telangana}</option>
                                                <option value="Tripura">{translations[formData.language].states.tripura}</option>
                                                <option value="Uttar Pradesh">{translations[formData.language].states.uttarPradesh}</option>
                                                <option value="Uttarakhand">{translations[formData.language].states.uttarakhand}</option>
                                                <option value="West Bengal">{translations[formData.language].states.westBengal}</option>
                                                <option value="Andaman and Nicobar Islands">
                                                    {translations[formData.language].states.andamanNicobar}
                                                </option>
                                                <option value="Chandigarh">{translations[formData.language].states.chandigarh}</option>
                                                <option value="Dadra and Nagar Haveli and Daman and Diu">
                                                    {translations[formData.language].states.dadraNagarHaveli}
                                                </option>
                                                <option value="Lakshadweep">{translations[formData.language].states.lakshadweep}</option>
                                                <option value="Delhi">{translations[formData.language].states.delhi}</option>
                                                <option value="Puducherry">{translations[formData.language].states.puducherry}</option>
                                            </select>

                                            {errors.state && <span className="error">{errors.state}</span>}
                                        </div>
                                        <div className="input-group">
                                            <label>Gender:</label>
                                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Third-Gender">Third Gender</option>
                                            </select>
                                            {errors.gender && <span className="error">{errors.gender}</span>}
                                        </div>
                                    </div>
                                    <div className="input-group-row">
                                        <div className="input-group">
                                            <label>ID Type:</label>
                                            <select name="idType" value={formData.idType} onChange={handleChange} required>
                                                <option value="Pan Card">Pan Card</option>
                                                <option value="Aadhar Card">Aadhar Card</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.idType && <span className="error">{errors.idType}</span>}
                                        </div>
                                        <div className="input-group">
                                            <label>ID Number:</label>
                                            <input type="number" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
                                            {errors.idNumber && <span className="error">{errors.idNumber}</span>}
                                        </div>
                                    </div>
                                </div>
                                <label>What is your current marital status?*
                                </label>
                                <div className="radio-group">
                                    <label
                                        className={`marital-status-box ${formData.maritalStatus === 'single' ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="maritalStatus"
                                            value="single"
                                            onChange={handleChange} // Update state on change
                                            checked={formData.maritalStatus === 'single'}
                                        />
                                        {translations[formData.language].single}
                                    </label>

                                    <label
                                        className={`marital-status-box ${formData.maritalStatus === 'married' ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="maritalStatus"
                                            value="married"
                                            onChange={handleChange}
                                            checked={formData.maritalStatus === 'married'}
                                        />
                                        {translations[formData.language].married}
                                    </label>

                                    <label
                                        className={`marital-status-box ${formData.maritalStatus === 'divorced' ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="maritalStatus"
                                            value="divorced"
                                            onChange={handleChange}
                                            checked={formData.maritalStatus === 'divorced'}
                                        />
                                        {translations[formData.language].divorced}
                                    </label>
                                </div>
                                {formData.maritalStatus && (
                                    <>
                                        {/* Conditional input for spouse/father name */}
                                        <label>
                                            {formData.maritalStatus === 'married' || formData.maritalStatus === 'divorced'
                                                ? translations[formData.language].enterSpouseName
                                                : translations[formData.language].enterFatherName}
                                            <input
                                                type="text"
                                                name="spouseOrFatherName"
                                                value={formData.spouseOrFatherName}
                                                onChange={handleChange}
                                            />
                                            {errors.spouseOrFatherName && (
                                                <span className="error">{errors.spouseOrFatherName}</span>
                                            )}
                                        </label>

                                        {/* Conditional input for number of children */}
                                        {(formData.maritalStatus === 'married' || formData.maritalStatus === 'divorced') && (
                                            <div>
                                                <label>
                                                    Do you have how many children?*
                                                    <input
                                                        type="number"
                                                        name="numberOfChildren"
                                                        value={formData.numberOfChildren || ''}
                                                        onChange={handleChange}
                                                        min="0" // Prevent negative values
                                                    />
                                                    {errors.numberOfChildren && (
                                                        <span className="error">{errors.numberOfChildren}</span>
                                                    )}
                                                </label>
                                            </div>
                                        )}
                                        {(formData.numberOfChildren) && (
                                            <label>
                                                What are the full legal names of your children?*
                                                <input
                                                    type='text'
                                                    name='childrenNames'
                                                    value={formData.childrenNames || ''}
                                                    onChange={handleChange}
                                                />
                                            </label>

                                        )}
                                        <button type="button" onClick={addChild}>
                                            Add Another Child
                                        </button>
                                    </>
                                )}
                                <div className="button-container">

                                    <div className="button-container1">
                                        <button type="button" className="previous-button1" onClick={handlePrev1}>
                                            Previous
                                        </button>
                                        <div className="right-buttons1">
                                            <button
                                                type="button"
                                                className="save-button1"
                                                style={styles.saveButton}
                                                onClick={handleSave}
                                            >
                                                Save & Continue
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {currentSection === 2 && (
                        <div className='header'>
                            <div className="form-section" id="section3">
                                {/* <div className='header1'>
                                    <div>{getHeaderText(section)}</div>
                                </div> */}

                                <div className='meassage-Text'> Please click the 'Add Nominee' button below to provide nominee details for this will.*
                                </div>
                                <button type="button" className='nominee-Button' onClick={() => setShowModal(true)}>
                                    {translations[formData.language].addNominee}
                                </button>

                                {/* Nominee Table: Display only if nominees exist */}
                                {formData.nominees.length > 0 && (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>{translations[formData.language].name}</th>
                                                <th>{translations[formData.language].age}</th>
                                                <th>{translations[formData.language].relation}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.nominees.map((nominee, index) => (
                                                <tr key={index}>
                                                    <td>{nominee.name}</td>
                                                    <td>{nominee.age}</td>
                                                    <td>{nominee.relation}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* Error Message */}
                                {errors.nominees && <span className="error">{errors.nominees}</span>}

                                {/* Navigation Buttons */}
                                <div className="button-container1">
                                    <button type="button" className="previous-button1" onClick={handlePrev}>
                                        Previous
                                    </button>
                                    <div className="right-buttons1">
                                        <button
                                            type="button"
                                            className="save-button1"
                                            style={styles.saveButton}
                                            onClick={handleSave}
                                        >
                                            Save & Continue                                        </button>

                                    </div>
                                </div>


                                {/* Loading Spinner */}
                                {isLoading && (
                                    <div className="loading-container">
                                        <div className="spinner"></div>
                                        <p>Loading, please wait...</p>
                                    </div>
                                )}

                                {/* Nominee Modal */}
                                {showModal && (
                                    <NomineeModal onClose={() => setShowModal(false)} onSave={addNominee} />
                                )}
                            </div>
                        </div>
                    )}


                    {currentSection === 3 && (
                        <div className='header'>
                            <div className="form-section" id="section4">
                                {/* <div className='header1'>
                                <div>{getHeaderText(section)}</div>
                            </div> */}
                                <div className="flex-container">
                                    {/* Left Side: Boxes */}
                                    <div className="asset-box-container">
                                        <div
                                            className={`asset-type-box ${selectedAssetType === 'financialAccount' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAssetType('financialAccount');
                                                setModalVisible(true);
                                                setEditAsset(null);
                                                setvalue(true);
                                                setAssetType('immovable');
                                            }}
                                        >
                                            <div>{translations[formData.language].financialAccount}</div>
                                        </div>
                                        <div
                                            className={`asset-type-box ${selectedAssetType === 'retirementAccount' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAssetType('retirementAccount');
                                                setModalVisible(true);
                                                setEditAsset(null);
                                                setvalue(true);
                                                setAssetType('immovable');
                                            }}
                                        >
                                            <div>{translations[formData.language].retirementAccount}</div>
                                        </div>
                                        <div
                                            className={`asset-type-box ${selectedAssetType === 'lifeInsurance' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAssetType('lifeInsurance');
                                                setModalVisible(true);
                                                setEditAsset(null);
                                                setvalue(true);
                                                setAssetType('immovable');
                                            }}
                                        >
                                            <div>{translations[formData.language].lifeInsurance}</div>
                                        </div>
                                        <div
                                            className={`asset-type-box ${selectedAssetType === 'realEstate' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAssetType('realEstate');
                                                setModalVisible(true);
                                                setEditAsset(null);
                                                setvalue(true);
                                                setAssetType('immovable');
                                            }}
                                        >
                                            <div> {translations[formData.language].realEstate}</div>
                                        </div>
                                        <div
                                            className={`asset-type-box ${selectedAssetType === 'vehicle' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAssetType('vehicle');
                                                setModalVisible(true);
                                                setEditAsset(null);
                                                setvalue(true);
                                                setAssetType('immovable');
                                            }}
                                        >
                                            <div>{translations[formData.language].vehicle}</div>
                                        </div>
                                        <div
                                            className={`asset-type-box ${selectedAssetType === 'cashAndValuables' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAssetType('cashAndValuables');
                                                setModalVisible(true);
                                                setEditAsset(null);
                                                setvalue(true);
                                                setAssetType('immovable');
                                            }}
                                        >
                                            <div>{translations[formData.language].cashAndValuables}</div>
                                        </div>
                                        <div
                                            className={`asset-type-box ${selectedAssetType === 'vehicle' ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAssetType('vehicle');
                                                setModalVisible(true);
                                                setEditAsset(null);
                                                setvalue(true);
                                                setAssetType('immovable');
                                            }}
                                        >
                                            <div> Others</div>
                                        </div>
                                    </div>


                                    {/* Right Side: Table */}

                                </div>
                                <div className="table-container">
                                    {formData.immovableAssets.length > 0 ? (
                                        <table className="classic-table">
                                            <thead>
                                                <tr>
                                                    <th>Asset Type</th>
                                                    <th className="wide-column">Asset Description</th>
                                                    <th>Nominee(s)</th>
                                                    <th className="narrow-column">Percentage</th>
                                                    <th className="wide-column">Comment(s)</th>
                                                    <th className="narrow-column">Actions</th>
                                                </tr>
                                            </thead>

                                            {formData.immovableAssets.map((asset, index) => {
                                                const nominees = asset.nominees || [];

                                                return (
                                                    <tbody key={asset.id}>
                                                        {nominees.length > 0 ? (
                                                            nominees.map((nominee, nomineeIndex) => (
                                                                <tr key={`${asset.id}-${nomineeIndex}`}>
                                                                    {nomineeIndex === 0 && (
                                                                        <>
                                                                            <td rowSpan={nominees.length}>{asset.type}</td>
                                                                            <td rowSpan={nominees.length} className="wide-column">
                                                                                {asset.description}
                                                                            </td>
                                                                        </>
                                                                    )}
                                                                    <td>{nominee.name}</td>
                                                                    <td className="narrow-column">{nominee.percentage}%</td>
                                                                    <td className="wide-column">{nominee.comment}</td>
                                                                    <td className="narrow-column">
                                                                        <button
                                                                            onClick={() => {
                                                                                setModalVisible(true);
                                                                                setAssetType('immovable');
                                                                                setEditAsset({
                                                                                    id: asset.id,
                                                                                    index,
                                                                                    nomineeIndex,
                                                                                    asset,
                                                                                    nominee: nominee.name,
                                                                                    nomineePercentage: nominee.percentage,
                                                                                    nomineeComment: nominee.comment,
                                                                                });
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td>{asset.type}</td>
                                                                <td className="wide-column">{truncateText(asset.description, 2)}</td>
                                                                <td>No Nominees</td>
                                                                <td className="narrow-column">-</td>
                                                                <td className="wide-column">-</td>
                                                                <td className="narrow-column">
                                                                    <button
                                                                        onClick={() => {
                                                                            setModalVisible(true);
                                                                            setAssetType('immovable');
                                                                            setEditAsset({
                                                                                id: asset.id,
                                                                                index,
                                                                                nomineeIndex: 0,
                                                                                asset,
                                                                                nominee: null,
                                                                                nomineePercentage: 0,
                                                                                nomineeComment: '',
                                                                            });
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                );
                                            })}
                                        </table>
                                    ) : (
                                        'No any assets'
                                    )}
                                </div>


                                <div className="button-container1">
                                    <button type="button" className="previous-button1" onClick={handlePrev}>
                                        Previous
                                    </button>
                                    <div className="right-buttons1">
                                        <button
                                            type="button"
                                            className="save-button1"
                                            style={styles.saveButton}
                                            onClick={handleSave}
                                        >
                                            Save & Continue
                                        </button>

                                    </div>
                                </div>




                                {/* Loading Spinner */}
                                {isLoading && (
                                    <div className="loading-container">
                                        <div className="spinner"></div>
                                        <p>Loading, please wait...</p>
                                    </div>
                                )}

                                {/* Nominee Modal */}
                                {showModal && (
                                    <NomineeModal onClose={() => setShowModal(false)} onSave={addNominee} />
                                )}

                            </div>
                        </div>

                    )}





                    {/* Modal Component for Adding Assets */}
                    <Modal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        formData={formData}
                        handleChange={handleChange}
                        handleAddImmovableAsset={handleAddImmovableAsset}
                        setFormData={setFormData}
                        assetType={assetType}
                        selectedAssetType={selectedAssetType}
                        editAsset={editAsset}
                        setEditAsset={setEditAsset}
                        value={value}
                        AddNomine={model}
                    />

                    {currentSection === 4 && (
                        <div className='header'>
                            <div className="form-section" id="section6">

                                <div className="form-container flex flex-row justify-between">
                                    {/* Left Side - Add Beneficiary Form */}
                                    <div className="form-left flex-1 p-4">
                                        <h3>Who should inherit your residual estate when you pass away?</h3>

                                        {/* Add Person Dropdown */}
                                        <div className="buttons-container">
                                            {/* Main dropdown for selecting the option */}
                                            <div className="mb-4">
                                                <p className="font-medium mb-2">Select an Option</p>
                                                <div className="radio-group">
                                                    <label className="marital-status-box">
                                                        <input
                                                            type="radio"
                                                            value="select-person"
                                                            checked={selectedOption === "select-person"}
                                                            onChange={(e) => handleSelectOption(e.target.value)}

                                                        />
                                                        Select a Person
                                                    </label>


                                                    <label className="marital-status-box">
                                                        <input
                                                            type="radio"
                                                            name="executorNomination"
                                                            value="equal"
                                                            checked={selectedOption === "equal"}
                                                            onChange={(e) => handleSelectOption(e.target.value)}
                                                        />

                                                        Equal

                                                    </label>
                                                    <label className='marital-status-box'>
                                                        <input
                                                            type="radio"
                                                            value="custom"
                                                            checked={selectedOption === "custom"}
                                                            onChange={(e) => handleSelectOption(e.target.value)}

                                                        />
                                                        Custom
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Show second dropdown for selecting a nominee if 'Select a Person' is chosen */}
                                            {selectedOption === "select-person" && (
                                                <div>
                                                    <h3>Select a Nominee:</h3>
                                                    <select
                                                        onChange={(e) => handleSelectNominee(e.target.value)}
                                                        value={selectedNominee}
                                                        className="w-full p-2 border rounded mb-4"
                                                    >
                                                        <option value="" disabled>
                                                            Select a Nominee
                                                        </option>
                                                        {formData.nominees.map((nominee, index) => (
                                                            <option key={index} value={nominee.name}>
                                                                {nominee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* Show message or distribute shares equally if 'Share equally among all nominees' is selected */}
                                            {selectedOption === "equal" && (
                                                <div>
                                                    <h3>Sharing equally among all nominees.</h3>
                                                    {/* You can add logic here to calculate and display the shares */}
                                                </div>
                                            )}

                                            {/* Show input fields if 'Custom' is selected */}
                                            {selectedOption === "custom" && (
                                                <div className="custom-nominee-fields">
                                                    <label>Enter Custom Details</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter custom details"
                                                        value={formData.custom.name}
                                                        onChange={(e) => setCustomNomineeName(e.target.value)} // Handle custom name input
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>
                                            )}

                                            {/* Display selected nominee */}
                                            {selectedNominee && selectedOption === "select-person" && (
                                                <div>
                                                    <h4>Selected Nominee: {selectedNominee}</h4>
                                                </div>
                                            )}
                                        </div>

                                        {/* Navigation Buttons */}



                                        {/* Loading Spinner */}
                                        {isLoading && (
                                            <div className="loading-container mt-4">
                                                <div className="spinner"></div>
                                                <p>Loading, please wait.....</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side - Display Movable and Immovable Assets */}
                                    <div className="assets-right flex-1 p-4 bg-gray-100 rounded">
                                        <h3>Assets</h3>
                                        <div className="asset-table overflow-auto">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th className="border border-gray-300 p-2">Asset Type</th>
                                                        <th className="border border-gray-300 p-2">Nominee</th>
                                                        <th className="border border-gray-300 p-2">Remaining %</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.immovableAssets &&
                                                        formData.immovableAssets.map((asset, index) => {
                                                            // Calculate the total percentage for non-"Residuary" nominees
                                                            const totalNomineePercentage = asset.nominees
                                                                .filter((nominee) => nominee.name !== "Residuary")
                                                                .reduce((sum, nominee) => sum + nominee.percentage, 0);

                                                            // Calculate remaining percentage (for Residuary)
                                                            const remainingPercentage = 100 - totalNomineePercentage;

                                                            // Ensure there are at least two nominees
                                                            const validNominees = asset.nominees.length >= 2;

                                                            return (
                                                                <tr key={index}>
                                                                    <td className="border border-gray-300 p-2">{asset.type}</td>
                                                                    <td className="border border-gray-300 p-2">
                                                                        {validNominees ? (
                                                                            asset.nominees.map((nominee, nomineeIndex) => {
                                                                                if (nominee.name === "Residuary") {
                                                                                    return null; // Exclude "Residuary" from the "Nominee(s)" column
                                                                                } else {
                                                                                    return (
                                                                                        <div
                                                                                            key={nomineeIndex}
                                                                                            className="nominee"
                                                                                        >
                                                                                            {nominee.name}: {nominee.percentage}%
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            })
                                                                        ) : (
                                                                            <div className="error">
                                                                                At least two nominees are required.
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-300 p-2">
                                                                        {validNominees && remainingPercentage > 0 ? (
                                                                            asset.nominees.map((nominee, nomineeIndex) => {
                                                                                if (nominee.name === "Residuary") {
                                                                                    return (
                                                                                        <div
                                                                                            key={nomineeIndex}
                                                                                            className="nominee"
                                                                                        >
                                                                                            {nominee.name}: {remainingPercentage}% {/* Show remaining percentage */}
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })
                                                                        ) : (
                                                                            "-"
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="button-container1">
                                    <button type="button" className="previous-button1" onClick={handlePrev}>
                                        Previous
                                    </button>
                                    <div className="right-buttons1">
                                        <button
                                            type="button"
                                            className="save-button1"
                                            style={styles.saveButton}
                                            onClick={handleSave}
                                        >
                                            Save & Continue
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}




                    {/* Executor Nomination Section */}
                    {

                        currentSection === 5 && (
                            <div className='header'>
                                <div className="form-section" id="section7">
                                    <label className='text-meassage'>Do you want any Executor?</label>
                                    <div className="radio-group">

                                        <label className="marital-status-box">
                                            <input
                                                type="radio"
                                                name="executorNomination"
                                                value="yes"
                                                onChange={handleChange}
                                            />

                                            {translations[formData.language].yes}

                                        </label>



                                        <label className="marital-status-box">
                                            <input
                                                type="radio"
                                                name="executorNomination"
                                                value="no"
                                                onChange={handleChange}
                                            />

                                            {translations[formData.language].no}

                                        </label>

                                    </div>

                                    {/* Display executor details if 'yes' is selected */}

                                    {formData.executorNomination === 'yes' && (
                                        <div className="executor-row">
                                            <label>
                                                {translations[formData.language].executorName}
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.customExecutor.name}
                                                    onChange={(e) => handleNestedChange(e, 'customExecutor')}
                                                />
                                                {errors.customExecutor && <span className="error">{errors.customExecutor}</span>}
                                            </label>
                                            <label>
                                                {translations[formData.language].executorAddress}
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.customExecutor.address}
                                                    onChange={(e) => handleNestedChange(e, 'customExecutor')}
                                                />
                                            </label>
                                            <label>
                                                {translations[formData.language].relation}
                                                <input
                                                    type="text"
                                                    name="relation"
                                                    value={formData.customExecutor.relation}
                                                    onChange={(e) => handleNestedChange(e, 'customExecutor')}
                                                />
                                            </label>
                                        </div>
                                    )}


                                    {/* Backup executor question */}
                                    <div class="border-line"></div>

                                    {formData.executorNomination === 'yes' && (
                                        <div>
                                            <label className='text-meassage'>Do you want any Backup Executor?</label>
                                            <div className="radio-group">


                                                <label className="marital-status-box">
                                                    <input
                                                        type="radio"
                                                        name="hasBackupExecutor"
                                                        value="yes"
                                                        onChange={handleChange}
                                                    />

                                                    {translations[formData.language].yes}

                                                </label>


                                                <label className="marital-status-box">
                                                    <input
                                                        type="radio"
                                                        name="hasBackupExecutor"
                                                        value="no"
                                                        onChange={handleChange}
                                                    />

                                                    {translations[formData.language].no}

                                                </label>

                                            </div>
                                        </div>
                                    )}

                                    {/* If user has a backup executor, show input fields */}
                                    {formData.hasBackupExecutor === 'yes' && formData.executorNomination === 'yes' && (
                                        <div className="backup-executor-row">
                                            <label>
                                                Enter Backup Executor Name:
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.backupExecutor.name}
                                                    onChange={(e) => handleNestedChange(e, 'backupExecutor')}
                                                />
                                            </label>
                                            <label>
                                                Enter Backup Executor Address:
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.backupExecutor.address}
                                                    onChange={(e) => handleNestedChange(e, 'backupExecutor')}
                                                />
                                            </label>
                                            <label>
                                                Enter Relation:
                                                <input
                                                    type="text"
                                                    name="relation"
                                                    value={formData.backupExecutor.relation}
                                                    onChange={(e) => handleNestedChange(e, 'backupExecutor')}
                                                />
                                            </label>
                                        </div>
                                    )}


                                    {/* Buttons for navigating through form sections */}
                                    <div className="button-container1">
                                        <button type="button" className="previous-button1" onClick={handlePrev}>
                                            Previous
                                        </button>
                                        <div className="right-buttons1">
                                            <button
                                                type="button"
                                                className="save-button1"
                                                style={styles.saveButton}
                                                onClick={submitFormData}
                                            >
                                                Submit
                                            </button>

                                        </div>
                                    </div>
                                    {/* Loading state */}
                                    {isLoading && (
                                        <div className="loading-container">
                                            <div className="spinner"></div>
                                            <p>Loading, please wait.....</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }


                </form >

                {
                    popup.message && (
                        <div style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            zIndex: '1000',
                            textAlign: 'center',
                        }}>
                            <p>{popup.message}</p>
                            {popup.balance < 20 && (
                                <button onClick={redirectToPreviousPage} style={{
                                    marginTop: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}>
                                    Recharge Now
                                </button>
                            )}
                            {
                                popup.balance > 20 && (
                                    <button onClick={pdfDownload} style={{
                                        marginTop: '10px',
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}>
                                        Downdload Pdf
                                    </button>
                                )
                            }
                            {/* <button onClick={redirectToPreviousPage} style={{
                                marginTop: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px'
                            }}>
                                Recharge Now
                            </button> */}
                            <button onClick={handleClosePopup} style={{
                                marginTop: '10px',
                                padding: '5px 10px',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px'
                            }}>
                                Close
                            </button>
                        </div>
                    )
                }
                < div style={styles.container} >

                    {/* Display the success message in a popup when data is saved */}
                    {
                        isSuccess && (
                            <div style={styles.overlay}>
                                <div style={styles.popup}>
                                    <h2 style={styles.popupHeader}>Success!</h2>
                                    <p>{message}</p>
                                    <button style={styles.closeButton} onClick={() => setIsSuccess(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        )
                    }

                </div >
                {pdfLink && (
                    <div>
                        <h3>PDF Preview:</h3>
                        <iframe
                            src={pdfLink}
                            title="PDF Viewer"
                            width="100%"
                            height="500px"
                        ></iframe>

                        {/* Download Button */}
                        <button>
                            Download PDF
                        </button>
                    </div>
                )}
            </div >

        </>

    );
};
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
    },
    header: {
        textAlign: 'center',
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px',
    },

    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
    },
    popupHeader: {
        fontSize: '24px',
        color: '#28a745',  // Green for success
        marginBottom: '15px',
    },
    closeButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '20px',
    },
};
export default WillForm;
