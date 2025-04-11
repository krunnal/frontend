import React, { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    // Initialize Tawk.to
    const Tawk_API = window.Tawk_API || {};
    const Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/678de557825083258e07ad17/1ii14fnq1";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      // Cleanup to avoid multiple instances
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default TawkToChat;
