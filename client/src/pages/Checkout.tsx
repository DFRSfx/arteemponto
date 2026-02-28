import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Banknote, MapPin, Plus, User, Mail, AlertCircle, Wallet, X, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthModal from '../components/AuthModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const stripeAppearance: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#7D3C0F',
    colorBackground: '#ffffff',
    colorText: '#1f2937',
    colorDanger: '#dc2626',
    colorTextSecondary: '#6b7280',
    colorTextPlaceholder: '#9ca3af',
    fontFamily: '"Urbanist", "Open Sans", sans-serif',
    fontSizeBase: '15px',
    borderRadius: '8px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid #d1d5db',
      boxShadow: 'none',
      padding: '10px 12px',
      backgroundColor: '#f9fafb',
      transition: 'border-color 0.15s, background-color 0.15s',
    },
    '.Input:focus': {
      border: '1px solid #7D3C0F',
      boxShadow: '0 0 0 3px rgba(125, 60, 15, 0.12)',
      backgroundColor: '#ffffff',
    },
    '.Input--invalid': {
      border: '1px solid #dc2626',
      boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '5px',
      color: '#374151',
    },
    '.Error': {
      color: '#dc2626',
      fontSize: '13px',
    },
  },
};

const stripeFonts = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600&display=swap' },
];

