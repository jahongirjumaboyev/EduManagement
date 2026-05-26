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
  MenuOutlined,
  CloseOutlined,
  FilterOutlined,
  PrinterOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  CloudUploadOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Avatar, Modal, Select, DatePicker, Upload } from 'antd';
import type { Dayjs } from 'dayjs';
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

interface Student {
  id: number;
  fish: string;
  jinsi: 'Erkak' | 'Ayol';
  guruh: string;
}

interface ModalFormState {
  jshshir: string; fio: string; malumoti: string;
  pasport: string; berilganSana: Dayjs | null; jinsi: string;
  tugilganSana: Dayjs | null; millati: string; kimTomonidan: string;
  fuqaroligi: string; phones: string[]; emails: string[];
  harbiyLavozimi: string; guvohnomaRaqami: string; guruhi: string;
}

type SavedData = ModalFormState & { photoUrl: string | null };

// ── Mock data ──────────────────────────────────────────────────────────────

const STUDENTS: Student[] = [
  { id: 1,  fish: 'Aliyev Alisher Baxtiyorovich',          jinsi: 'Erkak', guruh: 'MBH-123' },
  { id: 2,  fish: 'Karimova Malika Saidovna',              jinsi: 'Ayol',  guruh: 'MBI-123' },
  { id: 3,  fish: 'Toshmatov Jasur Umarovich',             jinsi: 'Erkak', guruh: 'MBH-223' },
  { id: 4,  fish: 'Yusupova Nodira Hamidovna',             jinsi: 'Ayol',  guruh: 'MBI-223' },
  { id: 5,  fish: 'Raxmatullayev Sardor Ilhomovich',       jinsi: 'Erkak', guruh: 'MBH-323' },
  { id: 6,  fish: 'Xasanova Zulfiya Davronovna',           jinsi: 'Ayol',  guruh: 'MBI-323' },
  { id: 7,  fish: 'Nazarov Bobur Abdullayevich',           jinsi: 'Erkak', guruh: 'MBH-123' },
  { id: 8,  fish: 'Mirzayeva Dildora Utkurovna',           jinsi: 'Ayol',  guruh: 'MBI-123' },
  { id: 9,  fish: "Holmatov Sherzod Nematovich",           jinsi: 'Erkak', guruh: 'MBH-223' },
  { id: 10, fish: 'Qodirov Dilshod Xurshidovich',          jinsi: 'Erkak', guruh: 'MBI-223' },
  { id: 11, fish: 'Abdullayeva Sabohat Farhodovna',        jinsi: 'Ayol',  guruh: 'MBH-323' },
  { id: 12, fish: 'Ergashev Murod Baxromovich',            jinsi: 'Erkak', guruh: 'MBI-323' },
  { id: 13, fish: 'Hamidova Feruza Tohirovna',             jinsi: 'Ayol',  guruh: 'MBH-123' },
  { id: 14, fish: 'Umarov Firdavs Ismoilovich',            jinsi: 'Erkak', guruh: 'MBI-123' },
  { id: 15, fish: 'Rajabova Mohira Akbarovna',             jinsi: 'Ayol',  guruh: 'MBH-223' },
  { id: 16, fish: "Norqo'ziyev Asilbek Ravshanbekovich",  jinsi: 'Erkak', guruh: 'MBI-223' },
  { id: 17, fish: 'Sobirov Ulugbek Mahmudovich',           jinsi: 'Erkak', guruh: 'MBH-323' },
  { id: 18, fish: 'Tursunova Kamola Alijonovna',           jinsi: 'Ayol',  guruh: 'MBI-323' },
  { id: 19, fish: "Isoqov Laziz Bahodir o'g'li",          jinsi: 'Erkak', guruh: 'MBH-123' },
  { id: 20, fish: 'Mansurova Hulkar Iskandarovna',         jinsi: 'Ayol',  guruh: 'MBI-123' },
  { id: 21, fish: 'Xoliqov Sanjar Tursunovich',            jinsi: 'Erkak', guruh: 'MBH-223' },
  { id: 22, fish: 'Baxtiyorova Shahnoza Komilovna',        jinsi: 'Ayol',  guruh: 'MBI-223' },
  { id: 23, fish: 'Yunusov Sirojiddin Abdulhamidovich',    jinsi: 'Erkak', guruh: 'MBH-323' },
  { id: 24, fish: 'Razzaqova Nargiza Rustamovna',          jinsi: 'Ayol',  guruh: 'MBI-323' },
  { id: 25, fish: "Ortiqov Javlon Xurshidovich",           jinsi: 'Erkak', guruh: 'MBH-123' },
];

