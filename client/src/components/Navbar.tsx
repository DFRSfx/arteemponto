import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { mockProducts } from '../data/products';
import { Product } from '../types';
import AuthModal from './AuthModal';
import { categories } from '../data/categories';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuClosing, setUserMenuClosing] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hasMoved, setHasMoved] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Loja', href: '/loja' },
    // { name: 'Sobre', href: '/sobre' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Close search and menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignorar cliques no botão de busca
      if (searchButtonRef.current && searchButtonRef.current.contains(event.target as Node)) {
        return;
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node) && searchOpen) {
        // Fechar imediatamente
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        handleCloseUserMenu();
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleCloseUserMenu = () => {
    setUserMenuClosing(true);
    setTimeout(() => {
      setUserMenuOpen(false);
      setUserMenuClosing(false);
    }, 300); // Match animation duration
  };

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setUserMenuClosing(true);
    setTimeout(() => {
      setUserMenuOpen(false);
      setUserMenuClosing(false);
    }, 300);
  };

  // Categories drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.touches[0].pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    const x = e.touches[0].pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    if (hasMoved) return; // Não navegar se foi um drag

    setSelectedCategory(selectedCategory === categoryName ? '' : categoryName);
    if (selectedCategory === categoryName) {
      navigate('/loja');
    } else {
      navigate(`/loja?categoria=${encodeURIComponent(categoryName)}`);
    }
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <>
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex-shrink-0">
              <img
                src="/images/logo.webp"
                alt="Arte em Ponto"
                className="h-20 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                item.name === 'Loja' ? (
                  <div key={item.name} className="relative" ref={megaMenuRef}>
                    <button
                      onMouseEnter={() => setMegaMenuOpen(true)}
                      onClick={() => navigate('/loja')}
                      className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      {item.name}
                    </button>

                    {/* Mega Menu */}
                    {megaMenuOpen && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-4xl bg-white rounded-lg shadow-2xl z-50 animate-fadeIn"
                        onMouseEnter={() => setMegaMenuOpen(true)}
                        onMouseLeave={() => setMegaMenuOpen(false)}
                      >
                        <div className="p-8">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6">Explorar Categorias</h3>
                          <div className="grid grid-cols-3 gap-6">
                            {/* Todas as Categorias */}
                            <Link
                              to="/loja"
                              onClick={() => setMegaMenuOpen(false)}
                              className="group relative overflow-hidden rounded-lg hover:shadow-xl transition-all duration-300"
                            >
                              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary-600">Todas</span>
                              </div>
                              <div className="p-4 bg-white">
                                <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                  Todas as Categorias
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">Ver todos os produtos</p>
                              </div>
                            </Link>

                            {/* Categorias com Imagens */}
                            {categories.map((category) => (
                              <Link
                                key={category.name}
                                to={`/loja?categoria=${encodeURIComponent(category.name)}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="group relative overflow-hidden rounded-lg hover:shadow-xl transition-all duration-300"
                              >
                                <div className="aspect-square overflow-hidden">
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-4 bg-white">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                    {category.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Procurar produtos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Search Results Dropdown */}
            {searchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <p className="text-sm font-semibold text-primary-600">{product.price.toFixed(2)}€</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <p>Nenhum produto encontrado</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button
              ref={searchButtonRef}
              onClick={handleSearchToggle}
              className={`md:hidden p-2 transition-colors ${searchOpen ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Heart - Desktop only */}
            <button className="hidden md:block p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Heart className="h-6 w-6" />
            </button>

            <Link
              to="/carrinho"
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop only */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-4 pt-2">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Procurar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

              {/* Mobile Search Results */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 overflow-hidden animate-slideInTop">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <p className="text-sm font-semibold text-primary-600">{product.price.toFixed(2)}€</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <p>Nenhum produto encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Perfil Option */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setUserMenuOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <User className="h-5 w-5" />
                Minha Conta
              </button>

              {/* Favoritos Option */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <Heart className="h-5 w-5" />
                Favoritos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Categories Slider - Always visible */}
      <div className="border-t border-gray-200">
        <div
          ref={categoriesRef}
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 py-4 justify-start md:justify-center min-w-max">
              {/* Categorias */}
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex-shrink-0 pb-2 border-b-2 transition-all duration-300 whitespace-nowrap text-base font-medium ${
                    selectedCategory === category.name
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Menu Sidebar */}
      {userMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${userMenuClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
            onClick={handleCloseUserMenu}
          />

          {/* Sidebar */}
          <div ref={userMenuRef} className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 overflow-y-auto ${userMenuClosing ? 'animate-slideOutRight' : 'animate-slideInRight'}`}>
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleCloseUserMenu}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100 transition-all shadow-md"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Header com gradiente */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex flex-col justify-end p-8 pt-20 pb-10 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Olá!
                </h2>
                <p className="text-white/90 text-sm mb-6">
                  Ainda não és cliente da Arte em Ponto?<br />
                  <span className="text-white/70 text-xs">O registo é fácil e grátis!</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAuthModal('register');
                    }}
                    className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
                  >
                    CRIAR CONTA
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAuthModal('login');
                    }}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 hover:scale-105 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
                  >
                    INICIAR SESSÃO
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                A Minha Conta
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  to="/conta/dados-pessoais"
                  onClick={handleCloseUserMenu}
                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-primary-50 transition-all border border-transparent hover:border-primary-200"
                >
                  <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Dados Pessoais
                    </h4>
                    <p className="text-xs text-gray-500">Gerir informação da conta</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/conta/encomendas"
                  onClick={handleCloseUserMenu}
                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-primary-50 transition-all border border-transparent hover:border-primary-200"
                >
                  <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Encomendas & Faturas
                    </h4>
                    <p className="text-xs text-gray-500">Ver histórico de compras</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/conta/favoritos"
                  onClick={handleCloseUserMenu}
                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-primary-50 transition-all border border-transparent hover:border-primary-200"
                >
                  <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <Heart className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Favoritos
                    </h4>
                    <p className="text-xs text-gray-500">Produtos guardados</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Extra Info Section */}
              <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Benefícios de Cliente
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-0.5">✓</span>
                    <span>Envio grátis em compras acima de 30€</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-0.5">✓</span>
                    <span>Acesso exclusivo a novos produtos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-0.5">✓</span>
                    <span>Promoções especiais</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>

    {/* Auth Modal */}
    <AuthModal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      initialMode={authMode}
    />
    </>
  );
};

export default Navbar;