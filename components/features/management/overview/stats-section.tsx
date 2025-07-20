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
            className="rounded-2xl p-4 border border-gray-100 shadow-sm transition hover:shadow-md bg-gradient-to-br from-green-100/30 via-white/20 to-white/10 backdrop-blur-md"
          >
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>

            <div className="flex justify-between items-center mt-2">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <span
                className={`text-sm font-semibold ${
                  stat.trend === "down" ? "text-red-600" : "text-green-600"
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
