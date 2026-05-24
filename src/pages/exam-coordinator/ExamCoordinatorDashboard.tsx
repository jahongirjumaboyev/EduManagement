import { UZ } from '@/constants/uz';

export default function ExamCoordinatorDashboard() {
  return (
    <div className="p-3 md:p-6">
      <h1 className="text-base md:text-xl font-semibold">
        {UZ.roles['exam-coordinator']} — {UZ.common.dashboard}
      </h1>
    </div>
  );
}