interface ShippingAddress {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

// ---------------------------------------------------------------------------
// Stripe payment form (rendered inside <Elements>)
// ---------------------------------------------------------------------------
interface MultibancoReference {
  entity: string;
  reference: string;
  value: number;
  paymentIntentId: string;
}

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onClose: () => void;
  onReference?: (data: MultibancoReference) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onClose, onReference }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [confirming, setConfirming] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setConfirming(true);
    setPayError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`
      },
      redirect: 'if_required'
    });

    if (error) {
      setPayError(error.message ?? 'Erro no pagamento');
      setConfirming(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else if (paymentIntent?.status === 'requires_action') {
      // Multibanco: Stripe returns entity + reference in next_action
      const details = (paymentIntent as any).next_action?.multibanco_display_details;
      if (details && onReference) {
        onReference({ entity: details.entity, reference: details.reference, value: amount, paymentIntentId: paymentIntent.id });
      } else {
        setPayError('Ação adicional necessária. Por favor tente novamente.');
        setConfirming(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Loading skeleton */}
      {!isReady && (
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
          <div className="h-11 bg-gray-100 rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
              <div className="h-11 bg-gray-100 rounded-lg" />
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-12 mb-1" />
              <div className="h-11 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Stripe PaymentElement */}
      <div className={`px-6 pt-6 ${isReady ? 'block' : 'hidden'}`}>
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            defaultValues: {
              billingDetails: { address: { country: 'PT' } }
            }
          }}
        />
      </div>

      {/* Error */}
      {payError && (
        <div className="mx-6 mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-700 text-sm">{payError}</p>
        </div>
      )}

      {/* Amount + buttons */}
      <div className="px-6 py-5 mt-3 border-t bg-gray-50 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total a pagar</span>
          <span className="text-xl font-bold text-primary-600">{amount.toFixed(2)} €</span>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!stripe || confirming || !isReady}
            className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {confirming && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirming ? 'A processar...' : `Pagar ${amount.toFixed(2)} €`}
          </button>
        </div>
      </div>
    </form>
  );
};

// ---------------------------------------------------------------------------
// Main Checkout component
// ---------------------------------------------------------------------------
const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState('multibanco');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  // Stripe Elements modal state
  const [stripeModal, setStripeModal] = useState<{ clientSecret: string; amount: number } | null>(null);

  const finalTotal = total; // Price already includes IVA
  const subtotalExVat = total / 1.23;
  const ivaAmount = total - subtotalExVat;
  const API_BASE_URL = '/api';

  // Load saved addresses if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedAddresses();
      setCustomerInfo(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || ''
      }));
    } else {
      const timer = setTimeout(() => {
        setShowGuestWarning(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  // Load saved data from localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      const savedData = localStorage.getItem('guest_checkout_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setCustomerInfo(parsed);
      }
    }
  }, [isAuthenticated]);

  const loadSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shipping-addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const addresses = await response.json();
        setSavedAddresses(addresses);

        const defaultAddr = addresses.find((addr: ShippingAddress) => addr.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          selectAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const selectAddress = (addr: ShippingAddress) => {
    setCustomerInfo(prev => ({
      ...prev,
      address: addr.address,
      city: addr.city,
      postalCode: addr.postal_code,
      phone: addr.phone
    }));
    setShowNewAddressForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate required fields
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone ||
          !customerInfo.address || !customerInfo.city || !customerInfo.postalCode) {
        showError('Por favor preencha todos os campos obrigatórios');
        setIsProcessing(false);
        return;
      }

      // Save guest data to localStorage
      if (!isAuthenticated) {
        localStorage.setItem('guest_checkout_data', JSON.stringify(customerInfo));
      }

      // Guard against zero total
      if (finalTotal <= 0) {
        showError('Total do pedido inválido. Por favor refresque a página e tente novamente.');
        setIsProcessing(false);
        return;
      }

      // Initialize payment — order is NOT created yet, only after payment succeeds
      const initResponse = await fetch(`${API_BASE_URL}/payment/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          customer_address: customerInfo.address,
          customer_city: customerInfo.city,
          customer_postal_code: customerInfo.postalCode,
          payment_method: selectedPayment,
          items: items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          })),
          user_id: user?.id || null,
          save_address: isAuthenticated && saveAddress
        })
      });

      const initData = await initResponse.json();

      if (!initResponse.ok) {
        const errMsg = initData?.error ||
          (initData?.errors ? initData.errors.map((e: any) => e.msg).join(', ') : null) ||
          'Erro ao criar pagamento';
        throw new Error(errMsg);
      }

      setStripeModal({ clientSecret: initData.clientSecret, amount: initData.amount });
    } catch (error: any) {
      console.error('Error initializing payment:', error);
      showError(error.message || 'Erro ao processar pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !paymentReference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Carrinho vazio
          </h2>
          <Link to="/loja" className="text-primary-600 hover:text-primary-700">
            Voltar à loja
          </Link>
        </div>
      </div>
    );
  }

  if (paymentReference) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO
          title="Pedido Criado com Sucesso"
          description="O seu pedido foi criado com sucesso"
          canonical="/checkout"
          ogType="website"
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pedido Criado com Sucesso!
            </h2>

            <p className="text-gray-600 mb-8">
              Seu pedido foi registado e está aguardando pagamento.
              Use os dados abaixo para efetuar o pagamento:
            </p>

            {/* Payment Instructions */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-lg mb-4 text-center">
                Dados para Pagamento - {paymentReference.method === 'multibanco' ? 'Multibanco' : 'MB WAY'}
              </h3>

              {paymentReference.method === 'multibanco' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Entidade:</span>
                    <span className="font-mono text-lg">{paymentReference.entity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Referência:</span>
                    <span className="font-mono text-lg">{paymentReference.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Valor:</span>
                    <span className="font-mono text-lg">{paymentReference.value.toFixed(2)}€</span>
                  </div>
                </div>
              )}

              {paymentReference.method === 'mbway' && (
                <div className="text-center">
                  <p className="mb-4">Verifique a sua app MB WAY para autorizar o pagamento</p>
                  <p className="font-mono text-lg font-bold">{paymentReference.value.toFixed(2)}€</p>
                  <p className="text-sm text-gray-600 mt-2">{paymentReference.message}</p>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-blue-800 mb-1">
                      📧 Link de Tracking Enviado
                    </h4>
                    <p className="text-xs text-blue-700 mb-2">
                      Enviámos um email para <strong>{customerInfo.email}</strong> com um link único para acompanhar a sua encomenda.
                    </p>
                    <p className="text-xs text-blue-600">
                      Guarde este email para consultar o estado da sua encomenda a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600 mb-6">
              <p>O seu pedido será processado automaticamente após confirmação do pagamento.</p>
              <p>Receberá um email de confirmação em breve.</p>
            </div>

            <div className="flex gap-4">
              <Link
                to="/"
                className="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                Voltar ao Início
              </Link>
              {isAuthenticated && (
                <Link
                  to="/encomendas"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Ver Encomendas
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Checkout - Finalizar Compra"
        description="Finalize sua compra de forma segura. Aceitamos Multibanco, MB WAY e cartão de crédito."
        canonical="/checkout"
        ogType="website"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/carrinho"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Carrinho
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        {/* Guest Warning */}
        {showGuestWarning && !isAuthenticated && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  💡 Crie uma conta para uma melhor experiência!
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Ao criar conta, poderá:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Guardar endereços de entrega para compras futuras</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Ver histórico completo de encomendas</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Acompanhar encomendas sem precisar de links</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Receber ofertas personalizadas</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Criar Conta Agora
                  </button>
                  <button
                    onClick={() => setShowGuestWarning(false)}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Continuar como Convidado
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Sem conta, receberá um link por email para acompanhar a encomenda
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Saved Addresses - Only for authenticated users */}
              {isAuthenticated && savedAddresses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Moradas Guardadas</h3>
                  <div className="space-y-2 mb-4">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => {
                            setSelectedAddressId(addr.id);
                            selectAddress(addr);
                          }}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{addr.name}</span>
                            {addr.is_default && (
                              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                                Predefinida
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{addr.address}</p>
                          <p className="text-sm text-gray-600">
                            {addr.postal_code} {addr.city}
                          </p>
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewAddressForm(!showNewAddressForm);
                      setSelectedAddressId(null);
                    }}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    {showNewAddressForm ? 'Usar morada guardada' : 'Usar nova morada'}
                  </button>
                </div>
              )}

              {/* Customer Information */}
              {(showNewAddressForm || savedAddresses.length === 0) && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="919626697"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Endereço de Entrega</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Endereço *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerInfo.city}
                            onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código Postal *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerInfo.postalCode}
                            onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                            placeholder="1234-567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Address Checkbox - Only for authenticated users */}
                    {isAuthenticated && showNewAddressForm && (
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={saveAddress}
                            onChange={(e) => setSaveAddress(e.target.checked)}
                            className="w-4 h-4 text-primary-600 bg-gray-50 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Guardar esta morada para futuras compras
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="multibanco"
                      checked={selectedPayment === 'multibanco'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <Banknote className="h-6 w-6 mr-3 text-gray-600" />
                    <span className="font-medium">Multibanco</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="mbway"
                      checked={selectedPayment === 'mbway'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <Smartphone className="h-6 w-6 mr-3 text-gray-600" />
                    <span className="font-medium">MB WAY</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === 'card'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="h-6 w-6 mr-3 text-gray-600" />
                    <span className="font-medium">Cartão de Crédito/Débito</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="googlepay"
                      checked={selectedPayment === 'googlepay'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <Wallet className="h-6 w-6 mr-3 text-gray-600" />
                    <span className="font-medium">Google Pay</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="applepay"
                      checked={selectedPayment === 'applepay'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <Wallet className="h-6 w-6 mr-3 text-gray-600" />
                    <span className="font-medium">Apple Pay</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isProcessing ? 'A Processar...' : 'Criar Pedido'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    {item.selectedColor && (
                      <p className="text-sm text-gray-600">Cor: {item.selectedColor}</p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">
                    {(item.product.price * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal (s/ IVA)</span>
                <span>{subtotalExVat.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Envio</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (23%)</span>
                <span>{ivaAmount.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total (c/ IVA)</span>
                <span className="text-primary-600">{finalTotal.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />

      {/* Stripe Elements modal (card / Google Pay / Apple Pay) */}
      {stripeModal && (
        <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out"
    role="dialog"
    aria-modal="true"
    aria-labelledby="stripe-modal-title"
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden transform transition-all scale-100 opacity-100">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
            <Lock className="h-4 w-4 text-green-600" aria-hidden="true" />
          </div>
          <div>
            <h2 id="stripe-modal-title" className="font-semibold text-gray-900 text-sm leading-tight">
              Pagamento Seguro
            </h2>
            <p className="text-xs text-gray-500 leading-tight">Encriptado por Stripe</p>
          </div>
        </div>
        <button
          onClick={() => { setStripeModal(null); }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600"
          aria-label="Cancelar pagamento"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: stripeModal.clientSecret,
                locale: 'pt',
                appearance: stripeAppearance,
                fonts: stripeFonts,
              }}
            >
              <StripePaymentForm
                amount={stripeModal.amount}
                onSuccess={async (paymentIntentId) => {
                  setStripeModal(null);
                  try {
                    const orderRes = await fetch(`${API_BASE_URL}/payment/finalize`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ payment_intent_id: paymentIntentId })
                    });
                    const order = await orderRes.json();
                    clearCart();
                    navigate(`/checkout/success?token=${order.tracking_token}`);
                  } catch {
                    clearCart();
                    navigate('/checkout/success');
                  }
                }}
                onReference={async (data) => {
                  let orderId: number | undefined;
                  try {
                    const orderRes = await fetch(`${API_BASE_URL}/payment/finalize`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ payment_intent_id: data.paymentIntentId })
                    });
                    const order = await orderRes.json();
                    orderId = order.id;
                    if (orderId) {
                      fetch(`/api/orders/${orderId}/payment-reference`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ entity: data.entity, reference: data.reference })
                      }).catch(console.error);
                    }
                  } catch (err) {
                    console.error('Error creating order:', err);
                  }
                  setStripeModal(null);
                  clearCart();
                  success('Pedido criado com sucesso!');
                  setPaymentReference({
                    method: 'multibanco',
                    entity: data.entity,
                    reference: data.reference,
                    value: data.value,
                    orderId
                  });
                }}
                onClose={() => { setStripeModal(null); }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
