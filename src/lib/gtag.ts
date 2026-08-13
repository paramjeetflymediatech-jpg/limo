export const triggerPhoneGtagConversion = () => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    // Google Ads Call Conversion
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18232168688/O0CqCPrZ5t8cEPCh4_VD",
      value: 1.0,
      currency: "CAD",
    });
    
    // Configured Tag ID conversion backup
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18230429386",
    });

    // Custom Event for GA4 / GTM
    (window as any).gtag("event", "phone_call_click", {
      event_category: "engagement",
      event_label: "Phone Call Click",
    });
  }
};
