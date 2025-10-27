import React, { useState } from 'react';
import { X } from 'lucide-react';
import FloatingLabelInput from './FloatingLabelInput';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Password validation
  const validatePassword = (password: string) => {
    return {
      hasMinLength: password.length >= 6,
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  };

  const passwordChecks = validatePassword(registerData.password);
  const validChecksCount = Object.values(passwordChecks).filter(Boolean).length;
  const isPasswordValid = validChecksCount >= 4;

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', loginData, { rememberMe });
    handleClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', registerData, { newsletter, privacyPolicy });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[60] ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-6xl bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl z-[70] max-h-[90vh] overflow-hidden ${isClosing ? 'animate-fadeOut scale-95' : 'animate-fadeIn scale-100'} transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100 transition-all shadow-md"
            aria-label="Fechar"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Content - Two Cards Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 md:p-12 h-full max-h-[90vh] overflow-y-auto">

          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Iniciar Sessão</h2>

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6 flex-1 flex flex-col">
                <FloatingLabelInput
                  id="login_email"
                  name="email"
                  type="email"
                  label="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  autoComplete="email"
                />

                <FloatingLabelInput
                  id="login_password"
                  name="password"
                  type="password"
                  label="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-primary-600 bg-gray-50 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 cursor-pointer">
                      Lembrar-me
                    </label>
                  </div>
                  <button type="button" className="text-sm text-primary-600 hover:text-primary-700 underline">
                    Esqueceu a password?
                  </button>
                </div>

                <div className="flex-1"></div>

                <div className="space-y-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold text-sm hover:bg-gray-50 hover:shadow-md transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.9911 9.16838C16.9911 8.43093 16.9333 7.89279 16.8081 7.33472H8.66943V10.6632H13.4467C13.3504 11.4904 12.8303 12.7361 11.6745 13.5732L11.6583 13.6846L14.2316 15.7472L14.4099 15.7657C16.0472 14.201 16.9911 11.899 16.9911 9.16838Z" fill="#4285F4"/>
                      <path d="M8.66913 17.9381C11.0096 17.9381 12.9744 17.1408 14.4096 15.7656L11.6742 13.5731C10.9422 14.1013 9.95973 14.47 8.66913 14.47C6.37682 14.47 4.43125 12.9055 3.73771 10.7429L3.63605 10.7519L0.960285 12.8945L0.925293 12.9951C2.35076 15.925 5.27877 17.9381 8.66913 17.9381Z" fill="#34A853"/>
                      <path d="M3.738 10.7428C3.555 10.1848 3.4491 9.58679 3.4491 8.96896C3.4491 8.35105 3.555 7.75313 3.72837 7.19506L3.72353 7.07621L1.01423 4.89917L0.925588 4.9428C0.338086 6.15862 0.000976562 7.52394 0.000976562 8.96896C0.000976562 10.414 0.338086 11.7792 0.925588 12.995L3.738 10.7428Z" fill="#FBBC05"/>
                      <path d="M8.66912 3.46802C10.2968 3.46802 11.3948 4.19551 12.0209 4.80346L14.4673 2.33196C12.9648 0.886946 11.0096 0 8.66912 0C5.27877 0 2.35076 2.01305 0.925293 4.94292L3.72808 7.19519C4.43125 5.03265 6.37682 3.46802 8.66912 3.46802Z" fill="#EB4335"/>
                    </svg>
                    Entrar com Google
                  </button>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-sm uppercase hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Iniciar Sessão
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">Já tens conta?</h3>
                  <p className="text-gray-600">
                    Inicia sessão para aceder à tua conta Arte em Ponto e explorar as nossas coleções exclusivas.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-gray-700 text-left">Acesso rápido aos teus favoritos</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-gray-700 text-left">Histórico de encomendas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-gray-700 text-left">Ofertas personalizadas</p>
                  </div>
                </div>

                <button
                  onClick={() => setMode('login')}
                  className="w-full border-2 border-primary-600 text-primary-600 py-3 px-12 rounded-lg font-semibold text-sm uppercase hover:bg-primary-600 hover:text-white transition-all"
                >
                  Iniciar Sessão
                </button>
              </div>
            )}
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Conta</h2>

            {mode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-6 flex-1 flex flex-col">
                <FloatingLabelInput
                  id="register_name"
                  name="name"
                  type="text"
                  label="Nome e Apelido"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  required
                />

                <FloatingLabelInput
                  id="register_email"
                  name="email"
                  type="email"
                  label="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />

                <FloatingLabelInput
                  id="register_password"
                  name="password"
                  type="password"
                  label="Password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />

                <div className="text-xs bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2 text-gray-700">
                    A password terá de cumprir 4 dos seguintes requisitos:
                    {registerData.password && (
                      <span className={`ml-2 ${isPasswordValid ? 'text-green-600' : 'text-gray-500'}`}>
                        ({validChecksCount}/5)
                      </span>
                    )}
                  </p>
                  <ul className="space-y-1.5">
                    <li className={`flex items-center gap-2 ${passwordChecks.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.hasMinLength ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      Mínimo 6 caracteres
                    </li>
                    <li className={`flex items-center gap-2 ${passwordChecks.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.hasLowerCase ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      Caracter minúsculo
                    </li>
                    <li className={`flex items-center gap-2 ${passwordChecks.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.hasUpperCase ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      Caracter maiúsculo
                    </li>
                    <li className={`flex items-center gap-2 ${passwordChecks.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.hasSpecialChar ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      Caracter especial
                    </li>
                    <li className={`flex items-center gap-2 ${passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.hasNumber ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      Número
                    </li>
                  </ul>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-primary-600 bg-gray-50 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <label htmlFor="newsletter" className="ml-3 text-xs text-gray-700 cursor-pointer">
                    Eu gostaria de receber notícias personalizadas e comunicações comerciais da Arte em Ponto.
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.checked)}
                    required
                    className="w-5 h-5 mt-0.5 text-primary-600 bg-gray-50 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <label htmlFor="privacy" className="ml-3 text-xs text-gray-700 cursor-pointer">
                    Li e aceito os{' '}
                    <a href="/termos" className="text-primary-600 hover:text-primary-700 underline">
                      Termos e Condições
                    </a>
                    {' '}e a{' '}
                    <a href="/privacidade" className="text-primary-600 hover:text-primary-700 underline">
                      Política de Privacidade
                    </a>
                  </label>
                </div>

                <div className="flex-1"></div>

                <div className="space-y-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold text-sm hover:bg-gray-50 hover:shadow-md transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.9911 9.16838C16.9911 8.43093 16.9333 7.89279 16.8081 7.33472H8.66943V10.6632H13.4467C13.3504 11.4904 12.8303 12.7361 11.6745 13.5732L11.6583 13.6846L14.2316 15.7472L14.4099 15.7657C16.0472 14.201 16.9911 11.899 16.9911 9.16838Z" fill="#4285F4"/>
                      <path d="M8.66913 17.9381C11.0096 17.9381 12.9744 17.1408 14.4096 15.7656L11.6742 13.5731C10.9422 14.1013 9.95973 14.47 8.66913 14.47C6.37682 14.47 4.43125 12.9055 3.73771 10.7429L3.63605 10.7519L0.960285 12.8945L0.925293 12.9951C2.35076 15.925 5.27877 17.9381 8.66913 17.9381Z" fill="#34A853"/>
                      <path d="M3.738 10.7428C3.555 10.1848 3.4491 9.58679 3.4491 8.96896C3.4491 8.35105 3.555 7.75313 3.72837 7.19506L3.72353 7.07621L1.01423 4.89917L0.925588 4.9428C0.338086 6.15862 0.000976562 7.52394 0.000976562 8.96896C0.000976562 10.414 0.338086 11.7792 0.925588 12.995L3.738 10.7428Z" fill="#FBBC05"/>
                      <path d="M8.66912 3.46802C10.2968 3.46802 11.3948 4.19551 12.0209 4.80346L14.4673 2.33196C12.9648 0.886946 11.0096 0 8.66912 0C5.27877 0 2.35076 2.01305 0.925293 4.94292L3.72808 7.19519C4.43125 5.03265 6.37682 3.46802 8.66912 3.46802Z" fill="#EB4335"/>
                    </svg>
                    Registar com Google
                  </button>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-sm uppercase hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Criar Conta
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">Novo por aqui?</h3>
                  <p className="text-gray-600">
                    O registo é fácil e grátis! Cria a tua conta e começa a explorar.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-gray-700 text-left">Registo rápido e gratuito</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-gray-700 text-left">Acesso a produtos exclusivos</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-gray-700 text-left">Newsletter com novidades</p>
                  </div>
                </div>

                <button
                  onClick={() => setMode('register')}
                  className="w-full border-2 border-primary-600 text-primary-600 py-3 px-12 rounded-lg font-semibold text-sm uppercase hover:bg-primary-600 hover:text-white transition-all"
                >
                  Criar Conta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
