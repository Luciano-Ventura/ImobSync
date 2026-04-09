import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Layout, Rocket, Shield, Zap, ArrowRight, BarChart3, Globe, Smartphone, X, Loader2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SalesLanding() {
  const [activeMockup, setActiveMockup] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: ''
  });
  
  // Imagens premium geradas do sistema
  const mockups = [
    { 
      url: '/assets/mockup_vitrine_premium.png', 
      title: 'Vitrine de Luxo', 
      desc: 'Sua imobiliária com visual cinematográfico e ultra veloz.' 
    },
    { 
      url: '/assets/mockup_admin_dashboard.png', 
      title: 'Painel de Gestão', 
      desc: 'Controle total de imóveis, leads e comissões com estética Midnight Blue.' 
    }
  ];

  
  const mobileMockup = '/assets/mockup_mobile_final.png'; // Mockup dedicado 9:16

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMockup((prev) => (prev + 1) % mockups.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('platform_leads').insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company_name,
          status: 'discovery'
        }
      ]);

      if (error) throw error;
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setFormData({ full_name: '', email: '', phone: '', company_name: '' });
      }, 3000);

    } catch (err) {
      console.error('Erro ao enviar lead:', err);
      alert('Ocorreu um erro ao enviar seus dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { title: "Vitrine White-Label", desc: "Sua marca, suas cores. Um site profissional em minutos sem precisar programar nada.", icon: Layout, color: "bg-indigo-500" },
    { title: "SEO Otimizado", desc: "Seus imóveis no topo do Google com meta-tags automáticas e alta performance.", icon: Globe, color: "bg-emerald-500" },
    { title: "Gestão Financeira", desc: "Controle de comissões e vendas. Saiba exatamente quanto ganhou em cada fechamento.", icon: BarChart3, color: "bg-amber-500" },
    { title: "Mobile First", desc: "Experiência perfeita em smartphones. Seus clientes compram de qualquer lugar.", icon: Smartphone, color: "bg-purple-500" },
    { title: "Escalabilidade SaaS", desc: "Provisionamento instantâneo. Tenha sua imobiliária no ar em segundos.", icon: Zap, color: "bg-sky-500" },
    { title: "Ambiente Seguro", desc: "Dados protegidos com tecnologia Supabase e autenticação de ponta.", icon: Shield, color: "bg-rose-500" }
  ];

  const plans = [
    { name: "Broker Pro", price: "97", features: ["Até 50 imóveis", "SEO Otimizado", "Dashboard Financeiro", "Suporte via WhatsApp", "Subdomínio incluso"], recommended: false },
    { name: "Agency Premium", price: "197", features: ["Imóveis Ilimitados", "Domínio Próprio", "Dashboard Multi-corretor", "Prioridade no Suporte", "Integração CRECI"], recommended: true },
    { name: "Enterprise", price: "Custom", features: ["Setup Personalizado", "Integração via API", "Banners Exclusivos", "Treinamento de Equipe", "Suporte 24/7"], recommended: false }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Navbar Premium */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
              <Rocket className="text-white" size={24} />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">Imob<span className="text-indigo-500">Sync</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Tecnologia</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)} 
              className="bg-white text-slate-900 px-6 py-2.5 rounded-xl hover:bg-slate-200 transition-all font-bold shadow-lg shadow-white/10"
            >
              Começar Agora
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Restauração do Design solicitado: Celular + Carrossel Fundo */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        
        {/* Carousel Experimental Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={activeMockup}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img src={mockups[activeMockup].url} className="w-full h-full object-cover grayscale-[20%] brightness-50" alt="Background" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border border-indigo-500/20 backdrop-blur-md uppercase tracking-widest">
              <Star size={14} className="fill-indigo-400" /> Sistema de Gestão Real Estate 3.0
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.95] mb-8 tracking-tighter text-slate-100">
              Dê um <span className="text-indigo-500">Sync</span> no seu <br />
              potencial.
            </h1>

            <p className="text-xl text-slate-300 max-w-xl mb-12 leading-relaxed">
              Gestão inteligente e vitrines cinematográficas. Transforme sua imobiliária em um ecossistema digital de alta performance com a tecnologia do <span className="text-white font-semibold">ImobSync.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white text-lg px-10 py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-2 group"
              >
                Ativar Minha Licença <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('/tec-imob', '_blank')}
                className="bg-white/5 text-white border border-white/10 text-lg px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Ver Exemplo Real
              </motion.button>
            </div>

            <div className="mt-12 flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
               </div>
               <div className="text-sm">
                  <p className="text-white font-bold">Aprovado por +150 imobiliárias</p>
                  <p className="text-slate-400 font-medium">Crescimento real acelerado</p>
               </div>
            </div>
          </motion.div>

          {/* Celular Flutuante Lado a Lado (Restaurado) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2 }}
            className="flex justify-center lg:justify-end relative"
          >
            <div className="relative group">
               {/* Glow effect */}
               <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full scale-110 opacity-50 group-hover:opacity-80 transition-opacity"></div>
               
               {/* Smartphone Frame (Symmetric) */}
               <div className="relative w-[280px] h-[580px] bg-[#0f172a] rounded-[3.2rem] p-2.5 shadow-2xl border-[6px] border-slate-700 animate-float ring-1 ring-white/10">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0f172a] rounded-b-2xl z-40 flex items-center justify-center gap-1.5">
                    <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                  </div>
                  
                  {/* Screen Content - Mobile Only */}
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-black relative z-10">
                    <img 
                      src={mobileMockup} 
                      className="w-full h-full object-cover" 
                      alt="App Mobile Final" 
                    />
                  </div>

                  {/* Physical Buttons (Symmetric) */}
                  <div className="absolute -left-1.5 top-28 w-1 h-10 bg-slate-600 rounded-l-md"></div>
                  <div className="absolute -right-1.5 top-36 w-1 h-16 bg-slate-600 rounded-r-md"></div>
               </div>

               {/* Decorative Badge */}
               <motion.div 
                  initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }}
                  className="absolute -right-8 top-20 bg-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-30"
               >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-80 uppercase">Performance</p>
                    <p className="text-sm font-bold tracking-tight">Vitrines Mobile First</p>
                  </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Quickbar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white/5 border-y border-white/5 py-12 relative z-20"
      >
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Tempo de Uptime", val: "99.9%" },
              { label: "Carga Média", val: "250ms" },
              { label: "Vendas Processadas", val: "12k+" },
              { label: "GMV Facilitado", val: "R$ 5B+" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl font-bold mb-1 text-white">{s.val}</p>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
         </div>
      </motion.div>

      {/* Features Grid */}
      <section id="features" className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-indigo-400 font-bold text-sm tracking-[0.2em] uppercase mb-4">A Próxima Geração</h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-slate-100">Tecnologia que acelera vendas.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] transition-all group overflow-hidden relative"
              >
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                  <f.icon className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-100">{f.title}</h4>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative z-10 bg-indigo-600/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
             <h3 className="text-4xl md:text-6xl font-display font-bold mb-6 text-slate-100">Investimento Inteligente.</h3>
             <p className="text-xl text-slate-400">Escala sem taxas ocultas. Sua lucratividade em primeiro lugar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {plans.map((p, idx) => (
              <div key={idx} className={`p-10 rounded-[3rem] border flex flex-col transition-all ${p.recommended ? 'bg-white text-slate-900 scale-105 relative shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                {p.recommended && ( <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Mais Popular</span> )}
                <h4 className={`text-2xl font-bold mb-2 ${p.recommended ? 'text-slate-900' : 'text-white'}`}>{p.name}</h4>
                <div className="flex items-end gap-1 mb-10">
                  <span className="text-3xl font-bold opacity-60">R$</span>
                  <span className="text-6xl font-bold tracking-tighter">{p.price}</span>
                  <span className="text-sm mb-2 font-medium opacity-60">{p.price !== 'Custom' ? '/mês' : ''}</span>
                </div>
                <ul className="space-y-4 mb-12 flex-1">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium text-sm">
                      <CheckCircle2 size={18} className="text-indigo-500" />
                      <span className={p.recommended ? 'text-slate-700' : 'text-slate-300'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-5 rounded-2xl font-bold transition-all ${p.recommended ? 'bg-indigo-600 text-white hover:bg-slate-900 shadow-xl shadow-indigo-600/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   {p.price === 'Custom' ? 'Falar com Consultor' : 'Escolher este Plano'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 px-4 relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
           className="max-w-5xl mx-auto rounded-[4rem] bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-600/20"
         >
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
               <Rocket size={300} className="rotate-45" />
            </div>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 relative z-10 text-slate-100">Pronto para transformar <br /> sua imobiliária?</h3>
            <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsModalOpen(true)}
               className="bg-white text-indigo-600 px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl relative z-10"
            >
               Quero Minha Demonstração Grátis
            </motion.button>
         </motion.div>
      </section>

      {/* Modal de Captura de Lead */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#020617] border border-white/10 rounded-[3rem] p-8 md:p-14 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              {submitted ? (
                <div className="text-center py-12">
                   <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40 rotate-12">
                      <CheckCircle2 size={48} className="text-white" />
                   </div>
                   <h3 className="text-4xl font-bold mb-4 font-display text-white">Interesse Recebido!</h3>
                   <p className="text-slate-200 text-lg">Nossa equipe entrará em contato em breve para realizar seu Onboarding.</p>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h3 className="text-4xl font-display font-bold mb-4 text-white">Comece Hoje</h3>
                    <p className="text-slate-200 text-lg">Descubra como o ImobSync pode elevar o nível do seu negócio.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Responsável</label>
                       <input required type="text" placeholder="Seu nome" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-700" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail Comercial</label>
                          <input required type="email" placeholder="email@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-700" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
                          <input required type="tel" placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-700" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome da Imobiliária</label>
                       <input required type="text" placeholder="Ex: Alfa Residencial" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-700" />
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl mt-6 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <>Solicitar Demonstração <ArrowRight size={20} /></>}
                    </button>
                    <p className="text-[10px] text-center text-slate-600 uppercase font-bold tracking-widest">Garantia ImobSync: Sem fidelidade, sem taxas de configuração.</p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-20 border-t border-white/5 relative z-10 bg-[#020617]">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Rocket className="text-indigo-600" size={24} />
              <span className="text-xl font-display font-bold text-white tracking-tight">ImobSync</span>
            </div>
            <p className="text-slate-600 text-sm">© 2026 ImobSync SaaS. Tecnologia NexaSync. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-slate-500 text-sm font-medium">
               <a href="#" className="hover:text-white transition-colors">Termos</a>
               <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            </div>
         </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
