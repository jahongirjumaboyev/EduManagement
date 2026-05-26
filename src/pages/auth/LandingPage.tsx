import { useNavigate } from 'react-router-dom';
import { CaretRightFilled } from '@ant-design/icons';
import { UZ } from '@/constants/uz';
import heroBg from '@/assets/images/hero-bg.jpg';
import logo from '@/assets/images/logo.svg';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <img
        src={heroBg}
        alt="Bojxona instituti hero"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/40" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 sm:px-8 py-3">
          <img src={logo} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 shrink-0" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-[#1DB885]">
            {UZ.common.systemNameLine1} {UZ.common.systemNameLine2}
          </span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen items-center px-6 sm:px-10 lg:px-16 pb-16 pt-24">
        <div className="w-full max-w-4xl text-white">
          <p className="text-2xl sm:text-4xl lg:text-[50px] uppercase font-bold leading-tight sm:leading-snug lg:leading-[65px] mb-4">
            {UZ.landing.subtitle}
          </p>
          <h1 className="font-extrabold uppercase text-6xl sm:text-8xl lg:text-[133px] leading-tight">
            {UZ.landing.title}
          </h1>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-[302px] h-[56px] sm:h-[67px] rounded-full bg-[#1DB885] text-white font-bold text-base px-8 hover:bg-[#18a874] transition-colors"
            >
              {UZ.landing.login}
            </button>
            <button
              onClick={() => {}}
              className="w-full sm:w-[302px] h-[56px] sm:h-[67px] rounded-full bg-white text-black font-bold text-base px-8 border border-gray-200 hover:border-[#1DB885] hover:text-[#1DB885] transition-colors flex items-center justify-between"
            >
              <span>{UZ.landing.guide}</span>
              <div className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                <CaretRightFilled className="text-[#1DB885] text-base" />
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
