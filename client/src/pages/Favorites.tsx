import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, ShoppingCart, Trash2 } from 'lucide-react';
import { mockProducts } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Mock favorites - substituir com dados reais do localStorage ou API
  const [favorites, setFavorites] = useState<Product[]>(
    mockProducts.slice(0, 4) // Apenas para demonstração
  );

  const removeFavorite = (productId: string) => {
    setFavorites(favorites.filter((p) => p.id !== productId));
    // TODO: Atualizar localStorage ou API
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
  };

  const clearAllFavorites = () => {
    if (window.confirm('Tem a certeza que deseja remover todos os favoritos?')) {
      setFavorites([]);
      // TODO: Atualizar localStorage ou API
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary-600 fill-current" />
              Os Meus Favoritos
            </h1>
            <p className="text-gray-600 mt-2">
              {favorites.length === 0
                ? 'Ainda não tem favoritos guardados'
                : `${favorites.length} ${favorites.length === 1 ? 'produto' : 'produtos'} guardado${
                    favorites.length === 1 ? '' : 's'
                  }`}
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Limpar Favoritos
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Ainda sem favoritos
              </h3>
              <p className="text-gray-600 mb-8">
                Explore a nossa loja e adicione produtos à sua lista de favoritos para os encontrar
                facilmente mais tarde.
              </p>
              <button
                onClick={() => navigate('/loja')}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Explorar Produtos
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remover dos favoritos"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>

                {/* Product Image */}
                <div
                  onClick={() => navigate(`/produto/${product.id}`)}
                  className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Destaque
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <h3
                    onClick={() => navigate(`/produto/${product.id}`)}
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">
                        {product.price.toFixed(2)}€
                      </span>
                      {product.stock > 0 ? (
                        <p className="text-xs text-green-600 mt-1">Em stock</p>
                      ) : (
                        <p className="text-xs text-red-600 mt-1">Esgotado</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      aria-label="Adicionar ao carrinho"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {favorites.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/loja')}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors font-semibold"
            >
              Continuar a Comprar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
