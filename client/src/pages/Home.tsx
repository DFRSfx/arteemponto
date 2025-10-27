import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Grid2x2, Maximize2 } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';

const Home: React.FC = () => {
  const [featuredViewMode, setFeaturedViewMode] = useState<'grid' | 'fullscreen'>('grid');
  const [newViewMode, setNewViewMode] = useState<'grid' | 'fullscreen'>('grid');
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 4);
  const newProducts = mockProducts.filter(product => product.new).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seleção especial das nossas peças mais populares e procuradas
            </p>
          </div>

          {/* View Mode Toggle - Mobile Only */}
          <div className="flex justify-center mb-6 sm:hidden">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setFeaturedViewMode('grid')}
                className={`p-2 ${featuredViewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                title="2x2 Grid"
              >
                <Grid2x2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setFeaturedViewMode('fullscreen')}
                className={`p-2 ${featuredViewMode === 'fullscreen' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                title="Tela Cheia"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {featuredViewMode === 'fullscreen' ? (
            <div className="sm:hidden space-y-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="fullscreen" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={featuredViewMode} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/loja"
              className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-md hover:bg-primary-50 transition-colors"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Novidades
            </h2>
            <p className="text-lg text-gray-600">
              As mais recentes criações do nosso ateliê
            </p>
          </div>

          {/* View Mode Toggle - Mobile Only */}
          <div className="flex justify-center mb-6 sm:hidden">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setNewViewMode('grid')}
                className={`p-2 ${newViewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                title="2x2 Grid"
              >
                <Grid2x2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setNewViewMode('fullscreen')}
                className={`p-2 ${newViewMode === 'fullscreen' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                title="Tela Cheia"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {newViewMode === 'fullscreen' ? (
            <div className="sm:hidden space-y-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="fullscreen" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={newViewMode} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feito à Mão</h3>
              <p className="text-gray-600">
                Cada peça é cuidadosamente criada à mão com amor e dedicação
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualidade Premium</h3>
              <p className="text-gray-600">
                Utilizamos apenas materiais de alta qualidade e técnicas tradicionais
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Peças Únicas</h3>
              <p className="text-gray-600">
                Designs exclusivos que não encontra em mais lugar nenhum
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Descobrir?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Explore a nossa coleção completa de produtos artesanais de crochê
          </p>
          <Link
            to="/loja"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-md hover:bg-gray-100 transition-colors"
          >
            Explorar Loja
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;