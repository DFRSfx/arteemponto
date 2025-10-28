import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, Edit2, Lock } from 'lucide-react';
import FloatingLabelInput from '../components/FloatingLabelInput';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to update profile
    console.log('Updating profile:', formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As passwords não coincidem');
      return;
    }

    // TODO: API call to change password
    console.log('Changing password');
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                  Administrador
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingLabelInput
                id="name"
                name="name"
                type="text"
                label="Nome Completo"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                icon={User}
              />

              <FloatingLabelInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Mail}
              />

              <FloatingLabelInput
                id="phone"
                name="phone"
                type="tel"
                label="Telefone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Phone}
              />

              <FloatingLabelInput
                id="postalCode"
                name="postalCode"
                type="text"
                label="Código Postal"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={!isEditing}
                icon={MapPin}
              />

              <div className="md:col-span-2">
                <FloatingLabelInput
                  id="address"
                  name="address"
                  type="text"
                  label="Morada"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={MapPin}
                />
              </div>

              <FloatingLabelInput
                id="city"
                name="city"
                type="text"
                label="Cidade"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                icon={MapPin}
              />
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Save className="h-5 w-5" />
                  Guardar Alterações
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Segurança</h2>
              <p className="text-gray-600 text-sm mt-1">Altere a sua password</p>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Lock className="h-4 w-4" />
                Alterar Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-6 max-w-md">
                <FloatingLabelInput
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  label="Password Atual"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  icon={Lock}
                />

                <FloatingLabelInput
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  label="Nova Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  icon={Lock}
                />

                <FloatingLabelInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirmar Nova Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  icon={Lock}
                />

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Alterar Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
