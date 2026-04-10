import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import type { Tenant } from '../../types/index';
import { Building2, Search, Filter, ShieldCheck, ShieldAlert, ExternalLink, Mail, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function TenantsList() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (err) {
      console.error('Erro ao buscar tenants:', err);
      showToast('Erro ao carregar imobiliárias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      // Usando Soft Delete (Desativação) conforme discutido
      const { error } = await supabaseAdmin
        .from('tenants')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;
      
      setTenants(prev => prev.map(t => t.id === id ? { ...t, status: 'inactive' } : t));
      showToast('Imobiliária desativada com sucesso');
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erro ao desativar tenant:', err);
      showToast('Erro ao desativar imobiliária', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display text-highlight">Imobiliárias (Tenants)</h1>
          <p className="text-slate-500">Gerencie todas as instâncias ativas do ImobSync.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Buscar por nome ou slug..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64 text-sm font-semibold"
             />
           </div>
           
           <div className="flex bg-white border border-slate-200 rounded-xl p-1">
             {(['all', 'active', 'inactive'] as const).map((s) => (
               <button
                 key={s}
                 onClick={() => setStatusFilter(s)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                   statusFilter === s ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {s === 'all' ? 'Todas' : s === 'active' ? 'Ativas' : 'Inativas'}
               </button>
             ))}
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 font-bold">Imobiliária</th>
                  <th className="px-8 py-5 font-bold">Domínio / Slug</th>
                  <th className="px-8 py-5 font-bold">Status</th>
                  <th className="px-8 py-5 font-bold">Faturamento</th>
                  <th className="px-8 py-5 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          tenant.status === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Building2 size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{tenant.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{tenant.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-bold font-mono text-slate-600">{tenant.slug}</span>
                        <a 
                          href={`http://${tenant.slug}.localhost:5173`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tenant.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {tenant.status === 'active' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {tenant.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="text-sm font-bold text-slate-700">R$ {(tenant as any).subscription_value?.toLocaleString() || '499,00'}</div>
                       <div className="text-[10px] text-slate-400 font-medium tracking-tight">{(tenant as any).plan_name || 'Broker Pro'}</div>
                    </td>
                     <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => window.location.href = `mailto:${tenant.slug}@imobsync.com.br`}
                            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-100"
                            title="Enviar E-mail"
                          >
                             <Mail size={18} />
                          </button>
                          {tenant.status === 'active' && (
                            <button 
                              onClick={() => setDeleteConfirm(tenant.id)}
                              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-100"
                              title="Desativar Imobiliária"
                            >
                               <Trash2 size={18} />
                            </button>
                          )}
                       </div>
                     </td>
                  </tr>
                ))}
                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center gap-2 opacity-30">
                          <Building2 size={48} />
                          <p className="font-bold">Nenhuma imobiliária encontrada.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isDeleting && setDeleteConfirm(null)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-slate-100"
          >
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
               <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-3">Desativar Acesso?</h3>
            <p className="text-slate-500 text-center text-sm mb-10 leading-relaxed font-medium">
              O acesso desta imobiliária será suspenso imediatamente, mas os dados serão preservados no sistema.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl shadow-slate-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : 'Sim, Desativar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
