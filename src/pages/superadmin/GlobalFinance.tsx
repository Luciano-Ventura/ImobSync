import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CreditCard, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

interface GlobalStats {
  totalRevenue: number;
  mrr: number;
  pendingRevenue: number;
  growth: number;
}

export default function GlobalFinance() {
  const [stats] = useState<GlobalStats>({
    totalRevenue: 142000,
    mrr: 12500,
    pendingRevenue: 8400,
    growth: 12.5
  });

  useEffect(() => {
     // Em um cenário real, aqui faríamos um fetch consolidado de todos os tenants
     // via RPC ou uma view administrativa. Por enquanto, simulamos dados vivos.
     setTimeout(() => {}, 800);
  }, []);

  const cards = [
    { name: 'Receita Total Acumulada', value: `R$ ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'MRR (Mensal Recorrente)', value: `R$ ${stats.mrr.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Contas a Receber', value: `R$ ${stats.pendingRevenue.toLocaleString()}`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Crescimento Mensal', value: `${stats.growth}%`, icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Financeiro Global</h1>
        <p className="text-slate-500">Visão consolidada do faturamento de todos os tenants ImobSync.</p>
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
          <h3 className="font-bold text-lg text-slate-800">Desempenho por Imobiliária</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Mês Atual</button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Exportar</button>
          </div>
        </div>

        <div className="space-y-6">
           {/* Placeholder de Tabela Consolidada */}
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                      <CreditCard size={18} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-800">Tenant Exemplo {i}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Plano Premium • 12 transações</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-slate-800">R$ {(Math.random() * 20000 + 5000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                   <p className="text-[10px] text-emerald-500 font-bold uppercase">Repassado</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
