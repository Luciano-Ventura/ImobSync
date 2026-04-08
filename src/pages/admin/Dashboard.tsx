import { useGlobalContext } from '../../context/GlobalContext';
import { Eye, Clock, Archive, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const { properties, leads, refreshLeads } = useGlobalContext();

  const handleUpdateLeadStatus = async (id: string, newStatus: 'Novo' | 'Em Atendimento' | 'Arquivado') => {
    try {
      const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      await refreshLeads();
    } catch (err) {
      console.error('Erro ao atualizar status do lead:', err);
      alert('Erro ao atualizar status.');
    }
  };

  const novosLeads = leads.filter(l => l.status === 'Novo').length;
  const leadsAtendimentos = leads.filter(l => l.status === 'Em Atendimento').length;

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo': return 'text-emerald-700 bg-emerald-50 ring-emerald-600/20';
      case 'Em Atendimento': return 'text-blue-700 bg-blue-50 ring-blue-600/20';
      case 'Arquivado': return 'text-slate-600 bg-slate-50 ring-slate-500/10';
      default: return 'text-slate-600 bg-slate-50 ring-slate-500/10';
    }
  };

  return (
    <div className="max-w-7xl pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe suas captações e conversões em tempo real.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2"><Eye size={16} /> Total de Imóveis</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={64} className="text-emerald-500" />
          </div>
          <p className="text-emerald-700 font-medium text-sm relative z-10">Novos Leads</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2 relative z-10">{novosLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 font-medium text-sm">Leads em Atendimento</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{leadsAtendimentos}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 font-medium text-sm">Imóveis em Destaque</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{properties.filter(p => p.destaque).length}</p>
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Interesses Recentes (Leads)</h2>
          <button className="flex items-center gap-2 text-sm text-slate-500 font-medium hover:text-primary transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Filter size={16} /> Filtrar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                <th className="p-4 font-semibold text-slate-600">Cliente / Contato</th>
                <th className="p-4 font-semibold text-slate-600">Imóvel de Interesse</th>
                <th className="p-4 font-semibold text-slate-600">Data</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Status / Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{lead.nome}</p>
                    <div className="text-slate-500 text-xs mt-1 space-y-0.5">
                      <p>{lead.telefone}</p>
                      <p>{lead.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link to={`/imovel/${lead.propertyId}`} target="_blank" className="font-medium text-blue-600 hover:text-blue-800 transition-colors block mb-1">
                      {lead.propertyTitulo}
                    </Link>
                    <p className="text-slate-500 text-xs italic bg-white p-2 rounded border border-slate-100">"{lead.mensagem}"</p>
                  </td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">
                    {formatDate(lead.data)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      {lead.status === 'Novo' && (
                        <button onClick={() => handleUpdateLeadStatus(lead.id, 'Em Atendimento')} className="text-xs font-medium text-primary hover:text-highlight transition-colors flex items-center gap-1 border border-slate-200 bg-white px-2.5 py-1.5 rounded shadow-sm">
                          <Eye size={12} /> Assumir
                        </button>
                      )}
                      {lead.status === 'Em Atendimento' && (
                        <button onClick={() => handleUpdateLeadStatus(lead.id, 'Arquivado')} className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 border border-slate-200 bg-white px-2.5 py-1.5 rounded shadow-sm">
                          <Archive size={12} /> Arquivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">Nenhum lead recebido ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
