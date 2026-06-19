import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Technology from "./pages/Technology";
import Collaboration from "./pages/Collaboration";
import News from "./pages/News";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import CancerReport from "./pages/CancerReport";
import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";

const QCM_WEB_URL = import.meta.env.VITE_QCM_WEB_URL || "http://localhost:5174";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Redirect helper to route user to QCM Web
function ExternalRedirect({ pathPattern }) {
  const params = useParams();
  useEffect(() => {
    let targetPath = pathPattern;
    Object.keys(params).forEach((key) => {
      targetPath = targetPath.replace(`:${key}`, params[key]);
    });
    window.location.replace(`${QCM_WEB_URL}${targetPath}`);
  }, [pathPattern, params]);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
      <p>Redirecting to QCM Web...</p>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/products"
                element={<ExternalRedirect pathPattern="/products" />}
              />
              <Route
                path="/products/:id"
                element={<ExternalRedirect pathPattern="/products/:id" />}
              />
              <Route path="/services" element={<Services />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/news" element={<News />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/academic-training"
                element={<ExternalRedirect pathPattern="/academic-training" />}
              />
              <Route path="/cancer-report" element={<CancerReport />} />
              <Route
                path="/dashboard"
                element={<ExternalRedirect pathPattern="/dashboard" />}
              />
              <Route
                path="/checkout"
                element={<ExternalRedirect pathPattern="/checkout" />}
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LanguageProvider>
    </UserProvider>
  );
}

export default App;
