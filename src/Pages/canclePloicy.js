import React from 'react';

const CancellationPolicy = () => {
  return (
    <div className="cancellation-policy-container">
      <h1>Cancellation and Refund Policy</h1>
      <p>This Cancellation and Refund Policy outlines the terms and conditions related to cancellations and refunds for services provided by Six Steps through lmnopservices.com (the "Website").</p>

      <h2>1. No Cancellation After Service Activation</h2>
      <p>Due to the nature of our services, which involve automated will generation based on user-provided information, cancellations are generally not permitted once the service has been activated.</p>

      <h2>2. Service Activation</h2>
      <p>Service activation occurs when the user confirms that all the information entered during the will generation process is accurate and complete. By confirming this information, the user acknowledges that the service has been initiated and agrees to the terms of this Cancellation and Refund Policy.</p>

      <h2>3. Refund for Non-Delivery of Service</h2>
      <p>A full refund will be issued if:</p>
      <ul>
        <li>No service is provided: Despite the user confirming accurate information and activating the service, the user does not receive the generated will document.</li>
        <li>Payment is deducted without service initiation: In the event that payment is deducted from the user's account but the service is not initiated (e.g., due to technical issues on our end), a full refund will be issued.</li>
      </ul>

      <h2>4. No Refund for Completed Services</h2>
      <p>Once the generated will document has been successfully delivered to the user, no refunds will be issued under any circumstances.</p>

      <h2>5. Dispute Resolution</h2>
      <p>Any disputes regarding cancellations or refunds will be resolved in accordance with the dispute resolution clause outlined in our Terms of Service.</p>

      <h2>6. Contact Us</h2>
      <p>For any inquiries regarding cancellations or refunds, please contact us using the contact info provided or write to <a href="mailto:sales@sixsteps.org.in">sales@sixsteps.org.in</a>.</p>
    </div>
  );
};

export default CancellationPolicy;
