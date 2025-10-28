import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface OrderItem {
  id: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

const Orders: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Mock data - substituir com dados reais da API
  const [orders] = useState<Order[]>([
    {
      id: 1001,
      date: '2025-01-15',
      status: 'delivered',
      total: 45.99,
      items: [
        {
          id: 1,
          productName: 'Toalha Bordada Premium',
          productImage: '/images/products/toalha1.jpg',
          quantity: 2,
          price: 22.99,
        },
      ],
      shippingAddress: 'Rua Example, 123, Lisboa',
      paymentMethod: 'Cartão de Crédito',
    },
    {
      id: 1002,
      date: '2025-01-10',
      status: 'shipped',
      total: 78.50,
      items: [
        {
          id: 2,
          productName: 'Guardanapo Set 6un',
          productImage: '/images/products/guardanapo1.jpg',
          quantity: 1,
          price: 34.99,
        },
        {
          id: 3,
          productName: 'Almofada Decorativa',
          productImage: '/images/products/almofada1.jpg',
          quantity: 1,
          price: 43.51,
        },
      ],
      shippingAddress: 'Av. da Liberdade, 456, Porto',
      paymentMethod: 'MB WAY',
    },
    {
      id: 1003,
      date: '2025-01-05',
      status: 'processing',
      total: 29.99,
      items: [
        {
          id: 4,
          productName: 'Pano de Cozinha Artesanal',
          productImage: '/images/products/pano1.jpg',
          quantity: 3,
          price: 9.99,
        },
      ],
      shippingAddress: 'Rua Example, 123, Lisboa',
      paymentMethod: 'Transferência Bancária',
    },
  ]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: {
        label: 'Pendente',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
      },
      processing: {
        label: 'Em Processamento',
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      shipped: {
        label: 'Enviada',
        icon: Truck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
      },
      delivered: {
        label: 'Entregue',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
      cancelled: {
        label: 'Cancelada',
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      },
    };
    return configs[status];
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">As Minhas Encomendas</h1>
          <p className="text-gray-600 mt-2">Acompanhe o estado das suas encomendas</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sem encomendas</h3>
            <p className="text-gray-600 mb-6">Ainda não realizou nenhuma encomenda.</p>
            <button
              onClick={() => navigate('/loja')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div
                    onClick={() => toggleOrder(order.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div>
                          <p className="text-sm text-gray-500">Encomenda</p>
                          <p className="font-semibold text-gray-900">#{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.date).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-semibold text-gray-900">{order.total.toFixed(2)}€</p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-4">Produtos</h4>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 bg-white p-4 rounded-lg"
                              >
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-20 h-20 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.src = '/images/placeholder.jpg';
                                  }}
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.productName}</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Quantidade: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  {item.price.toFixed(2)}€
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Informações</h4>
                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg">
                              <p className="text-sm text-gray-500 mb-1">Morada de Envio</p>
                              <p className="text-sm text-gray-900">{order.shippingAddress}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <p className="text-sm text-gray-500 mb-1">Método de Pagamento</p>
                              <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <p className="text-sm text-gray-500 mb-1">Total</p>
                              <p className="text-lg font-bold text-primary-600">
                                {order.total.toFixed(2)}€
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            <Eye className="h-4 w-4" />
                            Ver Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
