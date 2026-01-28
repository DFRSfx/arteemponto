import React, { useState } from 'react';
import { Mail, Phone, Instagram, Send, ChevronDown } from 'lucide-react';
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-sm p-8 h-full">
              <h2 className="text-2xl font-semibold mb-8">Informações de Contacto</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="p-3 bg-primary-50 rounded-full mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Telefone</h3>
                    <p className="text-gray-600 mt-1">+351 912 345 678</p>
                    <p className="text-sm text-gray-400 mt-1">Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-primary-50 rounded-full mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Email</h3>
                    <a
                      href="mailto:info@arteemponto.pt"
                      className="text-gray-600 hover:text-primary-600 transition-colors mt-1 block"
                    >
                      info@arteemponto.pt
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Respondemos em 24h</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-primary-50 rounded-full mr-4 flex-shrink-0">
                    <Instagram className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Instagram</h3>
                    <a
                      href="https://www.instagram.com/arteemponto.croche/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600 transition-colors mt-1 block"
                    >
                      @arteemponto.croche
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Veja o nosso processo criativo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-sm p-8 h-full">
              <h2 className="text-2xl font-semibold mb-6">Envie-nos uma Mensagem</h2>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Send className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-gray-600 text-center max-w-xs mb-8">
                    Obrigado pelo seu contacto. Responderemos o mais breve possível.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
                  >
                    Enviar Nova Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
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
                        className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 cursor-pointer outline-none transition-shadow"
                      >
                        <option value="" disabled className="text-gray-400">Selecione um assunto</option>
                        <option value="produto">🛍️ Dúvida sobre produto</option>
                        <option value="pedido">📦 Estado do pedido</option>
                        <option value="personalizado">✨ Pedido personalizado</option>
                        <option value="geral">💬 Informação geral</option>
                        <option value="outro">📝 Outro</option>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y outline-none transition-shadow"
                      placeholder="Como podemos ajudar?"
                      style={{ minHeight: '120px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-[0.99] font-semibold"
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

        {/* FAQ Section - Fixed to be Dynamic */}
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
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;