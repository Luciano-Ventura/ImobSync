import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { Save, Loader2, UserCircle, Phone, Award, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

// Máscara de telefone: (99) 99999-9999
function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}

// Máscara de CRECI: letras maiúsculas, números e traços
function maskCreci(value: string) {
  return value.toUpperCase().slice(0, 20);
}

export default function ProfilePage() {
  const { profile, session } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    telefone: '',
    creci: '',
    bio: '',
  });

  useEffect(() => {
    if (!profile?.id) return;
    const loadProfile = async () => {
      // Usa supabaseAdmin para garantir leitura completa sem bloqueio RLS
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('full_name, telefone, creci, bio, avatar_url')
        .eq('id', profile.id)
        .maybeSingle();

      if (error) {
        console.error('[ProfilePage] Erro ao carregar perfil:', error);
        return;
      }
      if (data) {
        setFormData({
          fullName: data.full_name || '',
          telefone: data.telefone || '',
          creci: data.creci || '',
          bio: data.bio || '',
        });
        setAvatarUrl(data.avatar_url || null);
      }
    };
    loadProfile();
  }, [profile?.id]); // Só recarrega quando o ID muda (troca de usuário), não em re-renders

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData(prev => ({ ...prev, telefone: maskPhone(value) }));
    } else if (name === 'creci') {
      setFormData(prev => ({ ...prev, creci: maskCreci(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Valida tamanho (max 2MB) e tipo
    if (file.size > 2 * 1024 * 1024) {
      showToast('Foto muito grande. Máximo 2MB.', 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToast('Selecione uma imagem válida.', 'error');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `avatars/${profile.id}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabaseAdmin.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Usa supabaseAdmin para bypassar RLS no update do avatar_url
      await supabaseAdmin.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      setAvatarUrl(publicUrl);
      showToast('Foto atualizada!', 'success');
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      showToast(`Erro no upload: ${err.message}`, 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      // Usa supabaseAdmin pois o RLS bloqueia UPDATE com anon key
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: formData.fullName,
          telefone: formData.telefone,
          creci: formData.creci,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      showToast(`Erro ao salvar: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const roleLabel = {
    'admin': 'Administrador',
    'user': 'Corretor',
    'super-admin': 'Super Admin',
  }[profile?.role || 'user'] || 'Corretor';

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-slate-800">Meu Perfil</h1>
          <p className="text-slate-500 mt-1">Gerencie suas informações profissionais.</p>
        </div>

        {/* Avatar Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6 flex items-center gap-5 shadow-sm">
          {/* Avatar com botão de upload */}
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="h-10 w-10 text-primary" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 bg-primary text-white rounded-xl p-1.5 cursor-pointer hover:bg-slate-800 transition-colors shadow-lg"
              title="Alterar foto"
            >
              {isUploadingPhoto ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Camera size={14} />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <div>
            <p className="font-bold text-slate-800 text-lg">{formData.fullName || 'Seu Nome'}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {roleLabel}
            </span>
            <p className="text-xs text-slate-400 mt-1.5">Clique na câmera para alterar sua foto</p>
          </div>
          <div className="ml-auto text-sm text-slate-400 hidden md:block text-right">
            <p className="font-medium text-slate-500">{session?.user.email}</p>
            <p className="text-xs mt-0.5">E-mail corporativo</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-4">Informações Profissionais</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <UserCircle size={12} /> Nome Completo
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-medium text-slate-700 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Phone size={12} /> Telefone / WhatsApp
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 99999-9999"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-medium text-slate-700 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Award size={12} /> CRECI
              </label>
              <input
                type="text"
                name="creci"
                value={formData.creci}
                onChange={handleChange}
                placeholder="Ex: CRECI-SP 123456"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-medium text-slate-700 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mini Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Conte um pouco sobre você e sua experiência no mercado imobiliário..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm text-slate-700 resize-none transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-primary hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isSaving ? (
              <><Loader2 size={16} className="animate-spin" /> Salvando...</>
            ) : (
              <><Save size={16} /> Salvar Perfil</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
