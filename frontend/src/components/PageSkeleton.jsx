export default function PageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
      <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-full"></div>
      <div className="w-64 h-4 bg-gray-200 animate-pulse rounded"></div>
      <div className="w-40 h-4 bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
}
