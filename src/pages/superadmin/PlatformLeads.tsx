import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Mail, Building2, Calendar, CheckCircle, ArrowRight, Copy, Check, Link as LinkIcon } from 'lucide-react';

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
  const [provisioningLead, setProvisioningLead] = useState<PlatformLead | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionedData, setProvisionedData] = useState<{email: string, link: string} | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erro ao buscar leads da plataforma:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('platform_leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (error) throw error;
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus as any } : l));
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleCreateAccount = async (lead: PlatformLead) => {
    setProvisioningLead(lead);
    setIsProvisioning(true);
    setProvisionedData(null);

    try {
      // 1. Criar Usuário silenciosamente via Admin API (evita disparar e-mail automático do Supabase)
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: lead.email,
        email_confirm: false,
        user_metadata: { full_name: lead.full_name }
      });

      if (userError) throw userError;
      const newUser = userData.user;

      // 2. Criar o Tenant (Imobiliária) - Usando Admin para bypassar RLS
      const slug = lead.company_name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { data: tenant, error: tError } = await supabaseAdmin.from('tenants').insert([{
        name: lead.company_name,
        slug: slug,
        status: 'active'
      }]).select().single();

      if (tError) throw tError;

      // 3. Criar o Perfil - Usando Admin para bypassar RLS
      const { error: pError } = await supabaseAdmin.from('profiles').insert([{
        id: newUser.id,
        tenant_id: tenant.id,
        role: 'admin',
        full_name: lead.full_name
      }]);

      if (pError) throw pError;

      // 4. Gerar o link de convite real (Invite) que permite definir a senha
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: lead.email,
        options: { redirectTo: `${window.location.origin}/definir-senha` }
      });

      if (linkError) throw linkError;

      // 5. Marcar lead como onboarding
      await updateLeadStatus(lead.id, 'onboarding');

      setProvisionedData({ email: lead.email, link: linkData.properties.action_link });
    } catch (err: any) {
      console.error('Erro no provisionamento real:', err);
      alert(`Erro: ${err.message || 'Erro desconhecido'}. Certifique-se de configurar a VITE_SUPABASE_SERVICE_ROLE_KEY.`);
    } finally {
      setIsProvisioning(false);
    }
  };

  const copyToClipboard = () => {
    if (!provisionedData) return;
    const text = `Boas-vindas ao ImobSync!\n\nSua plataforma já está pronta. Use o link seguro abaixo para definir sua senha e acessar seu painel:\n\n${provisionedData.link}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1600px] mx-auto overflow-hidden flex flex-col h-screen -m-8 md:-m-12">
      <div className="p-8 md:p-12 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-display">Funil de Vendas SaaS</h1>
            <p className="text-slate-500">Gestão de leads interessados na plataforma ImobSync.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={fetchLeads} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                Atualizar
             </button>
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Plus size={18} /> Novo Lead
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-8 md:p-12 pt-0 h-full">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">Carregando Kanban...</div>
        ) : (
          <div className="flex gap-6 min-h-[500px] h-full pb-8">
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4">
                <div className="flex items-center justify-between mb-4 px-2">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                      <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">{stage.name}</span>
                      <span className="bg-white border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                         {leads.filter(l => l.status === stage.id).length}
                      </span>
                   </div>
                   <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                  {leads.filter(l => l.status === stage.id).map((lead) => (
                    <motion.div
                      layoutId={lead.id}
                      key={lead.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex items-start justify-between mb-3">
                         <h4 className="font-bold text-slate-800 text-sm leading-tight">{lead.full_name}</h4>
                         <span className="text-[10px] text-slate-400 font-medium">#{lead.id.slice(-4)}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                         <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Building2 size={12} />
                            <span className="truncate">{lead.company_name}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail size={12} />
                            <span className="truncate">{lead.email}</span>
                         </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Calendar size={12} />
                            {new Date(lead.created_at).toLocaleDateString()}
                         </div>
                         <div className="flex gap-1">
                            {stage.id !== 'onboarding' && stage.id !== 'closed' && (
                               <button 
                                  onClick={() => handleCreateAccount(lead)}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110"
                                  title="Criar Conta / Provisionar"
                               >
                                  <CheckCircle size={14} />
                               </button>
                            )}
                            <button 
                               onClick={() => updateLeadStatus(lead.id, stage.id === 'discovery' ? 'demo' : stage.id === 'demo' ? 'negotiation' : 'closed')}
                               className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all transform hover:scale-110"
                            >
                               <ArrowRight size={14} />
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Provisioning Modal */}
      <AnimatePresence>
        {(isProvisioning || provisionedData) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 overflow-hidden"
             >
                {isProvisioning ? (
                  <div className="text-center py-8">
                     <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                           <Building2 size={32} />
                        </div>
                     </div>
                     <h3 className="text-xl font-bold text-slate-800">Provisionando Imobiliária</h3>
                     <p className="text-slate-500 mt-2">Criando banco de dados e acessos para {provisioningLead?.company_name}...</p>
                  </div>
                ) : (
                  <div className="text-center">
                     <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                        <CheckCircle size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-800">Conta Criada com Sucesso!</h3>
                     <p className="text-slate-500 mt-2 mb-8">Copie o link seguro abaixo e envie para o cliente definir a senha.</p>
                     
                     <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100 relative group">
                        <div className="space-y-3">
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">E-mail de Acesso</p>
                              <p className="text-sm font-bold text-slate-800">{provisionedData?.email}</p>
                           </div>
                           <div className="pt-3 border-t border-slate-200/50">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Link de Segurança</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <LinkIcon size={14} className="text-indigo-500" />
                                 <p className="text-xs font-mono font-bold text-indigo-600 tracking-tight truncate flex-1">{provisionedData?.link}</p>
                              </div>
                           </div>
                        </div>
                        <button 
                          onClick={copyToClipboard}
                          className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all text-slate-400 hover:text-indigo-600"
                        >
                           {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                     </div>

                     <button 
                       onClick={() => { setProvisionedData(null); setProvisioningLead(null); }}
                       className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all"
                     >
                        Fechar e Atualizar Kanban
                     </button>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
