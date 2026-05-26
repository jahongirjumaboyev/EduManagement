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
  CloudUploadOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Select, DatePicker, Upload, Avatar } from 'antd';
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

interface FormState {
  jshshir: string;
  fio: string;
  malumoti: string;
  pasport: string;
  berilganSana: Dayjs | null;
  jinsi: string;
  tugilganSana: Dayjs | null;
  millati: string;
  kimTomonidan: string;
  fuqaroligi: string;
  phones: string[];
  emails: string[];
  tarkibiyTuzilma: string;
  lavozimi: string;
  ilmiyUnvoni: string;
  ilmiyDarajasi: string;
  guvohnomaRaqami: string;
  harbiyUnvoni: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function toOpts(arr: readonly string[]) {
  return arr.map(v => ({ value: v, label: v }));
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="text-xs text-gray-500 mb-1 block">
      {text}
      {required && <span className="text-[#E00000] ml-0.5">*</span>}
    </label>
  );
}

// ── Sidebar items ──────────────────────────────────────────────────────────

const MENU_ITEMS: SidebarItem[] = [
  { icon: <AppstoreOutlined />, label: UZ.darsJadvali.boshSahifa,       path: '/kadr/bosh-sahifa' },
  { icon: <UserAddOutlined />,  label: UZ.darsJadvali.royxatgaOlish,    path: '/kadr/royxatga-olish', active: true },
  { icon: <UserOutlined />,     label: UZ.darsJadvali.profil,            path: '' },
  { icon: <FileTextOutlined />, label: UZ.darsJadvali.hisobotlar,        path: '', hasArrow: true },
  {
    icon: <TeamOutlined />,
    label: UZ.darsJadvali.kursantlar,
    path: '',
    subItems: [
      { label: UZ.kursantlar.menuLabel,         path: '/rahbariyat/kursant-tinglovchilar/kursantlar' },
      { label: UZ.kursantlar.tinglovchilarLabel, path: '/rahbariyat/kursant-tinglovchilar/tinglovchilar' },
    ],
  },
  { icon: <MessageOutlined />,  label: UZ.darsJadvali.xabarlar,          path: '' },
  { icon: <QuestionCircleOutlined />, label: UZ.darsJadvali.savolJavob,  path: '' },
];

// ── Initial form ───────────────────────────────────────────────────────────

const EMPTY_FORM: FormState = {
  jshshir: '',
  fio: '',
  malumoti: '',
  pasport: '',
  berilganSana: null,
  jinsi: '',
  tugilganSana: null,
  millati: '',
  kimTomonidan: '',
  fuqaroligi: '',
  phones: [''],
  emails: [''],
  tarkibiyTuzilma: '',
  lavozimi: '',
  ilmiyUnvoni: '',
  ilmiyDarajasi: '',
  guvohnomaRaqami: '',
  harbiyUnvoni: '',
};

// ── Component ──────────────────────────────────────────────────────────────

