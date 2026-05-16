/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MainLayout } from "./components/MainLayout";
import { HomePage } from "./_pages/HomePage";
import { BlogListPage } from "./_pages/BlogListPage";
import { BlogDetailsPage } from "./_pages/BlogDetailsPage";
import { ProjectListPage } from "./_pages/ProjectListPage";
import { ThemeProvider } from "./context/ThemeContext";
import { ScrollToAnchor } from "./components/ScrollToAnchor";
import { ScrollProgress } from "./components/ScrollProgress";
import { LanguageRedirect, LanguageLayout } from "./i18n";

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToAnchor />
          <ScrollProgress />
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<LanguageRedirect />} />

            {/* Language-prefixed routes */}
            <Route path="/:lang" element={<LanguageLayout />}>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="blog" element={<BlogListPage />} />
                <Route path="blog/:slug" element={<BlogDetailsPage />} />
                <Route path="projects" element={<ProjectListPage />} />
              </Route>
            </Route>

            {/* Fallback for invalid locales */}
            <Route path="*" element={<Navigate to="/en/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