const PAGE_SIZE = 15;

const EMPTY_MODAL: ModalFormState = {
  jshshir: '', fio: '', malumoti: '', pasport: '',
  berilganSana: null, jinsi: '', tugilganSana: null,
  millati: '', kimTomonidan: '', fuqaroligi: '',
  phones: [''], emails: [''],
  harbiyLavozimi: '', guvohnomaRaqami: '', guruhi: '',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function toOpts(arr: readonly string[]) {
  return arr.map(v => ({ value: v, label: v }));
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="text-xs text-gray-500 mb-1 block">
      {text}{required && <span className="text-[#E00000] ml-0.5">*</span>}
    </label>
  );
}

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
  { icon: <AppstoreOutlined />, label: UZ.darsJadvali.boshSahifa,    path: '/kadr/bosh-sahifa' },
  { icon: <UserAddOutlined />,  label: UZ.darsJadvali.royxatgaOlish, path: '/kadr/royxatga-olish' },
  { icon: <UserOutlined />,     label: UZ.darsJadvali.profil,         path: '' },
  { icon: <FileTextOutlined />, label: UZ.darsJadvali.hisobotlar,     path: '', hasArrow: true },
  {
    icon: <TeamOutlined />,
    label: UZ.darsJadvali.kursantlar,
    path: '',
    subItems: [
      { label: UZ.kursantlar.menuLabel,         path: '/rahbariyat/kursant-tinglovchilar/kursantlar' },
      { label: UZ.kursantlar.tinglovchilarLabel, path: '/rahbariyat/kursant-tinglovchilar/tinglovchilar', active: true },
    ],
  },
  { icon: <MessageOutlined />,       label: UZ.darsJadvali.xabarlar,   path: '' },
  { icon: <QuestionCircleOutlined />, label: UZ.darsJadvali.savolJavob, path: '' },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function Tinglovchilar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kursantlarOpen, setKursantlarOpen] = useState(true);
  const [page, setPage] = useState(1);

  const [filterYear, setFilterYear] = useState(ACADEMIC_YEARS[ACADEMIC_YEARS.length - 1]);
  const [filterGuruh, setFilterGuruh] = useState('');
  const [filterFish, setFilterFish] = useState('');
  const [filterJinsi, setFilterJinsi] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState<ModalFormState>(EMPTY_MODAL);
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});
  const [modalPhoto, setModalPhoto] = useState<string | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedData, setSavedData] = useState<SavedData | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filtered = STUDENTS.filter(s => {
    if (filterGuruh && s.guruh !== filterGuruh) return false;
    if (filterJinsi && s.jinsi !== filterJinsi) return false;
    if (filterFish && !s.fish.toLowerCase().includes(filterFish.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStudents = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  function pageNumbers(): (number | '...')[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#3380FF] bg-white';
  const inputCls2 = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#3380FF]';
  const viewCls   = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 cursor-default';

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSaved(false);
    setModalForm(EMPTY_MODAL);
    setModalErrors({});
    setModalPhoto(null);
    setSavedData(null);
  };

  const setM = (field: keyof ModalFormState, value: ModalFormState[keyof ModalFormState]) =>
    setModalForm(f => ({ ...f, [field]: value }));

  const setMPhone = (idx: number, val: string) => {
    const next = [...modalForm.phones];
    next[idx] = val.replace(/[^\d+]/g, '');
    setM('phones', next);
  };

  const setMEmail = (idx: number, val: string) => {
    const next = [...modalForm.emails];
    next[idx] = val;
    setM('emails', next);
  };

  const handleModalSubmit = () => {
    const R = UZ.royxatgaOlish;
    const e: Record<string, string> = {};

    if (!/^\d{14}$/.test(modalForm.jshshir))        e.jshshir          = R.jshshirError;
    if (!modalForm.fio.trim())                        e.fio              = R.majburiy;
    if (!modalForm.malumoti)                          e.malumoti         = R.majburiy;
    if (!/^[A-Z]{2}\d{7}$/.test(modalForm.pasport))  e.pasport          = R.pasportError;
    if (!modalForm.berilganSana)                      e.berilganSana     = R.majburiy;
    if (!modalForm.jinsi)                             e.jinsi            = R.majburiy;
    if (!modalForm.tugilganSana)                      e.tugilganSana     = R.majburiy;
    if (!modalForm.millati)                           e.millati          = R.majburiy;
    if (!modalForm.fuqaroligi)                        e.fuqaroligi       = R.majburiy;
    if (!modalForm.phones[0])                         e.phone0           = R.majburiy;
    if (!modalForm.emails[0]) {
      e.email0 = R.majburiy;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalForm.emails[0])) {
      e.email0 = R.emailError;
    }
    if (modalForm.emails[1] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalForm.emails[1])) {
      e.email1 = R.emailError;
    }
    if (!modalForm.harbiyLavozimi)                    e.harbiyLavozimi   = R.majburiy;
    if (!modalForm.guvohnomaRaqami.trim())            e.guvohnomaRaqami  = R.majburiy;
    if (!modalForm.guruhi.trim())                     e.guruhi           = R.majburiy;

    setModalErrors(e);
    if (Object.keys(e).length > 0) return;

    setModalSubmitting(true);
    setSavedData({ ...modalForm, photoUrl: modalPhoto });
    setIsSaved(true);
    setModalErrors({});
    setModalSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="px-4 py-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8 shrink-0" />
            <span className="text-[#4981FF] text-[11px] font-bold uppercase leading-tight">
              {UZ.common.systemNameLine1}<br />{UZ.common.systemNameLine2}
            </span>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-600 p-1" onClick={() => setSidebarOpen(false)}>
            <CloseOutlined />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 mt-2 flex-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <div key={item.label}>
              {item.subItems ? (
                <div
                  onClick={() => setKursantlarOpen(o => !o)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${item.subItems.some(s => s.active) ? 'bg-[#4680FF] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {kursantlarOpen ? <LeftOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
                </div>
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
              {item.subItems && kursantlarOpen && (
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

        {/* ── Navbar ── */}
        <header className="bg-white border-b px-3 sm:px-6 h-16 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <button className="lg:hidden text-gray-600 hover:text-gray-800 p-1 text-xl" onClick={() => setSidebarOpen(true)}>
            <MenuOutlined />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <span className="hidden sm:inline rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">
                {currentTime.getDate()}
              </span>
            </span>
            <span className="hidden sm:inline rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">
                {UZ.darsJadvali.uzMonths[currentTime.getMonth()]}
              </span>
            </span>
            <span className="rounded-[4px] border border-[#6192FE] px-2 sm:px-4 py-1 sm:py-2">
              <span className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">
                {currentTime.getFullYear()}
              </span>
            </span>
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

          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h1 className="text-base sm:text-lg font-bold text-gray-800">{UZ.tinglovchilar.pageTitle}</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors"
            >
              <UserAddOutlined />
              <span className="hidden sm:inline">{UZ.tinglovchilar.qoshish}</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{UZ.tinglovchilar.oquvYili}</label>
                <select
                  value={filterYear}
                  onChange={e => { setFilterYear(e.target.value); setPage(1); }}
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none"
                >
                  {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}-y.</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{UZ.tinglovchilar.oquvGuruhi}</label>
                <select
                  value={filterGuruh}
                  onChange={e => { setFilterGuruh(e.target.value); setPage(1); }}
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none"
                >
                  <option value="">— {UZ.tinglovchilar.oquvGuruhi} —</option>
                  {UZ.tinglovchilar.guruhOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{UZ.tinglovchilar.fish}</label>
                <input
                  type="text"
                  value={filterFish}
                  onChange={e => { setFilterFish(e.target.value); setPage(1); }}
                  placeholder={UZ.tinglovchilar.fish}
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{UZ.tinglovchilar.jinsi}</label>
                <select
                  value={filterJinsi}
                  onChange={e => { setFilterJinsi(e.target.value); setPage(1); }}
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none"
                >
                  <option value="">—</option>
                  {UZ.tinglovchilar.jinsOptions.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

            </div>
            <div className="flex items-center gap-3">
              <FilterOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500 flex items-center justify-center" />
              <PrinterOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500 flex items-center justify-center" />
              <DownloadOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500 flex items-center justify-center" />
              <FullscreenOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500 flex items-center justify-center" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-12">{UZ.tinglovchilar.tr}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{UZ.tinglovchilar.fish}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{UZ.tinglovchilar.jinsi}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{UZ.tinglovchilar.oquvGuruhi}</th>
                    <th className="w-16" />
                  </tr>
                </thead>
                <tbody>
                  {pageStudents.map((s, i) => (
                    <tr
                      key={s.id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${i % 2 !== 0 ? 'bg-[#FAFBFC]' : ''}`}
                    >
                      <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{s.fish}</td>
                      <td className="px-4 py-3 text-gray-600">{s.jinsi}</td>
                      <td className="px-4 py-3 text-gray-600">{s.guruh}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">Ko'rish</span>
                      </td>
                    </tr>
                  ))}
                  {pageStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                        Ma'lumot topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => goPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1"
              >
                {UZ.tinglovchilar.avval}
              </button>
              {pageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`dot-${i}`} className="px-2 py-1 text-gray-400 text-sm select-none">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goPage(p as number)}
                    className={`w-8 h-8 rounded text-sm transition-colors ${
                      p === currentPage
                        ? 'bg-blue-500 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => goPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1"
              >
                {UZ.tinglovchilar.keyin}
              </button>
            </div>
          </div>

        </main>
      </div>

      {/* ── Modal: Tinglovchi qo'shish / ko'rish ── */}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width="85%"
        className="top-8"
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <div className="border-t-4 border-[#3380FF] px-6 py-5">

          {/* Modal header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-gray-900">
              {isSaved ? UZ.tinglovchilar.viewTitle : UZ.tinglovchilar.tinglovchiQoshishTitle}
            </span>
            <CloseOutlined className="text-red-500 text-xl cursor-pointer hover:text-red-600" onClick={closeModal} />
          </div>

          {/* ══ SECTION 1 ══ */}
          <h2 className="text-[20px] font-semibold text-[#3380FF] text-center mb-6">{UZ.royxatgaOlish.section1}</h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">

            {/* Photo */}
            <div className="sm:w-48 sm:flex-shrink-0">
              {isSaved && savedData?.photoUrl ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden min-h-[200px]">
                  <img src={savedData.photoUrl} className="w-full h-full object-cover rounded-lg" />
                </div>
              ) : (
                <Upload
                  accept=".jpg,.jpeg,.png"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={file => {
                    const reader = new FileReader();
                    reader.onload = e => { if (e.target?.result) setModalPhoto(e.target.result as string); };
                    reader.readAsDataURL(file);
                    return false;
                  }}
                >
                  <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 min-h-[200px] cursor-pointer hover:border-blue-400 transition-colors">
                    <p className="text-sm text-gray-500 mb-2">{UZ.royxatgaOlish.foto}</p>
                    {modalPhoto ? (
                      <img src={modalPhoto} alt="preview" className="w-24 h-24 object-cover rounded" />
                    ) : (
                      <>
                        <CloudUploadOutlined className="text-5xl text-blue-400" />
                        <p className="text-xs text-center text-gray-500">{UZ.royxatgaOlish.fotoUpload}</p>
                        <p className="text-[10px] text-gray-400 text-center">{UZ.royxatgaOlish.fotoFormat}</p>
                      </>
                    )}
                  </div>
                </Upload>
              )}
            </div>

            {/* Fields grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div>
                <FieldLabel text={UZ.royxatgaOlish.jshshir} required />
                {isSaved ? <div className={viewCls}>{savedData?.jshshir}</div> : (
                  <>
                    <input type="text" value={modalForm.jshshir}
                      onChange={e => setM('jshshir', e.target.value.replace(/\D/g, '').slice(0, 14))}
                      placeholder={UZ.royxatgaOlish.jshshirPlaceholder} maxLength={14} className={inputCls} />
                    {modalErrors.jshshir && <p className="text-xs text-red-500 mt-0.5">{modalErrors.jshshir}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.fio} required />
                {isSaved ? <div className={viewCls}>{savedData?.fio}</div> : (
                  <>
                    <input type="text" value={modalForm.fio}
                      onChange={e => setM('fio', e.target.value)}
                      placeholder={UZ.royxatgaOlish.fioPlaceholder} className={inputCls} />
                    {modalErrors.fio && <p className="text-xs text-red-500 mt-0.5">{modalErrors.fio}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.malumoti} required />
                {isSaved ? <div className={viewCls}>{savedData?.malumoti}</div> : (
                  <>
                    <Select className="w-full" size="middle" placeholder={UZ.royxatgaOlish.tanlang}
                      options={toOpts(UZ.royxatgaOlish.malumotiOptions)}
                      value={modalForm.malumoti || undefined}
                      onChange={v => setM('malumoti', v)} />
                    {modalErrors.malumoti && <p className="text-xs text-red-500 mt-0.5">{modalErrors.malumoti}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.pasport} required />
                {isSaved ? <div className={viewCls}>{savedData?.pasport}</div> : (
                  <>
                    <input type="text" value={modalForm.pasport}
                      onChange={e => setM('pasport', e.target.value.toUpperCase().slice(0, 9))}
                      placeholder={UZ.royxatgaOlish.pasportPlaceholder} className={inputCls} />
                    {modalErrors.pasport && <p className="text-xs text-red-500 mt-0.5">{modalErrors.pasport}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.berilganSana} required />
                {isSaved ? <div className={viewCls}>{savedData?.berilganSana?.format('DD.MM.YYYY')}</div> : (
                  <>
                    <DatePicker className="w-full" format="DD.MM.YYYY"
                      value={modalForm.berilganSana} onChange={v => setM('berilganSana', v)} />
                    {modalErrors.berilganSana && <p className="text-xs text-red-500 mt-0.5">{modalErrors.berilganSana}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.jinsi} required />
                {isSaved ? <div className={viewCls}>{savedData?.jinsi}</div> : (
                  <>
                    <Select className="w-full" size="middle" placeholder={UZ.royxatgaOlish.tanlang}
                      options={toOpts(UZ.royxatgaOlish.jinsOptions)}
                      value={modalForm.jinsi || undefined}
                      onChange={v => setM('jinsi', v)} />
                    {modalErrors.jinsi && <p className="text-xs text-red-500 mt-0.5">{modalErrors.jinsi}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.tugilganSana} required />
                {isSaved ? <div className={viewCls}>{savedData?.tugilganSana?.format('DD.MM.YYYY')}</div> : (
                  <>
                    <DatePicker className="w-full" format="DD.MM.YYYY"
                      value={modalForm.tugilganSana} onChange={v => setM('tugilganSana', v)} />
                    {modalErrors.tugilganSana && <p className="text-xs text-red-500 mt-0.5">{modalErrors.tugilganSana}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.millati} required />
                {isSaved ? <div className={viewCls}>{savedData?.millati}</div> : (
                  <>
                    <Select className="w-full" size="middle" placeholder={UZ.royxatgaOlish.tanlang}
                      options={toOpts(UZ.royxatgaOlish.millatOptions)}
                      value={modalForm.millati || undefined}
                      onChange={v => setM('millati', v)} />
                    {modalErrors.millati && <p className="text-xs text-red-500 mt-0.5">{modalErrors.millati}</p>}
                  </>
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.kimTomonidan} />
                {isSaved ? <div className={viewCls}>{savedData?.kimTomonidan || '—'}</div> : (
                  <input type="text" value={modalForm.kimTomonidan}
                    onChange={e => setM('kimTomonidan', e.target.value)} className={inputCls} />
                )}
              </div>

              <div>
                <FieldLabel text={UZ.royxatgaOlish.fuqaroligi} required />
                {isSaved ? <div className={viewCls}>{savedData?.fuqaroligi}</div> : (
                  <>
                    <Select className="w-full" size="middle" placeholder={UZ.royxatgaOlish.tanlang}
                      options={toOpts(UZ.royxatgaOlish.fuqaroligiOptions)}
                      value={modalForm.fuqaroligi || undefined}
                      onChange={v => setM('fuqaroligi', v)} />
                    {modalErrors.fuqaroligi && <p className="text-xs text-red-500 mt-0.5">{modalErrors.fuqaroligi}</p>}
                  </>
                )}
              </div>

              {/* Phone */}
              <div>
                <FieldLabel text={UZ.royxatgaOlish.telefon} required />
                <div className="flex flex-col gap-2">
                  {(isSaved ? savedData?.phones ?? [] : modalForm.phones).map((phone, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input type="text" value={phone} readOnly={isSaved}
                        onChange={isSaved ? undefined : e => setMPhone(idx, e.target.value)}
                        placeholder="+998 XX XXX XX XX"
                        className={`flex-1 ${isSaved ? viewCls : inputCls}`} />
                      {!isSaved && (
                        <>
                          <span className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center">
                            <EditOutlined />
                          </span>
                          {idx === 0 && modalForm.phones.length < 2 && (
                            <span className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center"
                              onClick={() => setM('phones', ['', modalForm.phones[0]])}>
                              <PlusOutlined />
                            </span>
                          )}
                          {idx > 0 && (
                            <span className="border border-red-400 text-red-400 rounded p-1.5 cursor-pointer flex items-center"
                              onClick={() => setM('phones', [modalForm.phones[0]])}>
                              <DeleteOutlined />
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {!isSaved && modalErrors.phone0 && <p className="text-xs text-red-500 mt-0.5">{modalErrors.phone0}</p>}
              </div>

              {/* Email */}
              <div>
                <FieldLabel text={UZ.royxatgaOlish.pochta} required />
                <div className="flex flex-col gap-2">
                  {(isSaved ? savedData?.emails ?? [] : modalForm.emails).map((email, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input type="email" value={email} readOnly={isSaved}
                        onChange={isSaved ? undefined : e => setMEmail(idx, e.target.value)}
                        placeholder="example@mail.com"
                        className={`flex-1 ${isSaved ? viewCls : inputCls}`} />
                      {!isSaved && (
                        <>
                          <span className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center">
                            <EditOutlined />
                          </span>
                          {idx === 0 && modalForm.emails.length < 2 && (
                            <span className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center"
                              onClick={() => setM('emails', ['', modalForm.emails[0]])}>
                              <PlusOutlined />
                            </span>
                          )}
                          {idx > 0 && (
                            <span className="border border-red-400 text-red-400 rounded p-1.5 cursor-pointer flex items-center"
                              onClick={() => setM('emails', [modalForm.emails[0]])}>
                              <DeleteOutlined />
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {!isSaved && modalErrors.email0 && <p className="text-xs text-red-500 mt-0.5">{modalErrors.email0}</p>}
                {!isSaved && modalErrors.email1 && <p className="text-xs text-red-500 mt-0.5">{modalErrors.email1}</p>}
              </div>

            </div>
          </div>

          {/* ══ SECTION 2 ══ */}
          <h2 className="text-[20px] font-semibold text-[#3380FF] text-center mb-6">{UZ.royxatgaOlish.section2}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Harbiy lavozimi */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                {UZ.tinglovchilar.harbiyLavozimiLabel}<span className="text-[#E00000] ml-0.5">*</span>
              </label>
              {isSaved ? <div className={viewCls}>{savedData?.harbiyLavozimi}</div> : (
                <>
                  <Select className="w-full" size="middle" placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.tinglovchilar.harbiyLavozimiOptions)}
                    value={modalForm.harbiyLavozimi || undefined}
                    onChange={v => setM('harbiyLavozimi', v)} />
                  {modalErrors.harbiyLavozimi && <p className="text-xs text-red-500 mt-0.5">{modalErrors.harbiyLavozimi}</p>}
                </>
              )}
            </div>

            {/* Guvohnoma raqami */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                {UZ.tinglovchilar.guvohnomaRaqamiLabel}<span className="text-[#E00000] ml-0.5">*</span>
              </label>
              {isSaved ? <div className={viewCls}>{savedData?.guvohnomaRaqami}</div> : (
                <>
                  <input type="text" value={modalForm.guvohnomaRaqami}
                    onChange={e => setM('guvohnomaRaqami', e.target.value)}
                    placeholder={UZ.tinglovchilar.guvohnomaPlaceholder}
                    className={inputCls2} />
                  {modalErrors.guvohnomaRaqami && <p className="text-xs text-red-500 mt-0.5">{modalErrors.guvohnomaRaqami}</p>}
                </>
              )}
            </div>

            {/* Guruhi */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                {UZ.tinglovchilar.guruhiLabel}<span className="text-[#E00000] ml-0.5">*</span>
              </label>
              {isSaved ? <div className={viewCls}>{savedData?.guruhi}</div> : (
                <>
                  <input type="text" value={modalForm.guruhi}
                    onChange={e => setM('guruhi', e.target.value)}
                    placeholder={UZ.tinglovchilar.guruhiPlaceholder}
                    className={inputCls2} />
                  {modalErrors.guruhi && <p className="text-xs text-red-500 mt-0.5">{modalErrors.guruhi}</p>}
                </>
              )}
            </div>

          </div>

          {/* Action button */}
          <div className="mt-6 overflow-hidden">
            {isSaved ? (
              <button
                onClick={() => setIsSaved(false)}
                className="bg-[#E04545] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#c73b3b] transition-colors float-right"
              >
                {UZ.tinglovchilar.tahrirlash}
              </button>
            ) : (
              <button
                onClick={handleModalSubmit}
                disabled={modalSubmitting}
                className="bg-[#2DCE8A] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#25b878] disabled:opacity-60 disabled:cursor-not-allowed transition-colors float-right"
              >
                {UZ.royxatgaOlish.saqlash}
              </button>
            )}
          </div>

        </div>
      </Modal>
    </div>
  );
}
