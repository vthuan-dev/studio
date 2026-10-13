import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import BrandLogo from './BrandLogo';

export default function LoginScreen() {
  const { login } = useStudio();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Vui lòng nhập tài khoản!');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.message || 'Tài khoản hoặc mật khẩu không chính xác!');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ MongoDB Atlas!');
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Decorative ambient background blur orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8D5B4C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F5EFE6] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-white/40 rounded-full blur-2xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-md border border-[#EFE8DE] shadow-2xl rounded-3xl p-6 sm:p-8 relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-[#EFE8DE]/80">
          <BrandLogo size="md" layout="horizontal" />
          
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5EFE6] border border-[#E5DCD0] rounded-full text-[11px] font-semibold text-[#8D5B4C]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hệ Thống Quản Lý Nội Bộ</span>
          </div>

          <h2 className="text-xl font-bold font-serif text-[#2C2420] mt-3">
            Đăng Nhập Quản Trị
          </h2>
          <p className="text-xs text-[#8C7E74] mt-1">
            Vui lòng nhập tài khoản quản trị để tiếp tục
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3 bg-[#FFEBEE] border border-[#FFCDD2] rounded-2xl flex items-center gap-2.5 text-xs text-[#C62828] animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5F57] uppercase tracking-wider mb-1.5">
              Tài khoản
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D5B4C] pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="admin"
                autoFocus
                autoComplete="username"
                className="w-full bg-[#FAF7F2] border border-[#EFE8DE] focus:border-[#8D5B4C] focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-[#2C2420] focus:outline-none transition-all placeholder:text-[#C8B8A6]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5F57] uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D5B4C] pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[#FAF7F2] border border-[#EFE8DE] focus:border-[#8D5B4C] focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-[#2C2420] focus:outline-none transition-all placeholder:text-[#C8B8A6]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8C7E74] hover:text-[#2C2420] transition-colors"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-[#8D5B4C] hover:bg-[#744537] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Hệ Thống</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#EFE8DE]/70 text-center text-[10px] text-[#A6998E]">
          MEYZI STUDIO © 2026 — Quản lý lịch hẹn & Makeup chuyên nghiệp
        </div>
      </div>
    </div>
  );
}
