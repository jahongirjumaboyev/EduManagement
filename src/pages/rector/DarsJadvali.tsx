import { useState, useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  UserAddOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  RightOutlined,
  LeftOutlined,
  BellOutlined,
  MoreOutlined,
  DownOutlined,
  FileImageOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';
import { logout } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import { UZ } from '@/constants/uz';
import logo from '@/assets/images/logo.svg';

// ── Types ──────────────────────────────────────────────────────────────────

interface SubItem {
  label: string;
  path: string;
  active?: boolean;
}

interface SidebarItem {
  icon: ReactNode;
  label: string;
  path: string;
  hasArrow?: boolean;
  active?: boolean;
  subItems?: SubItem[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getAcademicYears(): string[] {
  const now = new Date();
  const start = now.getMonth() + 1 >= 9 ? now.getFullYear() : now.getFullYear() - 1;
  const years: string[] = [];
  for (let y = 2023; y <= start; y++) years.push(`${y}-${y + 1}`);
  return years;
}

const ACADEMIC_YEARS = getAcademicYears();

// ── Sidebar items ──────────────────────────────────────────────────────────

const MENU_ITEMS: SidebarItem[] = [
  { icon: <AppstoreOutlined />, label: UZ.darsJadvali.boshSahifa,      path: '/kadr/bosh-sahifa',    active: true },
  { icon: <UserAddOutlined />,  label: UZ.darsJadvali.royxatgaOlish,   path: '/kadr/royxatga-olish' },
  { icon: <UserOutlined />,     label: UZ.darsJadvali.profil,           path: '' },
  {
    icon: <FileTextOutlined />, label: UZ.darsJadvali.hisobotlar, path: '',
    subItems: [
      { label: UZ.hisobotlar.sutkalikNaryadlar, path: '/kadr/hisobotlar/sutkalik-naryadlar' },
      { label: UZ.hisobotlar.institutChiqish,   path: '/kadr/hisobotlar/institut-chiqish' },
      { label: UZ.hisobotlar.kasalKursantlar,   path: '/kadr/hisobotlar/kasal-kursantlar' },
    ],
  },
  {
    icon: <TeamOutlined />,
    label: UZ.darsJadvali.kursantlar,
    path: '',
    subItems: [
      { label: UZ.kursantlar.menuLabel,         path: '/kadr/kursant-tinglovchilar/kursantlar' },
      { label: UZ.kursantlar.tinglovchilarLabel, path: '/kadr/kursant-tinglovchilar/tinglovchilar' },
    ],
  },
  { icon: <MessageOutlined />,  label: UZ.darsJadvali.xabarlar,         path: '' },
  { icon: <QuestionCircleOutlined />, label: UZ.darsJadvali.savolJavob, path: '' },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function DarsJadvali() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(ACADEMIC_YEARS[ACADEMIC_YEARS.length - 1]);
  const [selectedKurs, setSelectedKurs] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDay, setSelectedDay] = useState(UZ.darsJadvali.days[0]);
  const [scheduleImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hisobotlarOpen, setHisobotlarOpen] = useState(false);
  const [kursantlarOpen, setKursantlarOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo + close button */}
        <div className="px-4 py-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8 shrink-0" />
            <span className="text-[#4981FF] text-[11px] font-bold uppercase leading-tight">
              {UZ.common.systemNameLine1}<br />{UZ.common.systemNameLine2}
            </span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 px-3 mt-2 flex-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <div key={item.label}>
              {item.subItems ? (
                <>
                  <div
                    onClick={() => {
                      if (item.label === UZ.darsJadvali.hisobotlar) setHisobotlarOpen(o => !o);
                      else setKursantlarOpen(o => !o);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${item.subItems.some(s => s.active) ? 'bg-[#4680FF] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {(item.label === UZ.darsJadvali.hisobotlar ? hisobotlarOpen : kursantlarOpen)
                      ? <LeftOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
                  </div>
                </>
              ) : (
                <div
                  onClick={() => { setSidebarOpen(false); if (item.path) navigate(item.path); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium ${
                    item.active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-base shrink-0 ${!item.active ? 'text-black' : ''}`}>{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hasArrow && (
                    <RightOutlined className="text-[10px] text-gray-400 shrink-0" />
                  )}
                </div>
              )}
              {item.subItems && (item.label === UZ.darsJadvali.hisobotlar ? hisobotlarOpen : kursantlarOpen) && (
                <div className="mt-1 mx-3 rounded-[5px] border border-[#4680FF] overflow-hidden">
                  {item.subItems.map(sub => (
                    <div
                      key={sub.label}
                      onClick={() => { setSidebarOpen(false); if (sub.path) navigate(sub.path); }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-[#4680FF]/20 last:border-b-0"
                    >
                      <FileTextOutlined className={`text-base ${sub.active ? 'text-[#6192FE]' : 'text-gray-400'}`} />
                      <span className={`text-sm ${sub.active ? 'text-[#6192FE] font-medium' : 'text-gray-600'}`}>
                        {sub.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex-1" />

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-red-500 hover:bg-red-50 mb-3"
          >
            <span className="text-base shrink-0"><LogoutOutlined /></span>
            <span>{UZ.common.logout}</span>
          </div>
        </nav>
      </aside>

      {/* ── Main area ── */}
      <div className="lg:ml-60 flex flex-col min-h-screen">

        {/* ── Top navbar ── */}
        <header className="bg-white border-b px-3 sm:px-6 h-16 flex items-center justify-between shrink-0 sticky top-0 z-20">

          {/* Left: hamburger (mobile) */}
          <button
            className="lg:hidden text-gray-600 hover:text-gray-800 p-1 text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuOutlined />
          </button>
          <div className="hidden lg:block" />

          {/* Center: date + time boxes */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Day — hidden on mobile */}
            <span className="hidden sm:inline rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">
                {currentTime.getDate()}
              </span>
            </span>
            {/* Month — hidden on mobile */}
            <span className="hidden sm:inline rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">
                {UZ.darsJadvali.uzMonths[currentTime.getMonth()]}
              </span>
            </span>
            {/* Year */}
            <span className="rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">
                {currentTime.getFullYear()}
              </span>
            </span>
            {/* Time */}
            <div
              className="rounded-[4px] px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 tabular-nums"
              style={{ outline: '1px dashed #6192FE', outlineOffset: '0px' }}
            >
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{String(currentTime.getHours()).padStart(2, '0')}</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">:</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{String(currentTime.getMinutes()).padStart(2, '0')}</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">:</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{String(currentTime.getSeconds()).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Right: user info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <BellOutlined className="text-xl text-gray-600 cursor-pointer" />
            <Avatar icon={<UserOutlined />} />
            <div className="hidden md:block max-w-[140px]">
              <p className="text-sm font-medium text-gray-800 leading-tight">{UZ.darsJadvali.userName}</p>
              <p className="text-[10px] text-gray-400 whitespace-normal leading-tight">{UZ.darsJadvali.userRole}</p>
            </div>
            <MoreOutlined className="text-xl text-gray-600 cursor-pointer" />
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6">

          <h1 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-5">{UZ.darsJadvali.pageTitle}</h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-6">

            {/* Kursni tanlang */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-800">{UZ.darsJadvali.kursniTanlang}</label>
              <div className="relative">
                <select
                  value={selectedKurs}
                  onChange={e => setSelectedKurs(Number(e.target.value) as 1 | 2 | 3 | 4)}
                  className="w-full sm:w-[240px] lg:w-[307px] h-[47px] rounded-[5px] border border-[#999999] bg-white px-4 text-sm text-gray-700 appearance-none cursor-pointer outline-none shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  {UZ.darsJadvali.kursOptions.map((label, i) => (
                    <option key={i + 1} value={i + 1}>{label}</option>
                  ))}
                </select>
                <DownOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
            </div>

            {/* Hafta kunini tanlang */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-800">{UZ.darsJadvali.haftaKunlariTanlang}</label>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}
                  className="w-full sm:w-[240px] lg:w-[307px] h-[47px] rounded-[5px] border border-[#999999] bg-white px-4 text-sm text-gray-700 appearance-none cursor-pointer outline-none shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  {UZ.darsJadvali.days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <DownOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
            </div>

            {/* O'quv yili */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-800">{UZ.darsJadvali.oquvYili}</label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full sm:w-[240px] lg:w-[307px] h-[47px] rounded-[5px] border border-[#999999] bg-white px-4 text-sm text-gray-700 appearance-none cursor-pointer outline-none shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  {ACADEMIC_YEARS.map(y => (
                    <option key={y} value={y}>{y}-y.</option>
                  ))}
                </select>
                <DownOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
            </div>

          </div>

          {/* Schedule image area */}
          <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden">
            {scheduleImage ? (
              <img
                src={scheduleImage}
                alt="dars jadvali"
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="w-full min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center gap-3">
                <FileImageOutlined className="text-4xl sm:text-5xl text-gray-300" />
                <span className="text-sm text-gray-400 text-center px-4">
                  {UZ.darsJadvali.scheduleImagePlaceholder}
                </span>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
