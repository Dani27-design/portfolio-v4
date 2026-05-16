import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CustomCursor } from "./CustomCursor";
import { ScrollToTop } from "./ScrollToTop";

export const MainLayout: React.FC = () => {
  return (
    <div id="top" className="min-h-screen selection:bg-blue-100 selection:text-primary transition-colors duration-300">
      <CustomCursor />
      <ScrollToTop />
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
