import { UZ } from '@/constants/uz';

export default function DeanDashboard() {
  return (
    <div className="p-3 md:p-6">
      <h1 className="text-base md:text-xl font-semibold">
        {UZ.roles.dean} — {UZ.common.dashboard}
      </h1>
    </div>
  );
}
