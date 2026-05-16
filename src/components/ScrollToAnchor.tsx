import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToAnchor = () => {
  const { pathname, hash } = useLocation();
  const lastHashRef = useRef<string>("");

  useEffect(() => {
    // If we have a hash, scroll to that element
    if (hash) {
      // Only scroll if the hash has actually changed to avoid repetitive scrolling
      if (lastHashRef.current !== hash) {
        const element = document.querySelector(hash);
        if (element) {
          // Use a small timeout to ensure the element is properly mounted and rendered
          const timer = setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
          lastHashRef.current = hash;
          return () => clearTimeout(timer);
        }
      }
    } else {
      // No hash: If we just navigated to a new page (pathname changed)
      // and there's no hash, scroll to the absolute top.
      // We skip the smooth scroll on the very first mount if the browser 
      // is likely handling scroll restoration correctly.
      if (lastHashRef.current !== "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        lastHashRef.current = "";
      }
    }
  }, [pathname, hash]);

  return null;
};
