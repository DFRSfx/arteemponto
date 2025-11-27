import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SEO
        title="Pagamento Concluído com Sucesso"
        description="O seu pagamento foi processado com sucesso"
        canonical="/checkout/success"
        ogType="website"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Concluído com Sucesso! 🎉
          </h1>

          <p className="text-gray-600 mb-8">
            O seu pagamento foi processado com sucesso e a sua encomenda está confirmada.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Número da Encomenda</p>
              <p className="text-2xl font-bold text-primary-600">#{orderId}</p>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-8">
            <p>✅ Pagamento confirmado</p>
            <p>📧 Receberá um email de confirmação em breve</p>
            <p>📦 A sua encomenda será processada nas próximas horas</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              Voltar ao Início
            </Link>
            <Link
              to="/encomendas"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Ver Encomendas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
