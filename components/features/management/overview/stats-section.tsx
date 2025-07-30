"use client";

export interface StatCard {
  title: string;
  value: number;
  percentage: string;
  trend: "up" | "down";
}

interface StatsSectionProps {
  stats: StatCard[];
  loading?: boolean;
}

export function StatsSection({ stats, loading = false }: StatsSectionProps) {
  if (loading) {
    return (
      <section className="w-full py-6">
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 border border-gray-100 bg-gray-50 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-6">
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl p-2 px-5 w-[160px] border border-[#8AAEA433] shadow-xs transition backdrop-blur-sm hover:bg-fancy-gradient"
          >
            <h3 className="font-semibold text-[#71727A]">{stat.title}</h3>

            <div className="flex justify-between items-center mt-2">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <span
                className={`text-sm font-semibold bg-[#8AAEA433] py-1 px-3 rounded-sm ${
                  stat.trend === "down" ? "text-red-600" : "text-[#1F3A3A]"
                }`}
              >
                {stat.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
