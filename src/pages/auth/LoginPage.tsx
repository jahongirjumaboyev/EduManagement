import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Checkbox, Spin } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { setCredentials } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import { UZ } from '@/constants/uz';
import loginHero from '@/assets/images/login-hero.jpg';
import logo from '@/assets/images/logo.svg';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(setCredentials({
        user: { id: '1', fullName: 'Rahbariyat', email: 'head@edu.uz', role: 'head' },
        role: 'head',
        token: 'mock-token',
      }));
      navigate('/kadr/bosh-sahifa');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div className="w-full lg:w-[35%] bg-white flex flex-col px-6 sm:px-12 lg:px-16 py-8">

        {/* Logo */}
        <div className="flex items-center justify-center mt-6 lg:mt-[70px]">
          <img src={logo} alt="Logo" className="w-14 h-14 sm:w-17 sm:h-17 mr-0.5" />
          <div className="text-[#4981FF] text-lg sm:text-[22px] font-bold uppercase leading-[1.5]">
            <div>{UZ.common.systemNameLine1}</div>
            <div>{UZ.common.systemNameLine2}</div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <h1 className="text-2xl sm:text-[32px] font-bold uppercase tracking-[3%] text-center mb-8 text-black">
            {UZ.auth.welcomeTitle}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-[435px] mx-auto">

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                {UZ.auth.username}
              </label>
              <input
                type="text"
                placeholder={UZ.auth.usernamePlaceholder}
                required
                className="w-full h-[54px] rounded-[40px] border border-[#4AB491] bg-white px-7 py-4 text-base placeholder:text-[#ACACAC] placeholder:text-[15px] outline-none focus:border-[#25b878] text-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                {UZ.auth.password}
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={UZ.auth.passwordPlaceholder}
                  required
                  className="w-full h-[54px] rounded-[40px] border border-[#4AB491] bg-white px-7 py-4 text-base placeholder:text-[#ACACAC] placeholder:text-[15px] outline-none focus:border-[#25b878] text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl bg-transparent border-0 p-0"
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between w-full">
              <Checkbox>
                <span className="text-sm text-gray-600">{UZ.auth.rememberMe}</span>
              </Checkbox>
              <span className="text-sm text-gray-600 cursor-pointer hover:text-[#2DCE8A]">
                {UZ.auth.forgotPassword}
              </span>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-[232px] h-14 rounded-full bg-[#4AB491] text-white text-base font-medium hover:bg-[#25b878] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Spin size="small" />}
                {UZ.common.login}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── Right panel — hidden on mobile ── */}
      <div className="hidden lg:block lg:w-[65%] relative p-16 bg-white">
        <div className="relative w-full h-full min-h-[600px]">
          <img
            src={loginHero}
            alt="Bojxona instituti"
            className="w-full h-full object-cover rounded-[20px]"
          />
          <div className="absolute inset-0 bg-black/30 rounded-[20px]" />
          <div className="absolute top-1 left-24 right-6 text-start">
            <p className="text-[#05276C] font-bold uppercase text-[24px] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]">
              {UZ.auth.quote}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
