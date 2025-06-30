'use client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useServiceTabs } from '@/hooks/use-service-tabs';
import { usePagination } from '@/hooks/use-pagination';
import { sampleEvents } from '@/data/sample-events';
import { FeaturedOrganizers, HeroBanner, ServiceTabs } from '@/components/features/home';
import { ServiceCard } from '@/components/features/shared';

export default function HomePage() {
  const { activeTab, changeTab } = useServiceTabs('events'); // Default to events
  const { visibleCount, toggleShowMore, showingAll } = usePagination({
    totalItems: sampleEvents.length,
    initialPageSize: 6,
  });

  // Get current service data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'events':
        return sampleEvents;
      case 'stays':
        return []; // Will add later
      case 'car-parks':
        return []; // Will add later
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const visibleData = currentData.slice(0, visibleCount);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="space-y-8">
        <HeroBanner />
        
        <section className="px-4 md:px-8">
          <ServiceTabs activeTab={activeTab} onTabChange={changeTab} />
          
          {/* Service Grid */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ServiceCard items={visibleData} />
            </div>

            {/* Show More/Less Button */}
            {currentData.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  onClick={toggleShowMore}
                  className="px-6 py-2 bg-[#F2F4F799] text-[#FF5B00] rounded-full font-medium hover:bg-[#F2F4F7] transition-colors"
                >
                  {showingAll ? 'Show Less' : 'See More'}
                </button>
              </div>
            )}
          </div>
        </section>

        <FeaturedOrganizers />
      </main>
      
      <Footer />
    </div>
  );
}