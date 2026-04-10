import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalContext } from '../../context/GlobalContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Trash2, 
  X,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'user' | 'super-admin';
  created_at: string;
}

export default function TeamList() {
  const { profile } = useAuth();
  const { tenant } = useGlobalContext();
  const { showToast } = useToast();
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  });

  const fetchTeam = useCallback(async () => {
    const activeTenantId = profile?.tenantId || tenant?.id;
    if (!activeTenantId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Usa supabaseAdmin para bypassar RLS e buscar todos os perfis do tenant
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('tenant_id', activeTenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data as Profile[]);
    } catch (err) {
      console.error('Erro ao carregar equipe:', err);
      showToast('Erro ao carregar equipe', 'error');
    } finally {
      setLoading(false);
    }
  }, [profile?.tenantId, tenant?.id, showToast]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.tenantId && !tenant?.id) {
      showToast('Acesso negado: Perfil sem imobiliária vinculada.', 'error');
      return;
    }

    if (!supabaseAdmin) {
      showToast('Erro de Configuração: Chave de administrador não encontrada. Verifique o arquivo .env (VITE_SUPABASE_SERVICE_ROLE_KEY).', 'error');
      return;
    }
    
    setIsSubmittingInvite(true);
    try {
      // 1. Criar usuário no Auth (sem confirmação imediata para gerar link de convite)
      const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: inviteForm.email,
        email_confirm: false,
        user_metadata: { full_name: inviteForm.fullName }
      });

      if (authError) throw authError;

      // 2. Criar perfil vinculado ao tenant e role escolhido
      const { error: profileError } = await supabaseAdmin.from('profiles').insert([{
        id: userData.user.id,
        tenant_id: profile?.tenantId || tenant?.id,
        role: inviteForm.role,
        full_name: inviteForm.fullName
      }]);

      if (profileError) throw profileError;

      // 3. Gerar link de convite para o usuário definir senha
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: inviteForm.email,
        options: { redirectTo: `${window.location.origin}/definir-senha` }
      });

      if (linkError) throw linkError;

      showToast('Corretor convidado com sucesso!');
      
      // Mostrar o link para o admin copiar (opcional, mas útil se o e-mail falhar)
      console.log('Invite Link:', linkData.properties.action_link);
      
      setIsInviteModalOpen(false);
      setInviteForm({ fullName: '', email: '', role: 'user' });
      fetchTeam();
    } catch (err: any) {
      console.error('Erro ao convidar:', err);
      showToast(`Erro ao convidar: ${err.message}`, 'error');
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (id === profile?.id) {
      showToast('Você não pode se auto-remover.', 'info');
      return;
    }

    if (!confirm(`Tem certeza que deseja remover ${name} da equipe? Esta ação não pode ser desfeita.`)) return;

    try {
      // 1. Remove o perfil da tabela profiles
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id);
      if (profileError) throw profileError;

      // 2. Deleta o usuário do Auth (bloqueia acesso definitivamente)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) {
        // Não é crítico se o auth.delete falhar após o profile ser removido
        console.warn('Aviso: perfil removido mas erro ao deletar usuário do Auth:', authError.message);
      }

      showToast(`${name} removido da equipe com sucesso.`, 'success');
      fetchTeam();
    } catch (err: any) {
      console.error('Erro ao remover membro:', err);
      showToast(`Erro ao remover: ${err.message}`, 'error');
    }
  };

  const filteredMembers = members.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Minha Equipe</h1>
          <p className="text-slate-500 mt-1">Gerencie os corretores e administradores da sua imobiliária.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10"
        >
          <UserPlus size={20} />
          Convidar Corretor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                 <Users size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total de Membros</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{members.length}</p>
              </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Administradores</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{members.filter(m => m.role === 'admin').length}</p>
              </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                 <Shield size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Corretores (User)</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{members.filter(m => m.role === 'user').length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Buscar por nome ou cargo..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
             />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-slate-300 mb-4" size={40} />
            <p className="text-slate-400 font-medium font-mono text-sm">Carregando membros da equipe...</p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Membro</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Nível de Acesso</th>
                  <th className="px-8 py-5 text-[10px) font-bold text-slate-400 uppercase tracking-widest font-mono">Entrou em</th>
                  <th className="px-8 py-5 text-[10px) font-bold text-slate-400 uppercase tracking-widest font-mono text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                          {member.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-700">{member.full_name || 'Usuário sem nome'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        member.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {member.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                        {member.role === 'admin' ? 'Administrador' : 'Corretor'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-500">
                         {new Date(member.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => handleDeleteMember(member.id, member.full_name || '')}
                         className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
             <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-6">
                <Users size={40} />
             </div>
             <p className="text-slate-800 font-bold text-lg">Nenhum membro encontrado</p>
             <p className="text-slate-400 max-w-xs mt-2 text-sm leading-relaxed">
               {searchTerm ? 'Nenhum resultado para sua busca.' : 'Você ainda não cadastrou membros na sua equipe de corretores.'}
             </p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                       <UserPlus size={24} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-slate-800 tracking-tight font-display">Convidar para Equipe</h3>
                       <p className="text-xs text-slate-400 font-medium">O corretor receberá um link seguro de cadastro.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsInviteModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors">
                    <X size={24} />
                  </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Nome Completo</label>
                    <input 
                      required type="text" 
                      value={inviteForm.fullName}
                      onChange={e => setInviteForm({...inviteForm, fullName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold" 
                      placeholder="Ex: Carlos Oliveira"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">E-mail Corporativo</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         required type="email" 
                         value={inviteForm.email}
                         onChange={e => setInviteForm({...inviteForm, email: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold" 
                         placeholder="carlos@seunegocio.com"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Nível de Acesso</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button
                         type="button"
                         onClick={() => setInviteForm({...inviteForm, role: 'user'})}
                         className={`p-4 rounded-2xl border-2 text-left transition-all ${inviteForm.role === 'user' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                       >
                          <Shield size={20} className={inviteForm.role === 'user' ? 'text-primary' : 'text-slate-300'} />
                          <div className="mt-2 text-sm font-bold text-slate-700">Corretor</div>
                          <div className="text-[9px] text-slate-400 font-medium">Acesso a leads e imóveis.</div>
                       </button>
                       <button
                         type="button"
                         onClick={() => setInviteForm({...inviteForm, role: 'admin'})}
                         className={`p-4 rounded-2xl border-2 text-left transition-all ${inviteForm.role === 'admin' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                       >
                          <ShieldCheck size={20} className={inviteForm.role === 'admin' ? 'text-indigo-600' : 'text-slate-300'} />
                          <div className="mt-2 text-sm font-bold text-slate-700">Administrador</div>
                          <div className="text-[9px] text-slate-400 font-medium">Gerência total do Tenant.</div>
                       </button>
                    </div>
                 </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6">
                    <p className="text-[11px] font-bold text-amber-700 leading-snug">
                       ⚠️ MODO DESENVOLVEDOR: O convite **não** envia e-mail. <br />
                       O link de ativação aparecerá no **Console (F12)** do seu navegador após clicar no botão abaixo.
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmittingInvite}
                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-black shadow-xl shadow-slate-900/10 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                  >
                     {isSubmittingInvite ? <Loader2 className="animate-spin" size={20} /> : 'Enviar Convite Seguro'}
                  </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
