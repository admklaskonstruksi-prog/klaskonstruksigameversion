"use client";

type DataPoint = { label: string; revenue: number };

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const formatRp = (n: number) =>
    n >= 1e6 ? `${(n / 1e6).toFixed(1)}jt` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}k` : n.toString();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Grafik Revenue</h3>
      <div className="flex items-end gap-3 h-48">
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada data revenue.</p>
        ) : (
          data.map((d, i) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                {formatRp(d.revenue)}
              </span>
              <div
                className="w-full bg-gray-100 rounded-t transition-all hover:bg-blue-200"
                style={{ height: "140px" }}
              >
                <div
                  className="w-full bg-blue-500 rounded-t transition-all min-h-[4px]"
                  style={{
                    height: `${Math.max(4, (d.revenue / max) * 140)}px`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium truncate w-full text-center">
                {d.label}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
