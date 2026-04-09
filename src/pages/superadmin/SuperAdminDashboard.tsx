import { useAuth } from '../../context/AuthContext';
import { Users, Building2, TrendingUp, Handshake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const { profile } = useAuth();

  const stats = [
    { name: 'Total de Tenants', value: '12', icon: Building2, trend: '+2 este mês', trendType: 'up' },
    { name: 'Leads Plataforma', value: '48', icon: Users, trend: '+15%', trendType: 'up' },
    { name: 'ARR (Receita Anual)', value: 'R$ 142.000', icon: TrendingUp, trend: '+8% vs mês ant.', trendType: 'up' },
    { name: 'Taxa de Conversão', value: '18.4%', icon: Handshake, trend: '-2%', trendType: 'down' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-slate-800">Bem-vindo, {profile?.fullName || 'Super Admin'}</h1>
         <p className="text-slate-500">Aqui está o que está acontecendo na plataforma ImobSync hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <Link 
            to={stat.name === 'Total de Tenants' ? '/super-admin/tenants' : stat.name === 'Leads Plataforma' ? '/super-admin/leads' : '#'}
            key={stat.name}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all hover:shadow-md cursor-pointer h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {stat.trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Platform Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Novos Leads (Interessados)</h3>
            <Link to="/super-admin/leads" className="text-sm text-indigo-600 font-semibold hover:underline">Ver todos</Link>
          </div>
          <div className="p-0">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                 <tr>
                   <th className="px-6 py-3 font-semibold">Nome</th>
                   <th className="px-6 py-3 font-semibold">Empresa</th>
                   <th className="px-6 py-3 font-semibold">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {[1, 2, 3, 4].map((lead) => (
                   <tr key={lead} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800 text-sm">Lead Exemplo {lead}</div>
                        <div className="text-xs text-slate-500">contato@exemplo.com</div>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-600">Imobiliária Alfa</td>
                     <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg uppercase">Novo</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Latest Active Tenants */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Tenants Ativos Recentemente</h3>
            <Link to="/super-admin/tenants" className="text-sm text-indigo-600 font-semibold hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((tenant) => (
              <div key={tenant} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Building2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-800 truncate">Sua Imobiliária {tenant}</p>
                   <p className="text-xs text-slate-500 truncate">tenant-{tenant}.imobsync.com</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-800">Plano Premium</p>
                   <p className="text-[10px] text-emerald-500 font-bold uppercase">Ativo</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
