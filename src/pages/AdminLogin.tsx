import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import { SystemSettings } from '../types';

interface AdminLoginProps {
  onLoginSuccess: (rememberMe: boolean) => void;
  settings: SystemSettings;
  onShowToast: (msg: string) => void;
}

export default function AdminLogin({ onLoginSuccess, settings, onShowToast }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate small latency for premium feels
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLoginSuccess(rememberMe);
        onShowToast('Login Administrator Berhasil! Selamat datang kembali.');
      } else {
        onShowToast('Username atau password salah! (Saran: admin / admin123)');
      }
      setLoading(false);
    }, 600);
  };

  const handleForgotPassword = () => {
    alert('Mockup Fitur: Harap hubungi super administrator pengembang software (developer@onesky.com) untuk mereset kata sandi Anda secara manual.');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 sm:px-0 animate-page-transition" id="admin-login-page">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
        {/* Banner header */}
        <div className="p-8 bg-gradient-to-r from-emerald-950 to-primary text-white text-center space-y-3 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit mx-auto border border-white/20 text-secondary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          
          <div>
            <h2 className="text-2xl font-sans font-bold tracking-tight">Login Administrator</h2>
            <p className="text-xs text-zinc-300 mt-1">Kelola sistem, katalog, stok, ulasan & galeri OneSky Outdoor</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Username */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
              Username Admin
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Masukkan username (Default: admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-gray-800 dark:text-white"
                id="login-username-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-primary dark:text-secondary hover:underline cursor-pointer"
                id="login-forgot-pwd-link"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan password (Default: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-gray-800 dark:text-white"
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                id="login-show-pwd-btn"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between" id="login-options">
            <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                id="login-remember-checkbox"
              />
              <span>Ingat Saya (Keep Logged In)</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
            id="login-submit-btn"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Masuk Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Helper Credits */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800/50 text-center text-[10px] text-gray-400 dark:text-zinc-500">
          <span>Keamanan Terenkripsi • OneSky Admin panel 2026</span>
        </div>
      </div>
    </div>
  );
}
