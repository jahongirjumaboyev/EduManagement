import { useState, useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined, UserAddOutlined, UserOutlined, FileTextOutlined,
  TeamOutlined, MessageOutlined, QuestionCircleOutlined, LogoutOutlined,
  RightOutlined, LeftOutlined, BellOutlined, MoreOutlined, MenuOutlined,
  CloseOutlined, FilterOutlined, PrinterOutlined, DownloadOutlined, FullscreenOutlined,
} from '@ant-design/icons';
import { Avatar, DatePicker, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import { logout } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import { UZ } from '@/constants/uz';
import logo from '@/assets/images/logo.svg';

interface SubItem { label: string; path: string; active?: boolean; }
interface SidebarItem {
  icon: ReactNode; label: string; path: string;
  hasArrow?: boolean; active?: boolean; subItems?: SubItem[];
}

interface Row {
  id: number; kurs: string; guruh: string; fish: string;
  kasallikSababi: string; kasalJoy: string;
  boshlanish: string; tugash: string;
}

const MOCK: Row[] = [
  { id:1,  kurs:'1-kurs', guruh:'125-guruh', fish:'Aliyev Alisher Baxtiyorovich',        kasallikSababi:'Tomoq og\'rig\'i',         kasalJoy:'Poliklinika',      boshlanish:'01.05.2025 08:30:00', tugash:'03.05.2025 17:00:00' },
  { id:2,  kurs:'2-kurs', guruh:'225-guruh', fish:'Karimov Jasur Saidovich',             kasallikSababi:'Isitma',                   kasalJoy:'Gospital',         boshlanish:'02.05.2025 09:00:00', tugash:'05.05.2025 12:00:00' },
  { id:3,  kurs:'3-kurs', guruh:'325-guruh', fish:'Toshmatov Sardor Umarovich',          kasallikSababi:'Bosh og\'rig\'i',           kasalJoy:'Tibbiyot punkti',  boshlanish:'03.05.2025 10:15:00', tugash:'04.05.2025 16:00:00' },
  { id:4,  kurs:'4-kurs', guruh:'425-guruh', fish:'Yusupov Bobur Hamidovich',            kasallikSababi:'Oshqozon og\'rig\'i',       kasalJoy:'Yotoqxona',        boshlanish:'04.05.2025 07:30:00', tugash:'06.05.2025 10:00:00' },
  { id:5,  kurs:'1-kurs', guruh:'125-guruh', fish:'Raxmatullayev Nodir Ilhomovich',      kasallikSababi:'Shamollash',               kasalJoy:'Poliklinika',      boshlanish:'05.05.2025 08:00:00', tugash:'08.05.2025 17:00:00' },
  { id:6,  kurs:'2-kurs', guruh:'225-guruh', fish:'Nazarov Sherzod Abdullayevich',       kasallikSababi:"Burun oqishi",             kasalJoy:'Tibbiyot punkti',  boshlanish:'06.05.2025 11:00:00', tugash:'07.05.2025 18:00:00' },
  { id:7,  kurs:'3-kurs', guruh:'325-guruh', fish:'Mirzayev Ulugbek Utkurovich',         kasallikSababi:'Yo\'tal',                  kasalJoy:'Gospital',         boshlanish:'07.05.2025 09:30:00', tugash:'10.05.2025 14:00:00' },
  { id:8,  kurs:'1-kurs', guruh:'125-guruh', fish:"Holmatov Firdavs Nematovich",         kasallikSababi:'Isitma, shamollash',       kasalJoy:'Yotoqxona',        boshlanish:'08.05.2025 06:00:00', tugash:'11.05.2025 09:00:00' },
  { id:9,  kurs:'2-kurs', guruh:'225-guruh', fish:'Qodirov Dilshod Xurshidovich',        kasallikSababi:'Tish og\'rig\'i',          kasalJoy:'Poliklinika',      boshlanish:'09.05.2025 14:00:00', tugash:'10.05.2025 17:00:00' },
  { id:10, kurs:'4-kurs', guruh:'425-guruh', fish:'Ergashev Murod Baxromovich',          kasallikSababi:'Ko\'z kasali',             kasalJoy:'Gospital',         boshlanish:'10.05.2025 10:00:00', tugash:'14.05.2025 12:00:00' },
  { id:11, kurs:'1-kurs', guruh:'125-guruh', fish:'Xoliqov Sanjar Tursunovich',          kasallikSababi:"Quloq og'rig'i",          kasalJoy:'Tibbiyot punkti',  boshlanish:'11.05.2025 08:30:00', tugash:'12.05.2025 16:00:00' },
  { id:12, kurs:'3-kurs', guruh:'325-guruh', fish:'Yunusov Sirojiddin Abdulhamidovich',  kasallikSababi:'Oshqozon kasali',          kasalJoy:'Poliklinika',      boshlanish:'12.05.2025 09:00:00', tugash:'15.05.2025 17:00:00' },
  { id:13, kurs:'2-kurs', guruh:'225-guruh', fish:'Umarov Laziz Ismoilovich',            kasallikSababi:'Shamollash',               kasalJoy:'Yotoqxona',        boshlanish:'13.05.2025 07:00:00', tugash:'16.05.2025 12:00:00' },
  { id:14, kurs:'4-kurs', guruh:'425-guruh', fish:'Baxtiyorov Asilbek Ravshanbekovich',  kasallikSababi:'Isitma',                   kasalJoy:'Gospital',         boshlanish:'14.05.2025 10:00:00', tugash:'17.05.2025 10:00:00' },
  { id:15, kurs:'1-kurs', guruh:'125-guruh', fish:'Rajabov Javlon Akbarovich',           kasallikSababi:'Bosh og\'rig\'i',          kasalJoy:'Tibbiyot punkti',  boshlanish:'15.05.2025 11:30:00', tugash:'16.05.2025 17:00:00' },
  { id:16, kurs:'3-kurs', guruh:'325-guruh', fish:'Sobirov Kamol Mahmudovich',           kasallikSababi:"Tomoq kasali",            kasalJoy:'Poliklinika',      boshlanish:'16.05.2025 08:00:00', tugash:'19.05.2025 15:00:00' },
  { id:17, kurs:'2-kurs', guruh:'225-guruh', fish:'Mansur Hulkar Alijonovich',           kasallikSababi:'Ko\'z og\'rig\'i',         kasalJoy:'Gospital',         boshlanish:'17.05.2025 09:00:00', tugash:'20.05.2025 12:00:00' },
  { id:18, kurs:'4-kurs', guruh:'525-guruh', fish:'Ortiqov Sarvar Xurshidovich',         kasallikSababi:'Shamollash',               kasalJoy:'Yotoqxona',        boshlanish:'18.05.2025 06:30:00', tugash:'21.05.2025 09:00:00' },
  { id:19, kurs:'1-kurs', guruh:'125-guruh', fish:'Norqoʻziyev Bekzod Ravshanbekovich', kasallikSababi:'Isitma',                   kasalJoy:'Tibbiyot punkti',  boshlanish:'19.05.2025 10:00:00', tugash:'22.05.2025 16:00:00' },
  { id:20, kurs:'2-kurs', guruh:'225-guruh', fish:"Isoqov Eldor Bahodir o'g'li",        kasallikSababi:'Yo\'tal, shamollash',      kasalJoy:'Poliklinika',      boshlanish:'20.05.2025 08:00:00', tugash:'23.05.2025 17:00:00' },
  { id:21, kurs:'3-kurs', guruh:'325-guruh', fish:'Tursunov Otabek Alijonovich',         kasallikSababi:"Oshqozon og'rig'i",       kasalJoy:'Gospital',         boshlanish:'21.05.2025 11:00:00', tugash:'24.05.2025 14:00:00' },
  { id:22, kurs:'4-kurs', guruh:'425-guruh', fish:'Hamidov Akbar Tohirovich',            kasallikSababi:'Tish og\'rig\'i',          kasalJoy:'Poliklinika',      boshlanish:'22.05.2025 09:30:00', tugash:'23.05.2025 17:00:00' },
  { id:23, kurs:'1-kurs', guruh:'125-guruh', fish:'Razzaqov Zafar Rustamovich',          kasallikSababi:'Bosh og\'rig\'i',          kasalJoy:'Tibbiyot punkti',  boshlanish:'23.05.2025 08:00:00', tugash:'24.05.2025 12:00:00' },
  { id:24, kurs:'2-kurs', guruh:'225-guruh', fish:'Abdullayev Farhodjon Sobirov',        kasallikSababi:'Quloq kasali',             kasalJoy:'Gospital',         boshlanish:'24.05.2025 10:00:00', tugash:'27.05.2025 17:00:00' },
  { id:25, kurs:'3-kurs', guruh:'325-guruh', fish:'Xasanov Mirzo Davronovich',           kasallikSababi:'Ko\'z kasali',             kasalJoy:'Yotoqxona',        boshlanish:'25.05.2025 07:00:00', tugash:'28.05.2025 09:00:00' },
];

const PAGE_SIZE = 15;
const H = UZ.hisobotlar;

const MENU_ITEMS: SidebarItem[] = [
  { icon: <AppstoreOutlined />, label: UZ.darsJadvali.boshSahifa,    path: '/kadr/bosh-sahifa' },
  { icon: <UserAddOutlined />,  label: UZ.darsJadvali.royxatgaOlish, path: '/kadr/royxatga-olish' },
  { icon: <UserOutlined />,     label: UZ.darsJadvali.profil,         path: '' },
  {
    icon: <FileTextOutlined />, label: H.menuLabel, path: '', hasArrow: true,
    subItems: [
      { label: H.sutkalikNaryadlar, path: '/kadr/hisobotlar/sutkalik-naryadlar' },
      { label: H.institutChiqish,   path: '/kadr/hisobotlar/institut-chiqish' },
      { label: H.kasalKursantlar,   path: '/kadr/hisobotlar/kasal-kursantlar', active: true },
    ],
  },
  {
    icon: <TeamOutlined />, label: UZ.darsJadvali.kursantlar, path: '',
    subItems: [
      { label: UZ.kursantlar.menuLabel,         path: '/kadr/kursant-tinglovchilar/kursantlar' },
      { label: UZ.kursantlar.tinglovchilarLabel, path: '/kadr/kursant-tinglovchilar/tinglovchilar' },
    ],
  },
  { icon: <MessageOutlined />,       label: UZ.darsJadvali.xabarlar,   path: '' },
  { icon: <QuestionCircleOutlined />, label: UZ.darsJadvali.savolJavob, path: '' },
];

export default function KasalKursantlar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hisobotlarOpen, setHisobotlarOpen] = useState(true);
  const [kursantlarOpen, setKursantlarOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [fKurs, setFKurs] = useState('');
  const [fGuruh, setFGuruh] = useState('');
  const [fJins, setFJins] = useState('');
  const [fSabab, setFSabab] = useState('');
  const [fKiritilgan, setFKiritilgan] = useState<Dayjs | null>(null);
  const [fVaqt, setFVaqt] = useState<Dayjs | null>(null);
  const [fJoy, setFJoy] = useState('');
  const [fBoshlanish, setFBoshlanish] = useState<Dayjs | null>(null);
  const [fTugash, setFTugash] = useState<Dayjs | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const filtered = MOCK.filter(r => {
    if (fKurs && r.kurs !== fKurs) return false;
    if (fGuruh && r.guruh !== fGuruh) return false;
    if (fJoy && r.kasalJoy !== fJoy) return false;
    if (fSabab && !r.kasallikSababi.toLowerCase().includes(fSabab.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage = Math.min(page, totalPages);
  const rows = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);
  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  function pageNums(): (number | '...')[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (curPage > 3) pages.push('...');
    for (let p = Math.max(2, curPage - 1); p <= Math.min(totalPages - 1, curPage + 1); p++) pages.push(p);
    if (curPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  const selCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white w-36 outline-none';

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-4 py-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8 shrink-0" />
            <span className="text-[#4981FF] text-[11px] font-bold uppercase leading-tight">
              {UZ.common.systemNameLine1}<br />{UZ.common.systemNameLine2}
            </span>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-600 p-1" onClick={() => setSidebarOpen(false)}><CloseOutlined /></button>
        </div>

        <nav className="flex flex-col gap-1 px-3 mt-2 flex-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <div key={item.label}>
              {item.subItems ? (
                <>
                  <div
                    onClick={() => {
                      if (item.label === H.menuLabel) setHisobotlarOpen(o => !o);
                      else setKursantlarOpen(o => !o);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${item.subItems.some(s => s.active) ? 'bg-[#4680FF] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {(item.label === H.menuLabel ? hisobotlarOpen : kursantlarOpen)
                      ? <LeftOutlined className="text-xs" />
                      : <RightOutlined className="text-xs" />}
                  </div>
                  {(item.label === H.menuLabel ? hisobotlarOpen : kursantlarOpen) && (
                    <div className="mt-1 mx-3 rounded-[5px] border border-[#4680FF] overflow-hidden">
                      {item.subItems.map(sub => (
                        <div key={sub.label} onClick={() => { setSidebarOpen(false); navigate(sub.path); }}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-[#4680FF]/20 last:border-b-0">
                          <FileTextOutlined className={`text-base ${sub.active ? 'text-[#6192FE]' : 'text-gray-400'}`} />
                          <span className={`text-sm ${sub.active ? 'text-[#6192FE] font-medium' : 'text-gray-600'}`}>{sub.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div onClick={() => { setSidebarOpen(false); if (item.path) navigate(item.path); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium ${item.active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span className={`text-base shrink-0 ${!item.active ? 'text-black' : ''}`}>{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hasArrow && <RightOutlined className="text-[10px] text-gray-400 shrink-0" />}
                </div>
              )}
            </div>
          ))}
          <div className="flex-1" />
          <div onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-red-500 hover:bg-red-50 mb-3">
            <span className="text-base shrink-0"><LogoutOutlined /></span>
            <span>{UZ.common.logout}</span>
          </div>
        </nav>
      </aside>

      <div className="lg:ml-60 flex flex-col min-h-screen">
        <header className="bg-white border-b px-3 sm:px-6 h-16 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <button className="lg:hidden text-gray-600 p-1 text-xl" onClick={() => setSidebarOpen(true)}><MenuOutlined /></button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <span className="hidden sm:inline rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{currentTime.getDate()}</span>
            </span>
            <span className="hidden sm:inline rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{UZ.darsJadvali.uzMonths[currentTime.getMonth()]}</span>
            </span>
            <span className="rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{currentTime.getFullYear()}</span>
            </span>
            <div className="rounded-[4px] px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 tabular-nums" style={{ outline: '1px dashed #6192FE' }}>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{String(currentTime.getHours()).padStart(2,'0')}</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">:</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{String(currentTime.getMinutes()).padStart(2,'0')}</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">:</span>
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">{String(currentTime.getSeconds()).padStart(2,'0')}</span>
            </div>
          </div>
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

        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <h1 className="text-lg font-bold text-gray-900 mb-2">{H.pageTitle}</h1>
          <h2 className="text-base font-bold text-gray-800 mb-4">{H.subTitleKasal}</h2>

          <div className="bg-white rounded-xl border-t-4 border-[#3380FF] border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <select value={fKurs} onChange={e => { setFKurs(e.target.value); setFGuruh(''); setPage(1); }} className={selCls}>
                  <option value="">— {H.kurs} —</option>
                  {H.kursOptions.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <select value={fGuruh} onChange={e => { setFGuruh(e.target.value); setPage(1); }} className={selCls}>
                  <option value="">— {H.guruh} —</option>
                  {H.guruhOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={fJins} onChange={e => { setFJins(e.target.value); setPage(1); }} className={selCls}>
                  <option value="">— {H.jins} —</option>
                  {H.jinsOptions.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <input type="text" value={fSabab} onChange={e => { setFSabab(e.target.value); setPage(1); }}
                  placeholder={H.kasallikSababi}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white w-40 outline-none" />
                <DatePicker value={fKiritilgan} onChange={v => { setFKiritilgan(v); setPage(1); }}
                  format="DD.MM.YYYY" placeholder={H.kiritilganSana} className="w-36" />
                <TimePicker value={fVaqt} onChange={v => { setFVaqt(v); setPage(1); }}
                  format="HH:mm:ss" placeholder={H.murojaatVaqti} className="w-36" />
                <select value={fJoy} onChange={e => { setFJoy(e.target.value); setPage(1); }} className={selCls}>
                  <option value="">— {H.kasalYuborilanJoy} —</option>
                  {H.kasalJoyOptions.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <DatePicker value={fBoshlanish} onChange={v => { setFBoshlanish(v); setPage(1); }}
                  showTime format="DD.MM.YYYY HH:mm:ss" placeholder={H.boshlanishSanasi} className="w-44" />
                <DatePicker value={fTugash} onChange={v => { setFTugash(v); setPage(1); }}
                  showTime format="DD.MM.YYYY HH:mm:ss" placeholder={H.tugashSanasi} className="w-44" />
              </div>
              <div className="flex items-center gap-3">
                <FilterOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500" />
                <PrinterOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500" />
                <DownloadOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500" />
                <FullscreenOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-10">{H.tr}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.kurs}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.guruhi}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.fish}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.kasallikSababi}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.kasalYuborilanJoy}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.boshlanishSanasi}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.tugashSanasi}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${i % 2 !== 0 ? 'bg-[#FAFBFC]' : ''}`}>
                      <td className="px-4 py-3 text-gray-500">{(curPage - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.kurs}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.guruh}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{r.fish}</td>
                      <td className="px-4 py-3 text-gray-600">{r.kasallikSababi}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.kasalJoy}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.boshlanish}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.tugash}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">Ma'lumot topilmadi</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-gray-100 mt-2">
              <button onClick={() => goPage(curPage - 1)} disabled={curPage === 1}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1">{H.avval}</button>
              {pageNums().map((p, i) => p === '...'
                ? <span key={`d${i}`} className="px-2 py-1 text-gray-400 text-sm">...</span>
                : <button key={p} onClick={() => goPage(p as number)}
                    className={`w-8 h-8 rounded text-sm transition-colors ${p === curPage ? 'bg-blue-500 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
              )}
              <button onClick={() => goPage(curPage + 1)} disabled={curPage === totalPages}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1">{H.keyin}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
