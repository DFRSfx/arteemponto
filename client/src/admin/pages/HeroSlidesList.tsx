import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, MoveVertical, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_URL = `${SERVER_URL}/api`;

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  background_image: string;
  background_image_md: string;
  background_image_sm: string;
  text_color: 'white' | 'dark';
  display_order: number;
  is_active: boolean;
}

export default function HeroSlidesList() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const { error: showError, success: showSuccess } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
    button_link_type: 'page' as 'page' | 'category' | 'custom',
    text_color: 'white' as 'white' | 'dark',
    display_order: 0,
    is_active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories, setCategories] = useState<Array<{id: number; name: string; slug: string}>>([]);

  useEffect(() => {
    loadSlides();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSlides = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_URL}/hero-slides/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      // Check for authentication errors
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setError('Sessão expirada. Por favor, faça login novamente.');
          setSlides([]);
          return;
        }
        throw new Error(data.error || 'Erro ao carregar slides');
      }

      // Ensure data is an array
      if (Array.isArray(data)) {
        setSlides(data);
        setError(null);
      } else {
        console.error('Invalid data format from API:', data);
        setError('Formato de dados inválido');
        setSlides([]);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar slides');
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkTypeChange = (type: 'page' | 'category' | 'custom', value: string = '') => {
    setFormData({
      ...formData,
      button_link_type: type,
      button_link: value
    });
  };

  const detectLinkType = (link: string): 'page' | 'category' | 'custom' => {
    const predefinedPages = ['/loja', '/loja?filter=new', '/loja?filter=featured', '/favoritos', '/'];
    if (predefinedPages.includes(link)) return 'page';
    if (link.includes('categoria=')) return 'category';
    return 'custom';
  };

  const handleEditLinkTypeChange = (slideId: number, type: 'page' | 'category' | 'custom', value: string = '') => {
    updateSlide(slideId, 'button_link', value);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Por favor, selecione uma imagem');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('button_text', formData.button_text);
      formDataToSend.append('button_link', formData.button_link);
      formDataToSend.append('text_color', formData.text_color);
      formDataToSend.append('display_order', formData.display_order.toString());
      formDataToSend.append('is_active', formData.is_active.toString());
      formDataToSend.append('image', imageFile);

      const response = await fetch(`${API_URL}/hero-slides`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        showSuccess('Slide criado com sucesso!');
        setShowAddForm(false);
        setFormData({
          title: '',
          description: '',
          button_text: '',
          button_link: '',
          button_link_type: 'page',
          text_color: 'white',
          display_order: 0,
          is_active: true
        });
        setImageFile(null);
        setImagePreview('');
        loadSlides();
      } else {
        showError('Erro ao criar slide');
      }
    } catch (error) {
      console.error('Error adding slide:', error);
      showError('Erro ao criar slide');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const slide = slides.find(s => s.id === id);
      if (!slide) return;

      const token = localStorage.getItem('auth_token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', slide.title);
      formDataToSend.append('description', slide.description || '');
      formDataToSend.append('button_text', slide.button_text);
      formDataToSend.append('button_link', slide.button_link);
      formDataToSend.append('text_color', slide.text_color);
      formDataToSend.append('display_order', slide.display_order.toString());
      formDataToSend.append('is_active', slide.is_active.toString());

      // Only append image if one was selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        showSuccess('Slide atualizado com sucesso!');
        setEditingId(null);
        setImageFile(null);
        setImagePreview('');
        // Force reload with cache bust
        await loadSlides();
      } else {
        showError('Erro ao atualizar slide');
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      showError('Erro ao atualizar slide');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/hero-slides/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showSuccess('Slide eliminado com sucesso!');
        setDeleteConfirm(null);
        loadSlides();
      } else {
        showError('Erro ao eliminar slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      showError('Erro ao eliminar slide');
    }
  };

  const updateSlide = (id: number, field: string, value: any) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const slide = slides.find(s => s.id === id);
      if (!slide) return;

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...slide, is_active: !currentStatus })
      });

      if (response.ok) {
        showSuccess(`Slide ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
        loadSlides();
      } else {
        showError('Erro ao alterar estado do slide');
      }
    } catch (error) {
      console.error('Error toggling slide status:', error);
      showError('Erro ao alterar estado do slide');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          {error.includes('expirada') && (
            <button
              onClick={() => window.location.href = '/'}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Fazer Login
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Hero Slides</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-600 text-white px-4 py-3 rounded-lg hover:bg-amber-700 active:bg-amber-800 transition-colors flex items-center touch-manipulation min-h-[44px]"
        >
          {showAddForm ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
          {showAddForm ? 'Cancelar' : 'Criar Slide'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Novo Slide</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão *</label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Link Configuration */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Destino do Botão *</label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleLinkTypeChange('page', '/loja')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.button_link_type === 'page'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  📄 Página
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkTypeChange('category', '')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.button_link_type === 'category'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  🏷️ Categoria
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkTypeChange('custom', '')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.button_link_type === 'custom'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  🔗 Personalizado
                </button>
              </div>

              {formData.button_link_type === 'page' && (
                <select
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="/loja">🛍️ Loja (Todos os Produtos)</option>
                  <option value="/loja?filter=new">✨ Novidades</option>
                  <option value="/loja?filter=featured">⭐ Produtos em Destaque</option>
                  <option value="/favoritos">❤️ Favoritos</option>
                  <option value="/">🏠 Página Inicial</option>
                </select>
              )}

              {formData.button_link_type === 'category' && (
                <select
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={`/loja?categoria=${cat.slug}`}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

              {formData.button_link_type === 'custom' && (
                <input
                  type="text"
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  placeholder="Ex: /sobre, /contacto, ou URL externa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  required
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto</label>
                <select
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value as 'white' | 'dark' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="white">Branco</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Fundo *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordem de Exibição</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center pt-7">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-gray-700">Slide Ativo</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 active:bg-amber-800 transition-colors touch-manipulation min-h-[44px]"
            >
              Criar Slide
            </button>
          </form>
        </div>
      )}

      {/* Slides List - Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Slide Preview */}
            <div className="relative h-48 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${SERVER_URL}${slide.background_image_md || slide.background_image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>

              {/* Content Preview */}
              <div className="relative z-10 h-full flex items-center p-6">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    slide.text_color === 'white' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {slide.title}
                  </h3>
                  <p className={`text-sm mb-3 line-clamp-2 ${
                    slide.text_color === 'white' ? 'text-gray-100' : 'text-gray-600'
                  }`}>
                    {slide.description}
                  </p>
                  <span className="inline-block px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg">
                    {slide.button_text}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={() => toggleActive(slide.id, slide.is_active)}
                  className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                    slide.is_active
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {slide.is_active ? <Eye size={14} className="inline mr-1" /> : <EyeOff size={14} className="inline mr-1" />}
                  {slide.is_active ? 'Ativo' : 'Inativo'}
                </button>
              </div>

              {/* Order Badge */}
              <div className="absolute top-3 left-3 z-20">
                <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Ordem: {slide.display_order}
                </div>
              </div>
            </div>

            {/* Info & Actions */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Link:</span> {slide.button_link}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(slide.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation min-h-[44px]"
                >
                  <Edit size={18} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => setDeleteConfirm({ id: slide.id, title: slide.title })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation min-h-[44px]"
                  aria-label="Eliminar"
                >
                  <Trash2 size={18} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">Nenhum slide encontrado</p>
          </div>
        )}
      </div>


      {/* Edit Modal */}
      {editingId !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setEditingId(null);
              loadSlides();
            }}
          />

          {/* Modal */}
          <div className="fixed inset-4 md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 overflow-y-auto max-h-[90vh]">
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Editar Slide</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    loadSlides();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Fechar"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {(() => {
                  const slide = slides.find(s => s.id === editingId);
                  if (!slide) return null;

                  return (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(editingId, 'title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                        <textarea
                          value={slide.description}
                          onChange={(e) => updateSlide(editingId, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                        <input
                          type="text"
                          value={slide.button_text}
                          onChange={(e) => updateSlide(editingId, 'button_text', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                        />
                      </div>

                      {/* Link Configuration */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Destino do Botão</label>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditLinkTypeChange(editingId, 'page', '/loja')}
                            className={`px-4 py-3 rounded-lg border-2 transition-all text-base ${
                              detectLinkType(slide.button_link) === 'page'
                                ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            📄 Página
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditLinkTypeChange(editingId, 'category', '')}
                            className={`px-4 py-3 rounded-lg border-2 transition-all text-base ${
                              detectLinkType(slide.button_link) === 'category'
                                ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            🏷️ Categoria
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditLinkTypeChange(editingId, 'custom', '')}
                            className={`px-4 py-3 rounded-lg border-2 transition-all text-base ${
                              detectLinkType(slide.button_link) === 'custom'
                                ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            🔗 Personalizado
                          </button>
                        </div>

                        {detectLinkType(slide.button_link) === 'page' && (
                          <select
                            value={slide.button_link}
                            onChange={(e) => updateSlide(editingId, 'button_link', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                          >
                            <option value="/loja">🛍️ Loja (Todos os Produtos)</option>
                            <option value="/loja?filter=new">✨ Novidades</option>
                            <option value="/loja?filter=featured">⭐ Produtos em Destaque</option>
                            <option value="/favoritos">❤️ Favoritos</option>
                            <option value="/">🏠 Página Inicial</option>
                          </select>
                        )}

                        {detectLinkType(slide.button_link) === 'category' && (
                          <select
                            value={slide.button_link}
                            onChange={(e) => updateSlide(editingId, 'button_link', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                          >
                            <option value="">Selecione uma categoria</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={`/loja?categoria=${cat.slug}`}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        )}

                        {detectLinkType(slide.button_link) === 'custom' && (
                          <input
                            type="text"
                            value={slide.button_link}
                            onChange={(e) => updateSlide(editingId, 'button_link', e.target.value)}
                            placeholder="Ex: /sobre, /contacto, ou URL externa"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alterar Imagem de Fundo (opcional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                        />
                        {/* Show current image or preview */}
                        <div className="mt-3">
                          <img
                            src={imagePreview || `${SERVER_URL}${slide.background_image_md || slide.background_image}`}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto</label>
                          <select
                            value={slide.text_color}
                            onChange={(e) => updateSlide(editingId, 'text_color', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                          >
                            <option value="white">Branco</option>
                            <option value="dark">Escuro</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ordem</label>
                          <input
                            type="number"
                            value={slide.display_order}
                            onChange={(e) => updateSlide(editingId, 'display_order', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-base"
                          />
                        </div>

                        <div className="flex items-end">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slide.is_active}
                              onChange={(e) => updateSlide(editingId, 'is_active', e.target.checked)}
                              className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="ml-2 text-gray-700">Ativo</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => handleUpdate(editingId)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 active:bg-amber-800 transition-colors touch-manipulation min-h-[48px] font-medium"
                        >
                          <Save size={20} />
                          <span>Guardar</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            loadSlides();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation min-h-[48px] font-medium"
                        >
                          <X size={20} />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeleteConfirm(null)}
          />

          {/* Modal */}
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Eliminar Slide</h2>
                <p className="text-gray-600 text-center">
                  Tem a certeza que deseja eliminar o slide <span className="font-semibold">"{deleteConfirm.title}"</span>?
                </p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Esta ação não pode ser revertida.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation min-h-[48px] font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation min-h-[48px] font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
