import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FloatingLabelInput from '../components/FloatingLabelInput';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [newsletter, setNewsletter] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Form submitted:', formData, { newsletter, privacyPolicy });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <div className="bg-white flex items-center justify-center p-6 shadow-sm">
        <Link to="/">
          <img
            src="/images/logo.webp"
            alt="Arte em Ponto"
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registration Form Section */}
            <section className="bg-white rounded-lg shadow-sm p-6 md:p-12">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
                O registo é fácil e grátis!
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FloatingLabelInput
                  id="register_name_field"
                  name="name"
                  type="text"
                  label="Nome e Apelido"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <FloatingLabelInput
                  id="register_email_field"
                  name="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <FloatingLabelInput
                  id="register_password_field"
                  name="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {/* Password Requirements */}
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">A password terá de cumprir 3 dos seguintes requisitos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Caracter minúsculo</li>
                    <li>Caracter maiúsculo</li>
                    <li>Caracter especial</li>
                    <li>Número</li>
                  </ul>
                </div>

                {/* Newsletter Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="newsletter-subscription"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-primary-600 bg-gray-50 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <label htmlFor="newsletter-subscription" className="ml-3 text-sm text-gray-700 cursor-pointer select-none">
                    Eu gostaria de receber notícias personalizadas e comunicações comerciais da Arte em Ponto através do email e outros meios.
                  </label>
                </div>

                {/* Privacy Policy Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy-policy"
                    checked={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.checked)}
                    required
                    className="w-5 h-5 mt-0.5 text-primary-600 bg-gray-50 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <label htmlFor="privacy-policy" className="ml-3 text-sm text-gray-700 cursor-pointer select-none">
                    Li e aceito os{' '}
                    <Link to="/termos" className="text-primary-600 hover:text-primary-700 underline">
                      Termos e Condições
                    </Link>
                    , e o uso dos meus dados pessoais como explicado pela{' '}
                    <Link to="/privacidade" className="text-primary-600 hover:text-primary-700 underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-sm uppercase hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Criar Conta
                </button>
              </form>
            </section>

            {/* Social Login Section */}
            <section className="bg-white rounded-lg shadow-sm p-6 md:p-12 flex flex-col justify-center text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Ou entra com uma rede social
              </h1>

              <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold text-sm uppercase hover:bg-gray-50 hover:shadow-lg transition-all mb-8">
                <svg width="20" height="20" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.9911 9.16838C16.9911 8.43093 16.9333 7.89279 16.8081 7.33472H8.66943V10.6632H13.4467C13.3504 11.4904 12.8303 12.7361 11.6745 13.5732L11.6583 13.6846L14.2316 15.7472L14.4099 15.7657C16.0472 14.201 16.9911 11.899 16.9911 9.16838Z" fill="#4285F4"/>
                  <path d="M8.66913 17.9381C11.0096 17.9381 12.9744 17.1408 14.4096 15.7656L11.6742 13.5731C10.9422 14.1013 9.95973 14.47 8.66913 14.47C6.37682 14.47 4.43125 12.9055 3.73771 10.7429L3.63605 10.7519L0.960285 12.8945L0.925293 12.9951C2.35076 15.925 5.27877 17.9381 8.66913 17.9381Z" fill="#34A853"/>
                  <path d="M3.738 10.7428C3.555 10.1848 3.4491 9.58679 3.4491 8.96896C3.4491 8.35105 3.555 7.75313 3.72837 7.19506L3.72353 7.07621L1.01423 4.89917L0.925588 4.9428C0.338086 6.15862 0.000976562 7.52394 0.000976562 8.96896C0.000976562 10.414 0.338086 11.7792 0.925588 12.995L3.738 10.7428Z" fill="#FBBC05"/>
                  <path d="M8.66912 3.46802C10.2968 3.46802 11.3948 4.19551 12.0209 4.80346L14.4673 2.33196C12.9648 0.886946 11.0096 0 8.66912 0C5.27877 0 2.35076 2.01305 0.925293 4.94292L3.72808 7.19519C4.43125 5.03265 6.37682 3.46802 8.66912 3.46802Z" fill="#EB4335"/>
                </svg>
                Entrar com o Google
              </button>

              <p className="text-sm text-gray-600 mb-8">
                Apenas usado para autenticação.<br />
                Nunca iremos publicar nada no teu perfil.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Já tens conta Arte em Ponto?
              </h2>
              <p className="text-gray-600 mb-6">
                Clica abaixo para iniciares sessão!
              </p>
              <Link
                to="/login"
                className="inline-block border-2 border-primary-600 text-primary-600 py-3 px-12 rounded-lg font-semibold text-sm uppercase hover:bg-primary-600 hover:text-white transition-all"
              >
                Iniciar Sessão
              </Link>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-7 text-center text-gray-600 text-sm">
        @{new Date().getFullYear()} Arte em Ponto - Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Register;
