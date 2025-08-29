import React from "react";
import { useNavigate } from "react-router-dom";

function RestoreDeepLink() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const encoded = sp.get("__r");
    if (!encoded) return;

    const path = decodeURIComponent(encoded);
    // Strip the ?__r=... from the URL and navigate internally
    navigate(path, { replace: true });
  }, [navigate]);

  return null;
}

export default RestoreDeepLink;