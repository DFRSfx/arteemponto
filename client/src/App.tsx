import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import GlobalConfirmModal from './components/GlobalConfirmModal';
import MarketingConsent from './components/MarketingConsent'; // <--- IMPORTAR AQUI

import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFail from './pages/CheckoutFail';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import AdminApp from './admin/AdminApp';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './components/ResetPassword';
import TrackOrder from './pages/TrackOrder';

// import About from './pages/About';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastProvider>
          <FavoritesProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <GlobalConfirmModal />
                <MarketingConsent /> {/* <--- ADICIONAR AQUI */}
                
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={<AdminApp />} />

                  {/* Public Routes */}
                  <Route path="/*" element={
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/loja" element={<Shop />} />
                          <Route path="/loja/:categorySlug" element={<Shop />} />
                          <Route path="/produto/:id" element={<Product />} />
                          <Route path="/carrinho" element={<Cart />} />
                          <Route path="/finalizar-compra" element={<Checkout />} />
                          <Route path="/checkout/success" element={<CheckoutSuccess />} />
                          <Route path="/checkout/fail" element={<CheckoutFail />} />
                          <Route path="/contacto" element={<Contact />} />
                          <Route path="/perfil" element={<Profile />} />
                          <Route path="/encomendas" element={<Orders />} />
                          <Route path="/favoritos" element={<Favorites />} />
                          <Route path="/verificar-email" element={<VerifyEmail />} />
                          <Route path="/redefinir-senha" element={<ResetPassword />} />
                          <Route path="/track-order/:token" element={<TrackOrder />} />
                          {/* <Route path="/sobre" element={<About />} /> */}
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  } />
                </Routes>
              </Router>
            </CartProvider>
          </FavoritesProvider>
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;