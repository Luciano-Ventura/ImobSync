import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Save } from 'lucide-react';

export default function Settings() {
  const { company, setCompany } = useGlobalContext();
  const [formData, setFormData] = useState(company);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('hero.')) {
      const heroKey = name.split('.')[1];
      setFormData({
        ...formData,
        hero: { ...formData.hero, [heroKey]: value }
      });
    } else if (name.startsWith('cores.')) {
      const corKey = name.split('.')[1];
      setFormData({
        ...formData,
        cores: { ...formData.cores, [corKey]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompany(formData);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl pb-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configurações White-label</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Informações da Imobiliária</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Empresa</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp de Contato</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrição Curta (Rodapé e Sobre)</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm"></textarea>
            </div>
          </div>
        </div>

        {/* Cores */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Identidade Visual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cor Primária (Hex)</label>
              <div className="flex gap-3 items-center">
                <input type="color" name="cores.primaria" value={formData.cores.primaria} onChange={handleChange} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                <input type="text" name="cores.primaria" value={formData.cores.primaria} onChange={handleChange} className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm uppercase font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cor de Destaque (Hex)</label>
              <div className="flex gap-3 items-center">
                <input type="color" name="cores.destaque" value={formData.cores.destaque} onChange={handleChange} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                <input type="text" name="cores.destaque" value={formData.cores.destaque} onChange={handleChange} className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm uppercase font-mono" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Info */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Conteúdo da Vitrine (Hero)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Título de Impacto</label>
              <input type="text" name="hero.titulo" value={formData.hero.titulo} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm font-medium" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Subtítulo</label>
              <textarea name="hero.subtitulo" value={formData.hero.subtitulo} onChange={handleChange} rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">URL da Imagem de Fundo</label>
              <input type="text" name="hero.imagemFundo" value={formData.hero.imagemFundo} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
              {formData.hero.imagemFundo && (
                <div className="mt-4 rounded-xl overflow-hidden h-40 relative">
                  <img src={formData.hero.imagemFundo} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold tracking-wider">PREVIEW DE IMAGEM</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" className="bg-primary hover:bg-slate-800 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center shadow-md">
            <Save size={18} className="mr-2" />
            {isSaved ? 'Configurações Salvas!' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
