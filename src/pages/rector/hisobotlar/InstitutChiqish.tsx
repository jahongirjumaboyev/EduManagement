import { useState, useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined, UserAddOutlined, UserOutlined, FileTextOutlined,
  TeamOutlined, MessageOutlined, QuestionCircleOutlined, LogoutOutlined,
  RightOutlined, LeftOutlined, BellOutlined, MoreOutlined, MenuOutlined,
  CloseOutlined, FilterOutlined, PrinterOutlined, DownloadOutlined, FullscreenOutlined,
} from '@ant-design/icons';
import { Avatar, DatePicker } from 'antd';
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
  id: number; oquvYili: string; kurs: string; guruh: string;
  fish: string; sabab: string; chiqishSanasi: string;
}

const MOCK: Row[] = [
  { id:1,  oquvYili:'2024-2025-y', kurs:'1-kurs', guruh:'125-guruh', fish:'Aliyev Alisher Baxtiyorovich',        sabab:'Navbatdagi uvalneniya',                    chiqishSanasi:'01.05.2025' },
  { id:2,  oquvYili:'2024-2025-y', kurs:'2-kurs', guruh:'225-guruh', fish:'Karimov Jasur Saidovich',             sabab:"Rag'bat / navbatdan tashqari uvalneniya",  chiqishSanasi:'02.05.2025' },
  { id:3,  oquvYili:'2024-2025-y', kurs:'3-kurs', guruh:'325-guruh', fish:'Toshmatov Sardor Umarovich',          sabab:'Kasal / poliklinika',                      chiqishSanasi:'03.05.2025' },
  { id:4,  oquvYili:'2024-2025-y', kurs:'4-kurs', guruh:'425-guruh', fish:'Yusupov Bobur Hamidovich',            sabab:'Boshqa sabab',                             chiqishSanasi:'04.05.2025' },
  { id:5,  oquvYili:'2024-2025-y', kurs:'1-kurs', guruh:'125-guruh', fish:'Raxmatullayev Nodir Ilhomovich',      sabab:'Navbatdagi uvalneniya',                    chiqishSanasi:'05.05.2025' },
  { id:6,  oquvYili:'2024-2025-y', kurs:'2-kurs', guruh:'225-guruh', fish:'Nazarov Sherzod Abdullayevich',       sabab:'Kasal / poliklinika',                      chiqishSanasi:'06.05.2025' },
  { id:7,  oquvYili:'2024-2025-y', kurs:'3-kurs', guruh:'325-guruh', fish:'Mirzayev Ulugbek Utkurovich',         sabab:"Rag'bat / navbatdan tashqari uvalneniya",  chiqishSanasi:'07.05.2025' },
  { id:8,  oquvYili:'2024-2025-y', kurs:'1-kurs', guruh:'125-guruh', fish:"Holmatov Firdavs Nematovich",         sabab:'Boshqa sabab',                             chiqishSanasi:'08.05.2025' },
  { id:9,  oquvYili:'2025-2026-y', kurs:'2-kurs', guruh:'225-guruh', fish:'Qodirov Dilshod Xurshidovich',        sabab:'Navbatdagi uvalneniya',                    chiqishSanasi:'09.05.2025' },
  { id:10, oquvYili:'2025-2026-y', kurs:'4-kurs', guruh:'425-guruh', fish:'Ergashev Murod Baxromovich',          sabab:'Kasal / poliklinika',                      chiqishSanasi:'10.05.2025' },
  { id:11, oquvYili:'2025-2026-y', kurs:'1-kurs', guruh:'125-guruh', fish:'Xoliqov Sanjar Tursunovich',          sabab:"Rag'bat / navbatdan tashqari uvalneniya",  chiqishSanasi:'11.05.2025' },
  { id:12, oquvYili:'2025-2026-y', kurs:'3-kurs', guruh:'325-guruh', fish:'Yunusov Sirojiddin Abdulhamidovich',  sabab:'Boshqa sabab',                             chiqishSanasi:'12.05.2025' },
  { id:13, oquvYili:'2025-2026-y', kurs:'2-kurs', guruh:'225-guruh', fish:'Umarov Laziz Ismoilovich',            sabab:'Navbatdagi uvalneniya',                    chiqishSanasi:'13.05.2025' },
  { id:14, oquvYili:'2025-2026-y', kurs:'4-kurs', guruh:'425-guruh', fish:'Baxtiyorov Asilbek Ravshanbekovich',  sabab:'Kasal / poliklinika',                      chiqishSanasi:'14.05.2025' },
  { id:15, oquvYili:'2024-2025-y', kurs:'1-kurs', guruh:'125-guruh', fish:'Rajabov Javlon Akbarovich',           sabab:"Rag'bat / navbatdan tashqari uvalneniya",  chiqishSanasi:'15.05.2025' },
  { id:16, oquvYili:'2024-2025-y', kurs:'3-kurs', guruh:'325-guruh', fish:'Sobirov Kamol Mahmudovich',           sabab:'Boshqa sabab',                             chiqishSanasi:'16.05.2025' },
  { id:17, oquvYili:'2024-2025-y', kurs:'2-kurs', guruh:'225-guruh', fish:'Mansur Hulkar Alijonovich',           sabab:'Navbatdagi uvalneniya',                    chiqishSanasi:'17.05.2025' },
  { id:18, oquvYili:'2025-2026-y', kurs:'4-kurs', guruh:'525-guruh', fish:'Ortiqov Sarvar Xurshidovich',         sabab:'Kasal / poliklinika',                      chiqishSanasi:'18.05.2025' },
  { id:19, oquvYili:'2025-2026-y', kurs:'1-kurs', guruh:'125-guruh', fish:'Norqoʻziyev Bekzod Ravshanbekovich', sabab:"Rag'bat / navbatdan tashqari uvalneniya",  chiqishSanasi:'19.05.2025' },
  { id:20, oquvYili:'2024-2025-y', kurs:'2-kurs', guruh:'225-guruh', fish:"Isoqov Eldor Bahodir o'g'li",        sabab:'Boshqa sabab',                             chiqishSanasi:'20.05.2025' },
  { id:21, oquvYili:'2024-2025-y', kurs:'3-kurs', guruh:'325-guruh', fish:'Tursunov Otabek Alijonovich',         sabab:'Navbatdagi uvalneniya',                    chiqishSanasi:'21.05.2025' },
  { id:22, oquvYili:'2025-2026-y', kurs:'4-kurs', guruh:'425-guruh', fish:'Hamidov Akbar Tohirovich',            sabab:'Kasal / poliklinika',                      chiqishSanasi:'22.05.2025' },
  { id:23, oquvYili:'2025-2026-y', kurs:'1-kurs', guruh:'125-guruh', fish:'Razzaqov Zafar Rustamovich',          sabab:"Rag'bat / navbatdan tashqari uvalneniya",  chiqishSanasi:'23.05.2025' },
  { id:24, oquvYili:'2024-2025-y', kurs:'2-kurs', guruh:'225-guruh', fish:'Abdullayev Farhodjon Sobirov',        sabab:'Boshqa sabab',                             chiqishSanasi:'24.05.2025' },
  { id:25, oquvYili:'2025-2026-y', kurs:'3-kurs', guruh:'325-guruh', fish:'Xasanov Mirzo Davronovich',           sabab:'Navbatdagi uvalneniya',                    chiqishSanasi:'25.05.2025' },
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
      { label: H.institutChiqish,   path: '/kadr/hisobotlar/institut-chiqish', active: true },
      { label: H.kasalKursantlar,   path: '/kadr/hisobotlar/kasal-kursantlar' },
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

export default function InstitutChiqish() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hisobotlarOpen, setHisobotlarOpen] = useState(true);
  const [kursantlarOpen, setKursantlarOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [fYear, setFYear] = useState('');
  const [fOy, setFOy] = useState('');
  const [fKurs, setFKurs] = useState('');
  const [fGuruh, setFGuruh] = useState('');
  const [fFish, setFFish] = useState('');
  const [fSabab, setFSabab] = useState('');
  const [fSana, setFSana] = useState<Dayjs | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const filtered = MOCK.filter(r => {
    if (fYear && r.oquvYili !== fYear) return false;
    if (fKurs && r.kurs !== fKurs) return false;
    if (fGuruh && r.guruh !== fGuruh) return false;
    if (fSabab && r.sabab !== fSabab) return false;
    if (fFish && !r.fish.toLowerCase().includes(fFish.toLowerCase())) return false;
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
          <h2 className="text-base font-bold text-gray-800 mb-4">{H.subTitleInstitut}</h2>

          <div className="bg-white rounded-xl border-t-4 border-[#3380FF] border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <select value={fYear} onChange={e => { setFYear(e.target.value); setPage(1); }} className={selCls}>
                  <option value="">— {H.oquvYili} —</option>
                  {H.oquvYiliOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={fOy} onChange={e => { setFOy(e.target.value); setPage(1); }} className={selCls}>
                  <option value="">— {H.oy} —</option>
                  {H.oyOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select value={fKurs} onChange={e => { setFKurs(e.target.value); setFGuruh(''); setPage(1); }} className={selCls}>
                  <option value="">— {H.kurs} —</option>
                  {H.kursOptions.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <select value={fGuruh} onChange={e => { setFGuruh(e.target.value); setPage(1); }} className={selCls}>
                  <option value="">— {H.guruh} —</option>
                  {H.guruhOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <input type="text" value={fFish} onChange={e => { setFFish(e.target.value); setPage(1); }}
                  placeholder={H.fish}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white w-40 outline-none" />
                <select value={fSabab} onChange={e => { setFSabab(e.target.value); setPage(1); }} className={selCls}>
                  <option value="">— {H.tashqarigaChiqishSababi} —</option>
                  {H.chiqishSababOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <DatePicker value={fSana} onChange={v => { setFSana(v); setPage(1); }} format="DD.MM.YYYY" placeholder={H.chiqishSanasi} className="w-36" />
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.oquvYili}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.kurs}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.guruhi}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.fish}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.tashqarigaChiqishSababi}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{H.chiqishSanasi}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${i % 2 !== 0 ? 'bg-[#FAFBFC]' : ''}`}>
                      <td className="px-4 py-3 text-gray-500">{(curPage - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.oquvYili}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.kurs}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.guruh}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{r.fish}</td>
                      <td className="px-4 py-3 text-gray-600">{r.sabab}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.chiqishSanasi}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">Ma'lumot topilmadi</td></tr>
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
