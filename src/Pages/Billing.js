import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import axios from 'axios';
import '../css/billing.css'

const PaymentDetails = () => {
  const [userData, setUserData] = useState({
    Balance: '',
  });
  const [paymentInfo, setPaymentInfo] = useState(); // State for Payment Info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalence] = useState()
  const [coupons, setCoupan] = useState()

  const navigate = useNavigate(); // Hook for navigation

  // URL for your API Gateway endpoint
  const API_URL = 'https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization';

  // Retrieve the JWT token from sessionStorage
  const jwtToken = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual item type if dynamic

        if (!jwtToken) {
          throw new Error('JWT token is missing.');
        }
        const eventData = { action: 'getDocuments', product_id: 'None', subaction: 'UserAttributes', ItemType: 'UserAttributes' }
        // Fetching User Data (Balance)
        const response = await fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
        // Assuming balance is returned in response
        const data = await response.json();
        console.log(data, "dadadadadadaddaddadadad")
        if (data.success && Array.isArray(data.documents) && data.documents.length > 0) {
          const userDocument = data.documents[0];
          const balance = userDocument.Balance?.N || "0";
          const coupons = userDocument.Coupons?.N || "0";

          setBalence(balance);
          setCoupan(coupons);
        } else {
          console.warn("No documents found or invalid structure. Setting defaults.");
          setBalence("0");
          setCoupan("0");
        }

        // Fetching Payment Information
        const eventData1 = { action: 'getDocuments', product_id: 'None', subaction: 'PaymentInfo', ItemType: 'PaymentInfo' }
        const responsepay = await fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/text_summarization', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData1),
        });
        // Assuming payment info is returned as an array
        const data1 = await responsepay.json();
        console.log(data1, '------------------------------------------>')
        const payments = data1.documents;
        console.log(payments, 'payments')
        // Sorting payments by PaymentCompletedTime in descending order (latest first)

        setPaymentInfo(payments);
        setLoading(false);

      } catch (err) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [jwtToken]);

  // Handle navigation to the view page (or order details page) and send specific data by OrderId
  const handleViewOrder = (orderId) => {
    // Find the payment data associated with the specific OrderId
    const selectedPayment = paymentInfo.find(payment => payment.OrderId === orderId);

    // If the payment data is found, navigate to the Invoice page with the selected data
    if (selectedPayment) {
      navigate(`/order`, { state: { orderData: selectedPayment } });
    }
  };

  // Handle navigation to payment page
  const handleRecharge = () => {
    navigate('/pay'); // This navigates to the payment page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="payment-details-container">

      <div className="balance-container">
        <div className="account-balance with-line">Balance:{balance}</div>
        <div className="account-balance with-line">Coupons:{coupons}</div>

        <div className="recharge-btn-container">
          <button onClick={handleRecharge} className="recharge-btn">Recharge</button>
        </div>

      </div>

      <div className="payment-info">
        {/* Display Payment Information in Table */}
        {paymentInfo.length > 0 ? (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Currency</th>
                <th>Payment ID</th>
                <th className="order-id-column">Order ID</th>
                <th>Status</th>
                <th>Payment Completed Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentInfo.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.Amount ? payment.Amount.N : 'N/A'}</td> {/* Amount is in {N: 'value'} */}
                  <td>{payment.Currency ? payment.Currency.S : 'N/A'}</td> {/* Currency is in {S: 'value'} */}
                  <td>{payment.PaymentId ? payment.PaymentId.S : 'N/A'}</td> {/* PaymentId is in {S: 'value'} */}
                  <td className="order-id-column">{payment.OrderId ? payment.OrderId.S : 'N/A'}</td> {/* OrderId is in {S: 'value'} */}
                  <td>{payment.PaymentStatus ? payment.PaymentStatus.S : 'N/A'}</td> {/* PaymentStatus is in {S: 'value'} */}
                  <td>
                    {payment.PaymentCompletedTime
                      ? new Date(payment.PaymentCompletedTime.S).toLocaleDateString()
                      : 'N/A'} {/* PaymentCompletedTime is in {S: 'ISO date'} */}
                  </td>
                  <td>
                    <button onClick={() => handleViewOrder(payment.OrderId.S)} className="view-btn">
                      View
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

        ) : (
          <p>No payment history available.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
