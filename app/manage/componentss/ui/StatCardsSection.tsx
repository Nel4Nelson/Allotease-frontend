<<<<<<< HEAD
import React from 'react';

interface ReservationStatCard {
  title: string;
  totalNo: number;
  percentage: string;
}
=======
import React from "react";
>>>>>>> development

interface ReservationStatCard {
  title: string;
  totalNo: number;
  percentage: string;
}

const stats: ReservationStatCard[] = [
  {
    title: 'Total Reservation',
    totalNo: 124,
    percentage: '+12%',
  },
  {
    title: 'Pending Reservations',
    totalNo: 30,
    percentage: '-8%',
  },
  {
    title: 'Confirmed Reservations',
    totalNo: 80,
    percentage: '+20%',
  },
  {
    title: 'Cancelled Reservations',
    totalNo: 14,
    percentage: '-5%',
  },
];

const StatCardsSection: React.FC = () => {
  return (
    <section className="w-full py-6">
      {/* Hide on mobile, show from sm and above */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl p-4 border border-gray-100 shadow-sm transition hover:shadow-md bg-gradient-to-br from-green-100/30 via-white/20 to-white/10 backdrop-blur-md"
          >
            <h3 className="text-sm font-medium text-gray-600">{item.title}</h3>

            <div className="flex justify-between items-center mt-2">
              <p className="text-3xl font-bold text-gray-900">{item.totalNo}</p>
              <span
                className={`text-sm font-semibold ${
                  item.percentage.startsWith('-')
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {item.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatCardsSection;
