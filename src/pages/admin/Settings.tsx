import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const { company, setCompany } = useGlobalContext();
  const [formData, setFormData] = useState(company);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    } else if (name.startsWith('estatisticas.')) {
      const statKey = name.split('.')[1];
      setFormData({
        ...formData,
        estatisticas: { ...formData.estatisticas, [statKey]: Number(value) }
      });
    } else if (name.startsWith('sobre.')) {
      const sobreKey = name.split('.')[1];
      if (sobreKey.startsWith('pontosChave[')) {
        const index = parseInt(sobreKey.match(/\[(\d+)\]/)![1]);
        const newPontos = [...formData.sobre.pontosChave];
        newPontos[index] = value;
        setFormData({
          ...formData,
          sobre: { ...formData.sobre, pontosChave: newPontos }
        });
      } else {
        setFormData({
          ...formData,
          sobre: { ...formData.sobre, [sobreKey]: value }
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Como só temos uma configuração de empresa no MVP, buscamos a primeira
      const { data: currentConfig } = await supabase.from('company_config').select('id').single();
      
      const updateData = {
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        descricao: formData.descricao,
        cor_primaria: formData.cores.primaria,
        cor_destaque: formData.cores.destaque,
        hero_titulo: formData.hero.titulo,
        hero_subtitulo: formData.hero.subtitulo,
        hero_imagem_fundo: formData.hero.imagemFundo,
        anos_mercado: formData.estatisticas.anosMercado,
        imoveis_vendidos: formData.estatisticas.imoveisVendidos,
        clientes_satisfeitos: formData.estatisticas.clientesSatisfeitos,
        sobre_titulo: formData.sobre.titulo,
        sobre_descricao: formData.sobre.descricao,
        sobre_pontos_chave: formData.sobre.pontosChave,
        sobre_cta_texto: formData.sobre.ctaTexto,
        sobre_imagem_url: formData.sobre.imagemUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_config')
        .update(updateData)
        .eq('id', currentConfig?.id);

      if (error) throw error;

      setCompany(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
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
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Números de Destaque (Estatísticas)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Anos de Mercado</label>
              <input type="number" name="estatisticas.anosMercado" value={formData.estatisticas.anosMercado} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Imóveis Vendidos</label>
              <input type="number" name="estatisticas.imoveisVendidos" value={formData.estatisticas.imoveisVendidos} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Clientes Satisfeitos</label>
              <input type="number" name="estatisticas.clientesSatisfeitos" value={formData.estatisticas.clientesSatisfeitos} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
            </div>
          </div>
        </div>

        {/* Nossa Essência / Sobre */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Seção "Nossa Essência" (Sobre)</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Título da Seção</label>
              <input type="text" name="sobre.titulo" value={formData.sobre.titulo} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm font-bold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrição da Seção</label>
              <textarea name="sobre.descricao" value={formData.sobre.descricao} onChange={handleChange} rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3"><label className="block text-sm font-medium text-slate-700 mb-2">Pontos Chave (Top 3)</label></div>
              {[0, 1, 2].map((i) => (
                <input 
                  key={i}
                  type="text" 
                  name={`sobre.pontosChave[${i}]`} 
                  value={formData.sobre.pontosChave[i] || ''} 
                  onChange={handleChange} 
                  placeholder={`Ponto ${i+1}`}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" 
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Texto do Botão (CTA)</label>
                <input type="text" name="sobre.ctaTexto" value={formData.sobre.ctaTexto} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">URL da Imagem da Seção</label>
                <input type="text" name="sobre.imagemUrl" value={formData.sobre.imagemUrl} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary text-sm" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-primary hover:bg-slate-800 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center shadow-md disabled:opacity-70 gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaved ? 'Configurações Salvas!' : isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
