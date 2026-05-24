import { useNavigate } from 'react-router-dom';
import { CaretRightFilled } from '@ant-design/icons';
import { UZ } from '@/constants/uz';
import heroBg from '@/assets/images/hero-bg.jpg';
import logo from '@/assets/images/logo.svg';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white h-14 md:h-16 flex items-center px-4 md:px-6 shadow-sm">
        <img src={logo} alt="Logo" className="w-9 h-9 md:w-12 md:h-12 mr-2 md:mr-3" />
        <div className="text-[#1a9e5a] text-[9px] md:text-[11px] font-bold tracking-[1.5px] uppercase leading-[1.5]">
          <div>TA'LIM MENEJMENT</div>
          <div>AXBOROT TIZIMI</div>
        </div>
      </header>

      {/* Hero */}
      <div
        className="relative h-screen"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'top' }}
      >
        <div className="absolute inset-0 bg-black/35" />

        {/* Content */}
        <div className="absolute bottom-16 sm:bottom-24 lg:bottom-32 left-4 sm:left-10 lg:left-20 right-4 sm:right-10 lg:right-auto">
          <p className="text-white text-sm sm:text-lg lg:text-[26px] font-semibold tracking-[2px] lg:tracking-[3px] uppercase leading-[1.4] m-0">
            {UZ.landing.subtitleLine1}<br />{UZ.landing.subtitleLine2}
          </p>

          <h1 className="text-white text-[40px] sm:text-[60px] lg:text-[80px] font-black tracking-tight lg:tracking-[-1px] uppercase mt-2 mb-0 leading-none">
            {UZ.landing.title}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-7">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#2DCE8A] text-white px-6 md:px-8 py-3 rounded-full text-sm md:text-base font-medium border-none h-11 md:h-12 cursor-pointer w-full sm:w-auto sm:min-w-[140px] transition-transform duration-200 hover:scale-105"
            >
              {UZ.landing.login}
            </button>

            <button
              className="bg-white text-black border border-gray-300 px-6 md:px-8 py-3 rounded-full text-sm md:text-base font-medium h-11 md:h-12 cursor-pointer flex items-center justify-center w-full sm:w-auto transition-transform duration-200 hover:scale-105"
            >
              {UZ.landing.guide}
              <CaretRightFilled className="ml-2" style={{ fontSize: 16, color: '#2DCE8A' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
