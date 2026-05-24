import { UZ } from '@/constants/uz';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-gray-500">{UZ.common.error404}</p>
    </div>
  );
}