export default function RoyxatgaOlish() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kursantlarOpen, setKursantlarOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const set = (field: keyof FormState, value: FormState[keyof FormState]) =>
    setForm(f => ({ ...f, [field]: value }));

  const setPhone = (idx: number, val: string) => {
    const next = [...form.phones];
    next[idx] = val.replace(/[^\d+]/g, '');
    set('phones', next);
  };

  const setEmail = (idx: number, val: string) => {
    const next = [...form.emails];
    next[idx] = val;
    set('emails', next);
  };

  const handleSubmit = () => {
    const R = UZ.royxatgaOlish;
    const e: Record<string, string> = {};

    if (!/^\d{14}$/.test(form.jshshir))          e.jshshir        = R.jshshirError;
    if (!form.fio.trim())                          e.fio            = R.majburiy;
    if (!form.malumoti)                            e.malumoti       = R.majburiy;
    if (!/^[A-Z]{2}\d{7}$/.test(form.pasport))    e.pasport        = R.pasportError;
    if (!form.berilganSana)                        e.berilganSana   = R.majburiy;
    if (!form.jinsi)                               e.jinsi          = R.majburiy;
    if (!form.tugilganSana)                        e.tugilganSana   = R.majburiy;
    if (!form.millati)                             e.millati        = R.majburiy;
    if (!form.fuqaroligi)                          e.fuqaroligi     = R.majburiy;
    if (!form.phones[0])                           e.phone0         = R.majburiy;
    if (!form.emails[0]) {
      e.email0 = R.majburiy;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emails[0])) {
      e.email0 = R.emailError;
    }
    if (form.emails[1] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emails[1])) {
      e.email1 = R.emailError;
    }
    if (!form.tarkibiyTuzilma)                     e.tarkibiyTuzilma = R.majburiy;
    if (!form.lavozimi)                            e.lavozimi       = R.majburiy;
    if (!form.ilmiyUnvoni)                         e.ilmiyUnvoni    = R.majburiy;
    if (!form.guvohnomaRaqami.trim())              e.guvohnomaRaqami = R.majburiy;
    if (!form.harbiyUnvoni)                        e.harbiyUnvoni   = R.majburiy;

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    console.log(form);
    setSubmitting(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#3380FF] bg-white';

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* Mobile overlay */}
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
              {[currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds()].map((n, i) => (
                <span key={i} className="font-inter text-base sm:text-xl lg:text-2xl font-bold text-[#05276C] leading-none">
                  {i > 0 && <span className="mr-1 sm:mr-2">:</span>}
                  {String(n).padStart(2, '0')}
                </span>
              ))}
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
          <h1 className="text-lg font-bold text-gray-900 mb-4 uppercase">{UZ.royxatgaOlish.pageTitle}</h1>

          <div className="bg-white rounded-xl border-t-4 border-[#3380FF] border border-gray-200 p-4 sm:p-6">

            {/* ══ SECTION 1 ══ */}
            <h2 className="text-[20px] font-semibold text-[#3380FF] text-center mb-6">{UZ.royxatgaOlish.section1}</h2>

            <div className="flex flex-col sm:flex-row gap-4">

              {/* Photo upload */}
              <div className="sm:w-48 sm:flex-shrink-0">
                <Upload
                  accept=".jpg,.jpeg,.png"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={file => {
                    const reader = new FileReader();
                    reader.onload = e => {
                      if (e.target?.result) setPhotoPreview(e.target.result as string);
                    };
                    reader.readAsDataURL(file);
                    return false;
                  }}
                >
                  <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 min-h-[200px] sm:h-full cursor-pointer hover:border-blue-400 transition-colors">
                    <p className="text-sm text-gray-500 mb-2">{UZ.royxatgaOlish.foto}</p>
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-24 h-24 object-cover rounded" />
                    ) : (
                      <>
                        <CloudUploadOutlined className="text-5xl text-blue-400" />
                        <p className="text-xs text-center text-gray-500">{UZ.royxatgaOlish.fotoUpload}</p>
                        <p className="text-[10px] text-gray-400 text-center">{UZ.royxatgaOlish.fotoFormat}</p>
                      </>
                    )}
                  </div>
                </Upload>
              </div>

              {/* Fields grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Row 1 */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.jshshir} required />
                  <input
                    type="text"
                    value={form.jshshir}
                    onChange={e => set('jshshir', e.target.value.replace(/\D/g, '').slice(0, 14))}
                    placeholder={UZ.royxatgaOlish.jshshirPlaceholder}
                    maxLength={14}
                    className={inputCls}
                  />
                  {errors.jshshir && <p className="text-xs text-red-500 mt-0.5">{errors.jshshir}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.fio} required />
                  <input
                    type="text"
                    value={form.fio}
                    onChange={e => set('fio', e.target.value)}
                    placeholder={UZ.royxatgaOlish.fioPlaceholder}
                    className={inputCls}
                  />
                  {errors.fio && <p className="text-xs text-red-500 mt-0.5">{errors.fio}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.malumoti} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.royxatgaOlish.malumotiOptions)}
                    value={form.malumoti || undefined}
                    onChange={v => set('malumoti', v)}
                  />
                  {errors.malumoti && <p className="text-xs text-red-500 mt-0.5">{errors.malumoti}</p>}
                </div>

                {/* Row 2 */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.pasport} required />
                  <input
                    type="text"
                    value={form.pasport}
                    onChange={e => {
                      const v = e.target.value.toUpperCase().slice(0, 9);
                      set('pasport', v);
                    }}
                    placeholder={UZ.royxatgaOlish.pasportPlaceholder}
                    className={inputCls}
                  />
                  {errors.pasport && <p className="text-xs text-red-500 mt-0.5">{errors.pasport}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.berilganSana} required />
                  <DatePicker
                    className="w-full"
                    format="DD.MM.YYYY"
                    value={form.berilganSana}
                    onChange={v => set('berilganSana', v)}
                  />
                  {errors.berilganSana && <p className="text-xs text-red-500 mt-0.5">{errors.berilganSana}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.jinsi} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.royxatgaOlish.jinsOptions)}
                    value={form.jinsi || undefined}
                    onChange={v => set('jinsi', v)}
                  />
                  {errors.jinsi && <p className="text-xs text-red-500 mt-0.5">{errors.jinsi}</p>}
                </div>

                {/* Row 3 */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.tugilganSana} required />
                  <DatePicker
                    className="w-full"
                    format="DD.MM.YYYY"
                    value={form.tugilganSana}
                    onChange={v => set('tugilganSana', v)}
                  />
                  {errors.tugilganSana && <p className="text-xs text-red-500 mt-0.5">{errors.tugilganSana}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.millati} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.royxatgaOlish.millatOptions)}
                    value={form.millati || undefined}
                    onChange={v => set('millati', v)}
                  />
                  {errors.millati && <p className="text-xs text-red-500 mt-0.5">{errors.millati}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.kimTomonidan} />
                  <input
                    type="text"
                    value={form.kimTomonidan}
                    onChange={e => set('kimTomonidan', e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Row 4 */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.fuqaroligi} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.royxatgaOlish.fuqaroligiOptions)}
                    value={form.fuqaroligi || undefined}
                    onChange={v => set('fuqaroligi', v)}
                  />
                  {errors.fuqaroligi && <p className="text-xs text-red-500 mt-0.5">{errors.fuqaroligi}</p>}
                </div>

                {/* Phone */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.telefon} required />
                  <div className="flex flex-col gap-2">
                    {form.phones.map((phone, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={phone}
                          onChange={e => setPhone(idx, e.target.value)}
                          placeholder="+998 XX XXX XX XX"
                          className={`flex-1 ${inputCls}`}
                        />
                        <span className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center">
                          <EditOutlined />
                        </span>
                        {idx === 0 && form.phones.length < 2 ? (
                          <span
                            className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center"
                            onClick={() => set('phones', [...form.phones, ''])}
                          >
                            <PlusOutlined />
                          </span>
                        ) : idx > 0 ? (
                          <span
                            className="border border-red-400 text-red-400 rounded p-1.5 cursor-pointer flex items-center"
                            onClick={() => set('phones', form.phones.filter((_, i) => i !== idx))}
                          >
                            <CloseOutlined />
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {errors.phone0 && <p className="text-xs text-red-500 mt-0.5">{errors.phone0}</p>}
                </div>

                {/* Email */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.pochta} required />
                  <div className="flex flex-col gap-2">
                    {form.emails.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(idx, e.target.value)}
                          placeholder="example@mail.com"
                          className={`flex-1 ${inputCls}`}
                        />
                        <span className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center">
                          <EditOutlined />
                        </span>
                        {idx === 0 && form.emails.length < 2 && (
                          <span
                            className="border border-[#2DCE8A] text-[#2DCE8A] rounded p-1.5 cursor-pointer flex items-center"
                            onClick={() => set('emails', [...form.emails, ''])}
                          >
                            <PlusOutlined />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.email0 && <p className="text-xs text-red-500 mt-0.5">{errors.email0}</p>}
                  {errors.email1 && <p className="text-xs text-red-500 mt-0.5">{errors.email1}</p>}
                </div>

              </div>
            </div>

            {/* ══ SECTION 2 ══ */}
            <div className="mt-8">
              <h2 className="text-[20px] font-semibold text-[#3380FF] text-center mb-6">{UZ.royxatgaOlish.section2}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Row 1 */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.tarkibiyTuzilma} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.royxatgaOlish.tarkibiyOptions)}
                    value={form.tarkibiyTuzilma || undefined}
                    onChange={v => set('tarkibiyTuzilma', v)}
                  />
                  {errors.tarkibiyTuzilma && <p className="text-xs text-red-500 mt-0.5">{errors.tarkibiyTuzilma}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.lavozimi} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.royxatgaOlish.lavozimOptions)}
                    value={form.lavozimi || undefined}
                    onChange={v => set('lavozimi', v)}
                  />
                  {errors.lavozimi && <p className="text-xs text-red-500 mt-0.5">{errors.lavozimi}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.ilmiyUnvoni} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder="-"
                    options={toOpts(UZ.royxatgaOlish.ilmiyUnvoniOptions)}
                    value={form.ilmiyUnvoni || undefined}
                    onChange={v => set('ilmiyUnvoni', v)}
                  />
                  {errors.ilmiyUnvoni && <p className="text-xs text-red-500 mt-0.5">{errors.ilmiyUnvoni}</p>}
                </div>

                {/* Row 2 */}
                <div>
                  <FieldLabel text={UZ.royxatgaOlish.ilmiyDarajasi} />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder="-"
                    options={toOpts(UZ.royxatgaOlish.ilmiyDarajasiOptions)}
                    value={form.ilmiyDarajasi || undefined}
                    onChange={v => set('ilmiyDarajasi', v)}
                  />
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.guvohnomaRaqami} required />
                  <input
                    type="text"
                    value={form.guvohnomaRaqami}
                    onChange={e => set('guvohnomaRaqami', e.target.value)}
                    placeholder={UZ.royxatgaOlish.guvohnomaPlaceholder}
                    className={inputCls}
                  />
                  {errors.guvohnomaRaqami && <p className="text-xs text-red-500 mt-0.5">{errors.guvohnomaRaqami}</p>}
                </div>

                <div>
                  <FieldLabel text={UZ.royxatgaOlish.harbiyUnvoni} required />
                  <Select
                    className="w-full"
                    size="middle"
                    placeholder={UZ.royxatgaOlish.tanlang}
                    options={toOpts(UZ.royxatgaOlish.harbiyUnvoniOptions)}
                    value={form.harbiyUnvoni || undefined}
                    onChange={v => set('harbiyUnvoni', v)}
                  />
                  {errors.harbiyUnvoni && <p className="text-xs text-red-500 mt-0.5">{errors.harbiyUnvoni}</p>}
                </div>

              </div>
            </div>

            {/* Save button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#2DCE8A] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#25b878] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {UZ.royxatgaOlish.saqlash}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
