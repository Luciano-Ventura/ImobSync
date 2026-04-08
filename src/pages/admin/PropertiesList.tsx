import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Edit2, Trash2, Plus, Eye, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../../types';

export default function PropertiesList() {
  const { properties, setProperties } = useGlobalContext();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Property>>({
    tipo: 'Casa',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    destaque: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (uploadedImages.length + files.length > 15) {
        alert('Você pode adicionar no máximo 15 fotos.');
        return;
      }
      const newImages = files.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Formulário mockado simplificado
  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const mockProperty: Property = {
      id: `prop-${Date.now()}`,
      titulo: formData.titulo || 'Novo Imóvel Sem Título',
      tipo: formData.tipo as any || 'Casa',
      preco: Number(formData.preco) || 0,
      area: Number(formData.area) || 0,
      quartos: Number(formData.quartos) || 0,
      banheiros: Number(formData.banheiros) || 0,
      vagas: Number(formData.vagas) || 0,
      descricao: formData.descricao || '',
      cidade: formData.cidade || '',
      bairro: formData.bairro || '',
      imagens: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
      destaque: false
    };
    setProperties([mockProperty, ...properties]);
    setIsPanelOpen(false);
    setUploadedImages([]);
    setFormData({ tipo: 'Casa', bairro: 'Jardins', cidade: 'São Paulo', destaque: false });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir este imóvel da lista (temporariamente)?")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="max-w-7xl pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Meus Imóveis</h1>
        <button onClick={() => setIsPanelOpen(true)} className="bg-primary hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors flex items-center text-sm shadow-md">
          <Plus size={16} className="mr-2" />
          Novo Imóvel
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm md:text-base">
                <th className="p-4 font-semibold text-slate-600">Imóvel</th>
                <th className="p-4 font-semibold text-slate-600 hidden md:table-cell">Destinação</th>
                <th className="p-4 font-semibold text-slate-600">Preço</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {properties.map(property => (
                <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        {property.imagens[0] ? (
                          <img src={property.imagens[0]} alt="thumb" className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{property.titulo}</p>
                        <p className="text-slate-500 mt-1">{property.bairro}, {property.cidade}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                     <span className="inline-flex py-1 px-2.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">Venda</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
                    {formatPrice(property.preco)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Link to={`/imovel/${property.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors bg-white border border-slate-200 rounded-lg shadow-sm" title="Ver na vitrine">
                         <Eye size={16} />
                       </Link>
                       <button onClick={() => setIsPanelOpen(true)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm" title="Editar">
                         <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDelete(property.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm" title="Excluir">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Nenhum imóvel cadastrado.
            </div>
          )}
        </div>
      </div>

      {/* Side Panel (Gaveta) - Cadastro de Imóveis */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between !bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Cadastro de Imóvel</h2>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white rounded-lg shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <form id="property-form" className="space-y-6" onSubmit={handleAddNew}>
                  
                  {/* Upload Fotos */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fotos do Imóvel ({uploadedImages.length}/15)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                      />
                      <p className="text-slate-500 font-medium text-sm group-hover:text-primary transition-colors">Clique ou arraste fotos aqui</p>
                      <p className="text-slate-400 text-xs mt-1">JPG, PNG até 10MB</p>
                    </div>
                    {/* Previews */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mt-4">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeImage(idx)}
                              className="absolute top-1.5 right-1.5 bg-rose-500 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-md"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Título do Anúncio</label>
                      <input type="text" value={formData.titulo || ''} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" placeholder="Ex: Cobertura Duplex no Centro..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Valor Venda (R$)</label>
                      <input type="number" value={formData.preco || ''} onChange={e => setFormData({...formData, preco: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" placeholder="0" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Área (m²)</label>
                        <input type="number" value={formData.area || ''} onChange={e => setFormData({...formData, area: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quartos</label>
                        <input type="number" value={formData.quartos || ''} onChange={e => setFormData({...formData, quartos: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Banheiros</label>
                        <input type="number" value={formData.banheiros || ''} onChange={e => setFormData({...formData, banheiros: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vagas</label>
                        <input type="number" value={formData.vagas || ''} onChange={e => setFormData({...formData, vagas: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                      <textarea rows={4} value={formData.descricao || ''} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm"></textarea>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <button form="property-form" type="submit" className="w-full bg-primary hover:bg-slate-800 text-white py-3.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center shadow-md">
                  <Save size={18} className="mr-2" />
                  Salvar Imóvel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
