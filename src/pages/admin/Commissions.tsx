import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, TrendingUp, Calendar, CreditCard, Plus, Loader2 } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';
import { supabase } from '../../lib/supabase';

export default function Commissions() {
  const { sales, refreshSales, properties, tenant } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newSale, setNewSale] = useState({
    propertyId: '',
    valorVenda: '',
    valorComissao: '',
    corretorNome: 'Equipe Própria',
    status: 'Pago' as 'Pago' | 'Pendente',
    tipoContrato: 'Venda' as 'Venda' | 'Locação',
    periodicidade: 'Única' as 'Única' | 'Mensal'
  });

  const totalComissao = sales.reduce((acc, s) => acc + s.valorComissao, 0);
  const totalVendas = sales.reduce((acc, s) => acc + s.valorVenda, 0);
  const salesCount = sales.length;

  const handleRegisterSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!tenant) throw new Error('Tenant não identificado');
      
      const selectedProperty = properties.find(p => p.id === newSale.propertyId);
      if (!selectedProperty) throw new Error('Selecione um imóvel');

      const { error } = await supabase.from('sales_records').insert([{
        tenant_id: tenant.id, // VINCULAR AO TENANT
        property_id: newSale.propertyId,
        property_titulo: selectedProperty.titulo,
        valor_venda: parseFloat(newSale.valorVenda),
        valor_comissao: parseFloat(newSale.valorComissao),
        corretor_nome: newSale.corretorNome,
        status: newSale.status,
        tipo_contrato: newSale.tipoContrato,
        periodicidade: newSale.periodicidade
      }]);

      if (error) throw error;

      await refreshSales();
      setIsModalOpen(false);
      setNewSale({
        propertyId: '',
        valorVenda: '',
        valorComissao: '',
        corretorNome: 'Equipe Própria',
        status: 'Pago',
        tipoContrato: 'Venda',
        periodicidade: 'Única'
      });
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      alert('Erro ao registrar venda. Verifique os campos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gestão Financeira</h1>
          <p className="text-slate-500">Controle suas vendas e comissões recebidas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
        >
          <Plus size={18} /> Registrar Fechamento
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Comissões</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalComissao)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CircleDollarSign size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Volume Transacionado</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalVendas)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-highlight/10 text-highlight rounded-xl">
              <Calendar size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Negócios</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{salesCount} <span className="text-lg font-medium text-slate-400">negócios</span></p>
        </motion.div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50">
          <h2 className="text-lg font-bold text-primary">Histórico de Fechamentos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Imóvel</th>
                <th className="px-8 py-4">Contrato</th>
                <th className="px-8 py-4">Valor Total</th>
                <th className="px-8 py-4">Sua Comissão</th>
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.length > 0 ? sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-primary text-sm">{sale.propertyTitulo}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{sale.propertyId.slice(0, 8)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${sale.tipoContrato === 'Venda' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {sale.tipoContrato}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-slate-600 font-medium">
                      {formatCurrency(sale.valorVenda)}
                      {sale.periodicidade === 'Mensal' && <span className="text-xs text-slate-400 font-normal"> /mês</span>}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-emerald-600 font-bold">
                      {formatCurrency(sale.valorComissao)}
                      {sale.periodicidade === 'Mensal' && <span className="text-xs text-emerald-400/70 font-normal"> /mês</span>}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-xs">
                    {new Date(sale.dataVenda).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sale.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-500">
                    <CreditCard size={48} className="mx-auto text-slate-200 mb-4" />
                    <p>Nenhuma venda registrada ainda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Venda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-slate-900">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-xl p-8 relative z-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Registrar Fechamento</h2>
            
            <form onSubmit={handleRegisterSale} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Imóvel Fechado</label>
                <select 
                  required
                  value={newSale.propertyId}
                  onChange={e => setNewSale({...newSale, propertyId: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary focus:border-primary text-sm font-semibold"
                >
                  <option value="">Selecione o imóvel...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.titulo}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Contrato</label>
                  <select 
                    value={newSale.tipoContrato}
                    onChange={e => setNewSale({...newSale, tipoContrato: e.target.value as any})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary focus:border-primary text-sm font-semibold"
                  >
                    <option value="Venda">Venda</option>
                    <option value="Locação">Locação</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Periodicidade da Ganho</label>
                  <select 
                    value={newSale.periodicidade}
                    onChange={e => setNewSale({...newSale, periodicidade: e.target.value as any})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary focus:border-primary text-sm font-semibold"
                  >
                    <option value="Única">Pagamento Único (Venda/Taxa)</option>
                    <option value="Mensal">Recorrente Mensal (Aluguel)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valor do Negócio (R$)</label>
                  <input 
                    required type="number" step="0.01" placeholder="Ex: 500000"
                    value={newSale.valorVenda}
                    onChange={e => setNewSale({...newSale, valorVenda: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary focus:border-primary text-sm font-semibold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sua Comissão (R$)</label>
                  <input 
                    required type="number" step="0.01" placeholder="Ex: 15000"
                    value={newSale.valorComissao}
                    onChange={e => setNewSale({...newSale, valorComissao: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary focus:border-primary text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Corretor / Equipe</label>
                  <input 
                    type="text"
                    value={newSale.corretorNome}
                    onChange={e => setNewSale({...newSale, corretorNome: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary focus:border-primary text-sm font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Pagamento</label>
                  <select 
                    value={newSale.status}
                    onChange={e => setNewSale({...newSale, status: e.target.value as any})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary focus:border-primary text-sm font-semibold"
                  >
                    <option value="Pago">Já Recebido (Pago)</option>
                    <option value="Pendente">A Receber (Pendente)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="flex-[2] px-6 py-4 rounded-xl bg-primary text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Confirmar Registro'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
