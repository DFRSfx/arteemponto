import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.product.id);
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {item.product.name}
        </h3>
        {item.selectedColor && (
          <p className="text-sm text-gray-600">Cor: {item.selectedColor}</p>
        )}
        <p className="text-lg font-bold text-primary-600 mt-1">
          {item.product.price.toFixed(2)}€
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-1 hover:bg-gray-50 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 text-center min-w-[3rem] border-l border-r border-gray-300">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-1 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.product.id)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="Remover produto"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          {(item.product.price * item.quantity).toFixed(2)}€
        </p>
      </div>
    </div>
  );
};

export default CartItem;