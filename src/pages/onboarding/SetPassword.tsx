import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { KeyRound, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 3000);

    } catch (err: any) {
      console.error('Erro ao definir senha:', err);
      setError(err.message || 'Erro ao definir senha (a sessão pode ter expirado).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-8">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${success ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
              {success ? <CheckCircle2 size={40} className="text-white" /> : <KeyRound size={40} className="text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-white font-display">
              {success ? 'Tudo pronto!' : 'Defina sua Senha'}
            </h1>
            <p className="text-slate-400 mt-3">
              {success 
                ? 'Sua senha foi salva. Redirecionando para seu painel...' 
                : 'Para garantir a segurança da sua conta, escolha uma senha forte.'}
            </p>
          </div>

          {!success && (
            <>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl text-sm mb-8 font-medium"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSetPassword} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita sua senha"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-slate-900 hover:bg-indigo-50 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 group mt-4"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Concluir Cadastro
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
             <p className="text-xs text-slate-500 italic">© 2024 ImobSync Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
