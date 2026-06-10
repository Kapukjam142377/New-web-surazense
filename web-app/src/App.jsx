import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import Technology from "./pages/Technology";
import Collaboration from "./pages/Collaboration";
import News from "./pages/News";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AcademicTraining from "./pages/AcademicTraining";
import CancerReport from "./pages/CancerReport";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/news" element={<News />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/academic-training"
                  element={<AcademicTraining />}
                />
                <Route path="/cancer-report" element={<CancerReport />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </UserProvider>
  );
}

export default App;
