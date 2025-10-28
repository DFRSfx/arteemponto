import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import AdminApp from './admin/AdminApp';
// import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
          <ScrollToTop />
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
                    <Route path="/produto/:id" element={<Product />} />
                    <Route path="/carrinho" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="/encomendas" element={<Orders />} />
                    <Route path="/favoritos" element={<Favorites />} />
                    {/* <Route path="/sobre" element={<About />} /> */}
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;