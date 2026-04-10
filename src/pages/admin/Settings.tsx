import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const { company, setCompany, tenant } = useGlobalContext();
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(company);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar formulário quando os dados carregarem do contexto
  React.useEffect(() => {
    if (company.nome !== 'ImobSync' || company.whatsapp !== '5511999999999') {
      setFormData(company);
    }
  }, [company]);

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

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 11);
    if (limited.length <= 2) {
      return limited.length > 0 ? `(${limited}` : '';
    }
    if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    }
    if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    }
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, whatsapp: formatted, telefone: formatted });
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenantId && !tenant?.id) {
      showToast('Acesso negado: Perfil sem imobiliária vinculada.', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const upsertData = {
        tenant_id: profile?.tenantId || tenant?.id, // Fallback para ID real (UUID) do tenant
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        telefone: formData.whatsapp,
        email: formData.email,
        endereco: formData.endereco,
        creci: formData.creci,
        descricao: formData.descricao,
        cor_primaria: formData.cores.primaria,
        cor_destaque: formData.cores.destaque,
        logo_url: (formData as any).logoUrl || null,
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

      // Usar upsert filtrando por tenant_id garantindo que cada imobiliária tenha o seu
      const { error } = await supabase
        .from('company_config')
        .upsert(upsertData, { onConflict: 'tenant_id' });

      if (error) throw error;

      setCompany(formData);
      showToast('Configurações salvas com sucesso!');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      showToast('Erro ao salvar configurações.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display text-highlight">Configurações White-label</h1>
          <p className="text-slate-500">Personalize a identidade visual e conteúdo da sua vitrine.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10 space-y-10">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Informações da Imobiliária</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Nome da Empresa</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">WhatsApp de Contato</label>
              <input 
                type="text" 
                name="whatsapp" 
                value={formData.whatsapp} 
                onChange={handlePhoneChange} 
                placeholder="(00) 00000-0000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">E-mail Público</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemplo@email.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Endereço Completo</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua, Número, Bairro, Cidade - UF" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">CRECI (Opcional)</label>
              <input type="text" name="creci" value={formData.creci || ''} onChange={handleChange} placeholder="00.000-J" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold font-mono" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Descrição Curta (Rodapé e Sobre)</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"></textarea>
            </div>
          </div>
        </div>

        {/* Cores + Logo */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Identidade Visual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Cor Primária (Hex)</label>
              <div className="flex gap-3 items-center">
                <input type="color" name="cores.primaria" value={formData.cores.primaria} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden shadow-sm" />
                <input type="text" name="cores.primaria" value={formData.cores.primaria} onChange={handleChange} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold uppercase font-mono" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Cor de Destaque (Hex)</label>
              <div className="flex gap-3 items-center">
                <input type="color" name="cores.destaque" value={formData.cores.destaque} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden shadow-sm" />
                <input type="text" name="cores.destaque" value={formData.cores.destaque} onChange={handleChange} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold uppercase font-mono" />
              </div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">
                URL da Logo da Imobiliária
              </label>
              <p className="text-xs text-slate-400 pl-1 mb-2">Usada no cabeçalho da vitrine e como imagem padrão de imóveis sem foto.</p>
              <input 
                type="url" 
                name="logoUrl" 
                value={(formData as any).logoUrl || ''} 
                onChange={handleChange} 
                placeholder="https://..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" 
              />
            </div>
          </div>
        </div>

        {/* Hero Info */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Conteúdo da Vitrine (Hero)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Título de Impacto</label>
              <input type="text" name="hero.titulo" value={formData.hero.titulo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Subtítulo</label>
              <textarea name="hero.subtitulo" value={formData.hero.subtitulo} onChange={handleChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"></textarea>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">URL da Imagem de Fundo</label>
              <input type="text" name="hero.imagemFundo" value={formData.hero.imagemFundo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Números de Destaque (Estatísticas)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Anos de Mercado</label>
              <input type="number" name="estatisticas.anosMercado" value={formData.estatisticas.anosMercado} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Imóveis Vendidos</label>
              <input type="number" name="estatisticas.imoveisVendidos" value={formData.estatisticas.imoveisVendidos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Clientes Satisfeitos</label>
              <input type="number" name="estatisticas.clientesSatisfeitos" value={formData.estatisticas.clientesSatisfeitos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
          </div>
        </div>

        {/* Nossa Essência / Sobre */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Seção "Sobre"</h2>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Título da Seção</label>
              <input type="text" name="sobre.titulo" value={formData.sobre.titulo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Descrição da Seção</label>
              <textarea name="sobre.descricao" value={formData.sobre.descricao} onChange={handleChange} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Ponto Chave {i+1}</label>
                  <input 
                    type="text" 
                    name={`sobre.pontosChave[${i}]`} 
                    value={formData.sobre.pontosChave[i] || ''} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" 
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">Texto do Botão (CTA)</label>
                <input type="text" name="sobre.ctaTexto" value={formData.sobre.ctaTexto} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 font-mono">URL da Imagem da Seção</label>
                <input type="text" name="sobre.imagemUrl" value={formData.sobre.imagemUrl} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-8 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-slate-900 hover:bg-black text-white py-4 px-10 rounded-2xl font-bold transition-all flex items-center shadow-xl shadow-slate-900/10 disabled:opacity-70 gap-3"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaved ? 'Configurações Salvas!' : isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
