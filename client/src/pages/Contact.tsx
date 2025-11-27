import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Send, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import { getLocalBusinessSchema, getFAQSchema } from '../utils/schemas';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SEO setup with FAQ schema
  const faqs = [
    {
      question: 'Quanto tempo demora um pedido personalizado?',
      answer: 'Os pedidos personalizados levam entre 2 a 4 semanas, dependendo da complexidade do projeto.',
    },
    {
      question: 'Fazem entregas em todo o país?',
      answer: 'Sim! Fazemos entregas em todo Portugal continental e ilhas.',
    },
    {
      question: 'Que materiais utilizam?',
      answer: 'Utilizamos apenas linhas de alta qualidade, preferencialmente 100% algodão, adequadas para cada tipo de produto.',
    },
    {
      question: 'Posso devolver um produto?',
      answer: 'Sim, aceitamos devoluções até 30 dias após a compra, desde que o produto esteja em perfeitas condições.',
    },
  ];

  const schemas = {
    '@context': 'https://schema.org',
    '@graph': [getLocalBusinessSchema(), getFAQSchema(faqs)],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Contacto"
        description="Entre em contacto com Arte em Ponto. Estamos disponíveis para esclarecer dúvidas, fazer encomendas personalizadas e ajudar com qualquer questão sobre os nossos produtos em crochê."
        canonical="/contacto"
        ogType="website"
        schema={schemas}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contacto</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida sobre os nossos produtos ou gostaria de fazer um pedido personalizado? 
            Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Informações de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefone</h3>
                    <p className="text-gray-600">+351 912 345 678</p>
                    <p className="text-sm text-gray-500">Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a
                      href="mailto:info@arteemponto.pt"
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      info@arteemponto.pt {/* Fixed: no Markdown! */}
                    </a>
                    <p className="text-sm text-gray-500">Respondemos em 24h</p>
                  </div>
                </div>

                {/* Uncomment if you want location info
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Localização</h3>
                    <p className="text-gray-600">Porto, Portugal</p>
                    <p className="text-sm text-gray-500">Entregas em todo o país</p>
                  </div>
                </div>
                */}

                <div className="flex items-start">
                  <Instagram className="h-6 w-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Instagram</h3>
                    <a
                      href="https://www.instagram.com/arteemponto.croche/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      @arteemponto.croche
                    </a>
                    <p className="text-sm text-gray-500">Veja o nosso processo criativo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Envie-nos uma Mensagem</h2>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-gray-600">
                    Obrigado pelo seu contacto. Responderemos em breve.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Enviar Nova Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto *
                    </label>
                    <div className="relative">
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 cursor-pointer transition-all hover:border-gray-400"
                      >
                        <option value="" disabled className="text-gray-400">Selecione um assunto</option>
                        <option value="produto" className="py-2">🛍️ Dúvida sobre produto</option>
                        <option value="pedido" className="py-2">📦 Estado do pedido</option>
                        <option value="personalizado" className="py-2">✨ Pedido personalizado</option>
                        <option value="geral" className="py-2">💬 Informação geral</option>
                        <option value="outro" className="py-2">📝 Outro</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y transition-all hover:border-gray-400"
                      placeholder="Como podemos ajudar?"
                      style={{ minHeight: '44px', maxHeight: '275px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {isSubmitting ? (
                      'A Enviar...'
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600">
              Respostas às dúvidas mais comuns dos nossos clientes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Quanto tempo demora um pedido personalizado?
              </h3>
              <p className="text-gray-600">
                Os pedidos personalizados levam entre 2 a 4 semanas, dependendo da complexidade do projeto.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Fazem entregas em todo o país?
              </h3>
              <p className="text-gray-600">
                Sim! Fazemos entregas em todo Portugal continental e ilhas.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Que materiais utilizam?
              </h3>
              <p className="text-gray-600">
                Utilizamos apenas linhas de alta qualidade, preferencialmente 100% algodão, adequadas para cada tipo de produto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
