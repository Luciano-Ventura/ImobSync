import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CreditCard, ArrowUpRight, DollarSign, Wallet, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GlobalStats {
  totalRevenue: number;
  mrr: number;
  pendingRevenue: number;
  growth: number;
}

interface TenantSubscription {
  id: string;
  name: string;
  plan_name: string;
  subscription_value: number;
  subscription_status: string;
  next_billing_date: string;
  created_at: string;
}

export default function GlobalFinance() {
  const [stats, setStats] = useState<GlobalStats>({
    totalRevenue: 0,
    mrr: 0,
    pendingRevenue: 0,
    growth: 0
  });
  const [subscriptions, setSubscriptions] = useState<TenantSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalFinance();
  }, []);

  const fetchGlobalFinance = async () => {
    try {
      setLoading(true);
      const { data: tenants, error } = await supabase
        .from('tenants')
        .select('id, name, plan_name, subscription_value, subscription_status, next_billing_date, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (tenants) {
        // Formatar subscrições
        const subs: TenantSubscription[] = tenants.map(t => ({
          id: t.id,
          name: t.name,
          plan_name: t.plan_name || 'Individual',
          subscription_value: t.subscription_value || 0,
          subscription_status: t.subscription_status || 'active',
          next_billing_date: t.next_billing_date || new Date().toISOString(),
          created_at: t.created_at
        }));
        setSubscriptions(subs);

        // Calcular estatísticas
        const mrr = subs
          .filter(s => s.subscription_status === 'active')
          .reduce((sum, s) => sum + s.subscription_value, 0);

        const pending = subs
          .filter(s => s.subscription_status === 'past_due')
          .reduce((sum, s) => sum + s.subscription_value, 0);

        // Estimativa de receita acumulada (simplificada: meses desde criação * valor)
        const total = subs.reduce((sum, s) => {
          const months = Math.max(1, Math.floor((new Date().getTime() - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)));
          return sum + (s.subscription_value * months);
        }, 0);

        setStats({
          totalRevenue: total,
          mrr: mrr,
          pendingRevenue: pending,
          growth: 15.2 // Mock growth for now
        });
      }
    } catch (err) {
      console.error('Erro ao buscar financeiro global:', err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { name: 'Receita SaaS Acumulada', value: `R$ ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'MRR (Recorrência Mensal)', value: `R$ ${stats.mrr.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Mensalidades em Aberto', value: `R$ ${stats.pendingRevenue.toLocaleString()}`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Crescimento SaaS', value: `${stats.growth}%`, icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display text-highlight">Recorrência SaaS</h1>
        <p className="text-slate-500">Gestão de assinaturas e faturamento direto das imobiliárias parceiras.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={card.name} 
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">{card.name}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-lg text-slate-800">Status de Assinaturas SaaS</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Todos os Planos</button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Relatório PDF</button>
          </div>
        </div>

        <div className="space-y-6">
           {subscriptions.length === 0 ? (
             <p className="text-center py-10 text-slate-400 font-medium">Nenhuma assinatura encontrada.</p>
           ) : (
             subscriptions.map((sub, i) => (
               <div key={sub.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                        <CreditCard size={18} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-800">{sub.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {sub.plan_name} • Próximo vencimento: {new Date(sub.next_billing_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-slate-800">R$ {sub.subscription_value.toLocaleString()}</p>
                     <p className={`text-[10px] font-bold uppercase ${
                       sub.subscription_status === 'active' ? 'text-emerald-500' : 
                       sub.subscription_status === 'past_due' ? 'text-amber-500' : 'text-rose-500'
                     }`}>
                       {sub.subscription_status === 'active' ? 'Pago' : sub.subscription_status === 'past_due' ? 'Pendente' : 'Atrasado'}
                     </p>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
