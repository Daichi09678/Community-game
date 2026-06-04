'use client';

export function ReportSkeleton() {
  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-3 animate-pulse">
      <div className="flex gap-4">
        <div className="w-[42px]">
          <div className="w-8 h-8 bg-[rgba(200,169,110,0.1)] rounded" />
        </div>
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <div className="w-16 h-5 bg-[rgba(200,169,110,0.1)] rounded" />
            <div className="w-12 h-5 bg-[rgba(78,205,196,0.1)] rounded" />
          </div>
          <div className="w-3/4 h-5 bg-[rgba(200,169,110,0.1)] rounded mb-2" />
          <div className="w-full h-4 bg-[rgba(200,169,110,0.05)] rounded mb-2" />
          <div className="w-2/3 h-4 bg-[rgba(200,169,110,0.05)] rounded mb-3" />
          <div className="flex gap-2">
            <div className="w-16 h-4 bg-[rgba(200,169,110,0.05)] rounded" />
            <div className="w-20 h-4 bg-[rgba(78,205,196,0.05)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-[14px]"><div className="w-48 h-4 bg-[rgba(200,169,110,0.1)] rounded" /></td>
      <td className="px-4 py-[14px]"><div className="w-20 h-5 bg-[rgba(78,205,196,0.1)] rounded" /></td>
      <td className="px-4 py-[14px]"><div className="w-16 h-5 bg-[rgba(200,169,110,0.1)] rounded" /></td>
      <td className="px-4 py-[14px]"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[rgba(200,169,110,0.1)]" /><div className="w-20 h-4 bg-[rgba(200,169,110,0.1)] rounded" /></div></td>
      <td className="px-4 py-[14px]"><div className="w-24 h-4 bg-[rgba(200,169,110,0.1)] rounded" /></td>
      <td className="px-4 py-[14px]"><div className="w-12 h-4 bg-[rgba(78,205,196,0.1)] rounded" /></td>
      <td className="px-4 py-[14px]"><div className="w-16 h-4 bg-[rgba(200,169,110,0.05)] rounded" /></td>
    </tr>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto">
      <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
        <div className="w-32 h-5 bg-[rgba(200,169,110,0.1)] rounded animate-pulse" />
      </div>
      <div className="flex-1 px-4 py-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-[9px] mb-1">
            <div className="w-4 h-4 bg-[rgba(200,169,110,0.1)] rounded animate-pulse" />
            <div className="flex-1 h-4 bg-[rgba(200,169,110,0.08)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </aside>
  );
}