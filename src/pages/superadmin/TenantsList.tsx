import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import type { Tenant } from '../../types/index';
import { Building2, Search, Filter, ShieldCheck, ShieldAlert, ExternalLink, Mail, Trash2, AlertTriangle } from 'lucide-react';

export default function TenantsList() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (err) {
      console.error('Erro ao buscar tenants:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabaseAdmin
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTenants(prev => prev.filter(t => t.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erro ao excluir tenant:', err);
      alert('Erro ao excluir imobiliária. Verifique as permissões.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Imobiliárias (Tenants)</h1>
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
               className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64 text-sm"
             />
           </div>
           <button 
             onClick={() => alert('Filtros avançados serão implementados na próxima versão.')}
             className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
           >
              <Filter size={20} className="text-slate-600" />
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Imobiliária</th>
                  <th className="px-6 py-4 font-bold">Domínio / Slug</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Plano</th>
                  <th className="px-6 py-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{tenant.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{tenant.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{tenant.slug}</span>
                        <a 
                          href={`http://${tenant.slug}.localhost:5173`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        tenant.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {tenant.status === 'active' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {tenant.status === 'active' ? 'Ativo' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-medium text-slate-700">Broker Pro</span>
                    </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => window.location.href = `mailto:${tenant.slug}@imobsync.com.br`}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Enviar E-mail"
                          >
                             <Mail size={18} />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(tenant.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Excluir Imobiliária"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                     </td>
                  </tr>
                ))}
                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                       Nenhuma imobiliária encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteConfirm(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Excluir Imobiliária?</h3>
            <p className="text-slate-500 text-center text-sm mb-8">
              Esta ação é permanente e removerá todos os dados vinculados a esta instância.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
