import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RefreshOnNavigation = () => {
  const location = useLocation();

  useEffect(() => {
    // Only reload if the pathname has actually changed
    if (location.pathname !== window.location.pathname) {
      window.location.reload();
    }
  }, [location.pathname]); // Triggers reload when path changes

  return null; // This component doesn't render anything
};

export default RefreshOnNavigation;