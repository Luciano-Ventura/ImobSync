import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Mail, Building2, Calendar, CheckCircle, ArrowRight, Copy, Check, Link as LinkIcon, Trash2, X, RefreshCw, Search, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface PlatformLead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  status: 'discovery' | 'demo' | 'negotiation' | 'onboarding' | 'closed';
  created_at: string;
}

const STAGES = [
  { id: 'discovery', name: 'Descoberta', color: 'bg-blue-500' },
  { id: 'demo', name: 'Demonstração', color: 'bg-indigo-500' },
  { id: 'negotiation', name: 'Negociação', color: 'bg-amber-500' },
  { id: 'onboarding', name: 'Onboarding', color: 'bg-emerald-500' },
  { id: 'closed', name: 'Fechado', color: 'bg-slate-400' },
];

export default function PlatformLeads() {
  const [leads, setLeads] = useState<PlatformLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [provisioningLead, setProvisioningLead] = useState<PlatformLead | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionedData, setProvisionedData] = useState<{email: string, link: string} | null>(null);
  const [copied, setCopied] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ fullName: '', email: '', companyName: '', phone: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('platform_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erro ao buscar leads da plataforma:', err);
      showToast('Erro ao carregar leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('platform_leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (error) throw error;
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus as any } : l));
      showToast('Status do lead atualizado');
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      showToast('Erro ao atualizar status', 'error');
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const { error } = await supabaseAdmin.from('platform_leads').delete().eq('id', id);
      if (error) throw error;
      setLeads(prev => prev.filter(l => l.id !== id));
      showToast('Lead removido com sucesso');
    } catch (err) {
      console.error('Erro ao excluir lead:', err);
      showToast('Erro ao excluir lead', 'error');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    try {
      const { data, error } = await supabase.from('platform_leads').insert([{
        full_name: newLeadForm.fullName,
        email: newLeadForm.email,
        company_name: newLeadForm.companyName,
        phone: newLeadForm.phone,
        status: 'discovery'
      }]).select().single();

      if (error) throw error;
      setLeads(prev => [data, ...prev]);
      setIsNewLeadModalOpen(false);
      setNewLeadForm({ fullName: '', email: '', companyName: '', phone: '' });
      showToast('Lead cadastrado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar lead:', err);
      showToast('Erro ao criar lead', 'error');
    } finally {
      setIsSubmittingLead(false);
    }
  };


  const handleCreateAccount = async (lead: PlatformLead) => {
    setProvisioningLead(lead);
    setIsProvisioning(true);
    setProvisionedData(null);

    try {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: lead.email,
        email_confirm: false,
        user_metadata: { full_name: lead.full_name }
      });

      if (userError) throw userError;
      const newUser = userData.user;

      const slug = lead.company_name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { data: tenant, error: tError } = await supabaseAdmin.from('tenants').insert([{
        name: lead.company_name,
        slug: slug,
        status: 'active'
      }]).select().single();

      if (tError) throw tError;

      const { error: pError } = await supabaseAdmin.from('profiles').insert([{
        id: newUser.id,
        tenant_id: tenant.id,
        role: 'admin',
        full_name: lead.full_name
      }]);

      if (pError) throw pError;

      // 4. Provisionar Configuração Padrão de Marca (White-Label)
      const { error: cError } = await supabaseAdmin.from('company_config').insert([{
        tenant_id: tenant.id,
        nome: lead.company_name,
        whatsapp: lead.phone,
        telefone: lead.phone,
        email: lead.email,
        cor_primaria: '#0F172A',
        cor_destaque: '#C9A95C',
        hero_titulo: 'Encontre o imóvel ideal para sua vida.',
        hero_subtitulo: 'Casas e apartamentos selecionados com as melhores oportunidades do mercado.',
        hero_imagem_fundo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
        sobre_titulo: 'Muito além da venda, a entrega de um sonho.',
        sobre_descricao: 'Especialistas em imóveis selecionados. Nosso portfólio é cuidadosamente curado para atender os clientes mais exigentes.',
        sobre_pontos_chave: ['Assessoria completa', 'Atendimento Personalizado', 'Segurança Jurídica'],
        sobre_cta_texto: 'Falar com um consultor',
        sobre_imagem_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200'
      }]);

      if (cError) throw cError;

      // 5. Gerar o link de convite real (Invite) que permite definir a senha
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: lead.email,
        options: { redirectTo: `${window.location.origin}/definir-senha` }
      });

      if (linkError) throw linkError;

      await updateLeadStatus(lead.id, 'onboarding');
      setProvisionedData({ email: lead.email, link: linkData.properties.action_link });
      showToast('Conta provisionada com sucesso!');
    } catch (err: any) {
      console.error('Erro no provisionamento real:', err);
      showToast(`Erro no provisionamento: ${err.message}`, 'error');
    } finally {
      setIsProvisioning(false);
    }
  };

  const copyToClipboard = () => {
    if (!provisionedData) return;
    const text = `Boas-vindas ao ImobSync!\n\nSua plataforma já está pronta. Use o link seguro abaixo para definir sua senha e acessar seu painel:\n\n${provisionedData.link}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Link de acesso copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLeads = leads.filter(l => 
    l.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto overflow-hidden flex flex-col h-screen -m-8 md:-m-12">
      <div className="p-8 md:p-12 pb-4">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-display text-highlight">Funil de Vendas SaaS</h1>
            <p className="text-slate-500">Gestão de leads interessados na plataforma ImobSync.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Buscar lead ou empresa..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64 text-sm font-semibold"
               />
             </div>

             <button 
                onClick={fetchLeads} 
                className={`bg-white border border-slate-200 p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all ${loading ? 'opacity-50' : ''}`}
                disabled={loading}
                title="Sincronizar Dados"
             >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
             </button>

             <button 
                onClick={() => setIsNewLeadModalOpen(true)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
             >
                <Plus size={18} /> Novo Lead
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-8 md:p-12 pt-0 h-full">
        {loading ? (
          <div className="flex items-center justify-center h-64 flex-col gap-4 text-slate-400">
             <Loader2 size={32} className="animate-spin text-primary" />
             <p className="font-bold">Carregando Kanban...</p>
          </div>
        ) : (
          <div className="flex gap-6 min-h-[500px] h-full pb-8">
            {STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter(l => l.status === stage.id);
              return (
                <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-slate-50/50 rounded-[2rem] border border-slate-200/60 p-5">
                  <div className="flex items-center justify-between mb-6 px-2">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                        <span className="font-bold text-slate-700 text-xs uppercase tracking-widest">{stage.name}</span>
                        <span className="bg-white border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-lg font-bold">
                           {stageLeads.length}
                        </span>
                     </div>
                     <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                    {stageLeads.map((lead) => (
                      <motion.div
                        layoutId={lead.id}
                        key={lead.id}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                          if (info.offset.x > 150) {
                            const currentIdx = STAGES.findIndex(s => s.id === stage.id);
                            if (currentIdx < STAGES.length - 1) {
                              updateLeadStatus(lead.id, STAGES[currentIdx + 1].id);
                            }
                          } else if (info.offset.x < -150) {
                            const currentIdx = STAGES.findIndex(s => s.id === stage.id);
                            if (currentIdx > 0) {
                              updateLeadStatus(lead.id, STAGES[currentIdx - 1].id);
                            }
                          }
                        }}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative"
                      >
                        <div className="flex items-start justify-between mb-4">
                           <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{lead.full_name}</h4>
                           <span className="text-[10px] text-slate-300 font-mono">#{lead.id.slice(-4)}</span>
                        </div>
                        <div className="space-y-2 mb-6">
                           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                              <Building2 size={14} className="text-slate-400" />
                              <span className="truncate">{lead.company_name}</span>
                           </div>
                           <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                              <Mail size={14} className="text-slate-400" />
                              <span className="truncate">{lead.email}</span>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                           <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                              <Calendar size={14} className="text-slate-300" />
                              {new Date(lead.created_at).toLocaleDateString()}
                           </div>
                           <div className="flex gap-2">
                              {stage.id !== 'onboarding' && stage.id !== 'closed' && (
                                 <button 
                                    onClick={() => handleCreateAccount(lead)}
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110 shadow-sm"
                                    title="Criar Conta / Provisionar"
                                 >
                                    <CheckCircle size={16} />
                                 </button>
                              )}
                              <button 
                                onClick={() => updateLeadStatus(lead.id, stage.id === 'discovery' ? 'demo' : stage.id === 'demo' ? 'negotiation' : 'closed')}
                                className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all transform hover:scale-110 shadow-sm"
                              >
                                <ArrowRight size={16} />
                              </button>
                              <div className="relative group/delete">
                                 <button 
                                    onClick={() => {
                                       if(confirm('Remover este lead do Kanban?')) handleDeleteLead(lead.id);
                                    }}
                                    className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 shadow-sm"
                                    title="Excluir Lead"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

       {/* Provisioning Modal */}
      <AnimatePresence>
        {(isProvisioning || provisionedData) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 overflow-hidden border border-slate-100"
             >
                {isProvisioning ? (
                  <div className="text-center py-10">
                     <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-slate-50 rounded-[2rem]"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-[2rem] border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                           <Building2 size={40} />
                        </div>
                     </div>
                     <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Provisionando</h3>
                     <p className="text-slate-500 mt-3 font-medium">Instalando ambiente para {provisioningLead?.company_name}...</p>
                  </div>
                ) : (
                  <div className="text-center">
                     <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-inner">
                        <CheckCircle size={40} />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Ambiente Pronto!</h3>
                     <p className="text-slate-500 mt-3 mb-10 font-medium">Link de segurança gerado com sucesso.</p>
                     
                     <div className="bg-slate-50/50 rounded-[2rem] p-8 mb-10 text-left border border-slate-100 relative group">
                        <div className="space-y-4">
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">E-mail de Acesso</p>
                              <p className="text-sm font-bold text-slate-800">{provisionedData?.email}</p>
                           </div>
                           <div className="pt-4 border-t border-slate-200/50">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Link de Segurança</p>
                              <div className="flex items-center gap-2">
                                 <LinkIcon size={16} className="text-indigo-500" />
                                 <p className="text-xs font-mono font-bold text-indigo-600 tracking-tighter truncate flex-1">{provisionedData?.link}</p>
                              </div>
                           </div>
                        </div>
                        <button 
                          onClick={copyToClipboard}
                          className="absolute top-6 right-6 p-2.5 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all text-slate-400 hover:text-indigo-600 hover:border-indigo-100"
                        >
                           {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                        </button>
                     </div>

                     <button 
                       onClick={() => { setProvisionedData(null); setProvisioningLead(null); }}
                       className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-black shadow-xl shadow-slate-900/20 transition-all"
                     >
                        Confirmar e Voltar ao Kanban
                     </button>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Lead Modal */}
      <AnimatePresence>
        {isNewLeadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewLeadModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Novo Lead (SaaS)</h3>
                   <button onClick={() => setIsNewLeadModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors"><X size={24} /></button>
                </div>
                <form onSubmit={handleCreateLead} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nome Completo</label>
                         <input required type="text" value={newLeadForm.fullName} onChange={e => setNewLeadForm({...newLeadForm, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold placeholder:font-medium" placeholder="Ex: João Silva" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">E-mail Corporativo</label>
                         <input required type="email" value={newLeadForm.email} onChange={e => setNewLeadForm({...newLeadForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold placeholder:font-medium" placeholder="joao@empresa.com" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nome da Imobiliária</label>
                      <input required type="text" value={newLeadForm.companyName} onChange={e => setNewLeadForm({...newLeadForm, companyName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold placeholder:font-medium" placeholder="Ex: Silva Imóveis" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Telefone / WhatsApp</label>
                      <input type="text" value={newLeadForm.phone} onChange={e => setNewLeadForm({...newLeadForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold placeholder:font-medium" placeholder="(11) 99999-9999" />
                   </div>
                   <button type="submit" disabled={isSubmittingLead} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl shadow-slate-900/10 transition-all disabled:opacity-50 mt-6 flex items-center justify-center gap-2">
                      {isSubmittingLead ? <Loader2 className="animate-spin" size={20} /> : 'Cadastrar na Plataforma'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
