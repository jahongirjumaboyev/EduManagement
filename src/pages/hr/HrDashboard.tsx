import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import { UZ } from '@/constants/uz';
import logo from '@/assets/images/logo.svg';

// ── Constants ──────────────────────────────────────────────────────────────

const TIME_SLOTS = ['08:30–09:50', '10:00–11:20', '11:30–12:50', '14:00–15:20', '15:30–16:50'];
const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const COURSES = [1, 2, 3, 4];

const UZ_WEEKDAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const UZ_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
];

function getAcademicYears(): string[] {
  const now = new Date();
  const startOfCurrent = now.getMonth() + 1 >= 9 ? now.getFullYear() : now.getFullYear() - 1;
  const years: string[] = [];
  for (let y = 2023; y <= startOfCurrent; y++) years.push(`${y}-${y + 1}`);
  return years;
}

const ACADEMIC_YEARS = getAcademicYears();

// ── Mock schedule data ─────────────────────────────────────────────────────

type LessonType = "ma'ruza" | 'seminar' | 'amaliy' | 'kurs boshliqlari';

interface ScheduleCell {
  subject: string;
  teacher: string;
  room: string;
  type: LessonType;
}

const SUBJECTS_BY_COURSE: (string | null)[][] = [
  ['Matematika', 'Fizika', "O'zbek tili", 'Ingliz tili', 'Tarix', 'Huquq asoslari', 'Informatika', 'J/T'],
  ['Iqtisodiyot', 'Buxgalteriya', 'Bojxona ishi', 'Menejment', 'Statistika', 'Huquq', 'Ingliz tili', 'Falsafa'],
  ['Bojxona qonuni', "Xalqaro savdo", 'Moliya', 'Menejment', 'Soliq huquqi', 'Logistika', 'Ingliz tili', null],
  ['Ilmiy tadqiqot', 'Bitiruv ishi', 'JTO qoidalari', 'Bojxona admin', 'Xalqaro huquq', 'Tanlov fani', null, null],
];

const TEACHERS = ['A. Karimov', 'B. Toshmatov', 'D. Yusupov', 'G. Nazarova', 'H. Rahimov', 'M. Xoliqov', 'N. Mirzayeva', 'S. Tursunov'];
const ROOMS = ['101', '203', '105', '302', '104', '208', 'B-101', 'Lab.'];
const TYPES: LessonType[] = ["ma'ruza", 'seminar', 'kurs boshliqlari', 'amaliy'];

function getMockCell(course: number, dayIdx: number, slotIdx: number): ScheduleCell | null {
  if (dayIdx === 5 && slotIdx >= 2) return null;
  const subjects = SUBJECTS_BY_COURSE[course - 1];
  const subject = subjects[(dayIdx * 5 + slotIdx + course * 3) % subjects.length];
  if (!subject) return null;
  return {
    subject,
    teacher: TEACHERS[(dayIdx + slotIdx + course) % TEACHERS.length],
    room: ROOMS[(dayIdx * 3 + slotIdx + course) % ROOMS.length],
    type: TYPES[(dayIdx + slotIdx) % 3],
  };
}

// ── Style maps ─────────────────────────────────────────────────────────────

const TYPE_CELL: Record<LessonType, string> = {
  "ma'ruza":    'border-l-4 border-blue-500 bg-blue-50',
  "seminar":      'border-l-4 border-[#1DB885] bg-green-50',
  "kurs boshliqlari": 'border-l-4 border-orange-400 bg-orange-50',
  "amaliy": 'border-l-4 border-purple-500 bg-purple-50',
};

const TYPE_BADGE: Record<LessonType, string> = {
  "ma'ruza":    'bg-blue-100 text-blue-700',
  "seminar":      'bg-green-100 text-green-700',
  "kurs boshliqlari": 'bg-orange-100 text-orange-700',
  "amaliy": 'bg-purple-100 text-purple-700',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(d: Date) {
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()} | ${UZ_WEEKDAYS[d.getDay()]}`;
}
function formatTime(d: Date) {
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}

// ── Component ──────────────────────────────────────────────────────────────

export default function HrDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(ACADEMIC_YEARS[ACADEMIC_YEARS.length - 1]);
  const [selectedCourse, setSelectedCourse] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-[140px]">
            <img src={logo} alt="Logo" className="h-9 w-9 shrink-0" />
            <span className="text-[#1DB885] font-bold text-xs uppercase leading-tight hidden sm:block">
              {UZ.common.systemNameLine1}<br />{UZ.common.systemNameLine2}
            </span>
          </div>

          {/* Date & Time — center */}
          <div className="flex flex-col items-center select-none">
            <div>
              <span className="text-gray-600 text-xs sm:text-sm font-medium">{formatDate(now)}</span>
            </div>
            <div className="">
              <span className="text-[#1DB885] text-lg sm:text-2xl font-bold tabular-nums tracking-wide border rounded-[4px] boreder-[#6192FE] border-dashed mt-1 px-2 py-0.5">
              {formatTime(now)}</span>
            </div>
            
          </div>

          {/* Logout */}
          <div className="min-w-[140px] flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <span className="hidden sm:inline">{UZ.common.logout}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="bg-white border-b px-4 md:px-8 py-4 space-y-3">
        {/* Academic year */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 w-32 shrink-0">
            {UZ.head.academicYear}:
          </span>
          <div className="flex flex-wrap gap-2">
            {ACADEMIC_YEARS.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedYear === y
                    ? 'bg-[#1DB885] text-white border-[#1DB885]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#1DB885] hover:text-[#1DB885]'
                }`}
              >
                {y} y.
              </button>
            ))}
          </div>
        </div>

        {/* Course */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 w-32 shrink-0">
            {UZ.head.selectCourse}:
          </span>
          <div className="flex flex-wrap gap-2">
            {COURSES.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCourse(c)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedCourse === c
                    ? 'bg-[#1DB885] text-white border-[#1DB885]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#1DB885] hover:text-[#1DB885]'
                }`}
              >
                {c}-kurs
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Timetable ── */}
      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl shadow-sm overflow-hidden bg-white">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#1DB885] text-white">
                  <th className="py-3 px-4 text-left text-sm font-semibold w-[110px] border-r border-white/20">
                    {UZ.head.time}
                  </th>
                  {DAYS.map(d => (
                    <th key={d} className="py-3 px-3 text-center text-sm font-semibold min-w-[148px] border-r border-white/20 last:border-r-0">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot, slotIdx) => (
                  <tr key={slot} className={`border-b border-gray-100 ${slotIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}>
                    <td className="py-3 px-4 text-xs font-semibold text-gray-500 align-middle whitespace-nowrap border-r border-gray-100">
                      {slot}
                    </td>
                    {DAYS.map((_, dayIdx) => {
                      const cell = getMockCell(selectedCourse, dayIdx, slotIdx);
                      return (
                        <td key={dayIdx} className="py-2 px-2 align-top border-r border-gray-100 last:border-r-0">
                          {cell ? (
                            <div className={`rounded-r-lg pl-2 pr-2 py-2 ${TYPE_CELL[cell.type]}`}>
                              <div className="text-xs font-bold text-gray-800 leading-snug">{cell.subject}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{cell.teacher}</div>
                              <div className="flex items-center justify-between mt-1.5 gap-1">
                                <span className="text-[11px] text-gray-400">{cell.room}-xona</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${TYPE_BADGE[cell.type]}`}>
                                  {cell.type}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full py-2 text-gray-200 text-base select-none">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
