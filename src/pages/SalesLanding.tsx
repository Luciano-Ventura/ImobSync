import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Layout, Rocket, Shield, Zap, ArrowRight, BarChart3, Globe, Smartphone, UserPlus, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SalesLanding() {
  const [activeMockup, setActiveMockup] = useState(0);
  
  const mockups = [
    { 
      url: '/assets/mockup_admin.png', 
      title: 'Painel de Gestão', 
      desc: 'Controle total de imóveis, leads e comissões em uma interface intuitiva.' 
    },
    { 
      url: '/assets/mockup_mobile.png', 
      title: 'Vitrine Mobile', 
      desc: 'Sua imobiliária no bolso do cliente com experiência nativa e ultra veloz.' 
    },
    { 
      url: '/assets/mockup_list.png', 
      title: 'Listagem Premium', 
      desc: 'Apresentação cinematográfica dos seus imóveis para converter mais.' 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMockup((prev) => (prev + 1) % mockups.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Vitrine White-Label",
      desc: "Sua marca, suas cores. Um site profissional em minutos sem precisar programar nada.",
      icon: Layout,
      color: "bg-blue-500"
    },
    {
      title: "SEO Otimizado",
      desc: "Seus imóveis no topo do Google com meta-tags automáticas e alta performance.",
      icon: Globe,
      color: "bg-emerald-500"
    },
    {
      title: "Gestão de Comissões",
      desc: "Controle financeiro completo. Saiba exatamente quanto ganhou em cada fechamento.",
      icon: BarChart3,
      color: "bg-amber-500"
    },
    {
      title: "Mobile First",
      desc: "Experiência perfeita em smartphones. Seus clientes compram de qualquer lugar.",
      icon: Smartphone,
      color: "bg-purple-500"
    },
    {
      title: "Segurança Total",
      desc: "Dados protegidos na nuvem com tecnologia Supabase e autenticação robusta.",
      icon: Shield,
      color: "bg-rose-500"
    },
    {
      title: "Rápido de Verdade",
      desc: "Site ultra veloz que carrega instantaneamente, aumentando suas chances de venda.",
      icon: Zap,
      color: "bg-sky-500"
    }
  ];

  const plans = [
    {
      name: "Broker Pro",
      price: "97",
      features: ["Até 50 imóveis", "SEO Otimizado", "Dashboard Financeiro", "Suporte via WhatsApp", "Subdomínio incluso"],
      recommended: false
    },
    {
      name: "Agency Premium",
      price: "197",
      features: ["Imóveis Ilimitados", "Domínio Próprio", "Dashboard Multi-corretor", "SEO Avançado", "Prioridade no Suporte"],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Setup Personalizado", "Integração via API", "Banners Exclusivos", "Treinamento de Equipe", "Consultoria de SEO"],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-highlight/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Navbar Simple */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-highlight p-2 rounded-xl shadow-lg shadow-highlight/20">
              <Rocket className="text-primary" size={24} />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">Imob<span className="text-highlight">Sync</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
            <Link to="/login" className="bg-white/5 text-white border border-white/10 px-6 py-2.5 rounded-xl hover:bg-white/10 transition-all font-semibold">
              Entrar no Painel
            </Link>
            <Link to="/login" className="bg-highlight text-primary px-6 py-2.5 rounded-xl hover:bg-white transition-all font-bold">
              Criar Conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-highlight/10 text-highlight px-4 py-1.5 rounded-full text-xs font-bold mb-8 border border-highlight/20 backdrop-blur-md uppercase tracking-widest">
              <Zap size={14} /> SaaS Imobiliário de Luxo
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] mb-8">
              A vitrine que seu <br />
              <span className="text-highlight">imóvel merece.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed">
              Crie uma experiência digital cinematográfica para seus clientes. O ImobSync automatiza sua gestão enquanto você foca no que importa: <span className="text-white font-semibold">fechar negócios.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button className="bg-highlight text-primary text-lg px-10 py-5 rounded-2xl font-bold hover:bg-white transition-all shadow-2xl shadow-highlight/10 flex items-center justify-center gap-2 group">
                Começar agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/5 text-white border border-white/10 text-lg px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <PlayCircle size={20} /> Ver Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold`}>IS</div>
                 ))}
               </div>
               <p><span className="text-white font-bold">+500 corretores</span> já estão usando</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Background Blur Effect for Carousel */}
            <div className="absolute inset-0 bg-highlight/20 blur-[100px] rounded-full scale-75 opacity-50"></div>
            
            {/* Carousel Container */}
            <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMockup}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={mockups[activeMockup].url} 
                    alt={mockups[activeMockup].title}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-primary/40 backdrop-blur-xl border border-white/10 rounded-2xl text-left hidden md:block">
                     <h4 className="text-lg font-bold text-white mb-1">{mockups[activeMockup].title}</h4>
                     <p className="text-sm text-slate-300">{mockups[activeMockup].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Indicators */}
              <div className="absolute top-6 right-6 flex gap-2">
                {mockups.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveMockup(i)}
                    className={`h-1.5 transition-all rounded-full ${activeMockup === i ? 'w-8 bg-highlight' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Mobile Mockup Element */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-32 md:w-48 aspect-[9/16] bg-[#0f172a] rounded-3xl border-4 border-white/10 shadow-2xl overflow-hidden hidden sm:block"
            >
              <img src="/assets/mockup_mobile.png" alt="Mobile" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold text-highlight uppercase tracking-[0.3em] mb-4">Potência Máxima</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold">Tecnologia que impulsiona seus lucros.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-sm transition-all group"
              >
                <div className={`${f.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <f.icon size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-4">{f.title}</h4>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
             <h3 className="text-4xl md:text-6xl font-display font-bold mb-6">Investimento Justo.</h3>
             <p className="text-xl text-slate-400">Sem taxas ocultas. Cancele quando quiser.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {plans.map((p, idx) => (
              <div 
                key={idx}
                className={`p-10 rounded-[3rem] border flex flex-col transition-all ${p.recommended ? 'bg-highlight text-primary border-highlight shadow-2xl shadow-highlight/20 scale-105 relative' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                {p.recommended && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Recomendado
                  </span>
                )}
                <h4 className="text-2xl font-bold mb-2">{p.name}</h4>
                <div className="flex items-end gap-1 mb-10">
                  <span className="text-4xl font-bold">R$</span>
                  <span className="text-6xl font-bold tracking-tighter">{p.price}</span>
                  <span className="text-sm mb-2 font-medium opacity-60">{p.price !== 'Custom' ? '/mês' : ''}</span>
                </div>

                <ul className="space-y-4 mb-12 flex-1">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium text-sm">
                      <CheckCircle2 size={18} className={p.recommended ? 'text-primary' : 'text-highlight'} />
                      <span className={p.recommended ? 'text-primary/80' : 'text-slate-300'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-5 rounded-2xl font-bold transition-all ${p.recommended ? 'bg-primary text-white hover:bg-black' : 'bg-white text-primary hover:bg-highlight hover:text-primary'}`}>
                   {p.price === 'Custom' ? 'Falar com Consultor' : 'Começar Agora'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
            <div className="flex items-center gap-2">
               <div className="bg-highlight p-2 rounded-lg">
                  <Rocket className="text-primary" size={24} />
               </div>
               <span className="text-2xl font-display font-bold">Imob<span className="text-highlight">Sync</span></span>
            </div>
            <div className="flex gap-8 text-slate-400 font-medium">
               <a href="#" className="hover:text-white transition-colors">Termos</a>
               <a href="#" className="hover:text-white transition-colors">Privacidade</a>
               <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/5">
             <p className="text-slate-600 text-sm">© 2026 ImobSync SaaS. A revolução digital do mercado imobiliário.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
