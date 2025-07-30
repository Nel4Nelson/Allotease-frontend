"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, use } from 'react';
import { EventDetailsPage } from '@/components/features/home/event-details-page';
import { StayDetailsPage } from '@/components/features/home/stay-details-page';

interface DynamicPageProps {
  params: Promise<{
    id: string;
  }>;
}

function DynamicPageContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  if (type === 'events') {
    return (
      <div className="container mx-auto px-4 py-8">
        <EventDetailsPage id={id} />
      </div>
    );
  }

  if (type === 'stays') {
    return (
      <div className="container mx-auto px-4 py-8">
         <StayDetailsPage id={id} />
      </div>
    );
  }

  if (type === 'car-parks') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Car Park Details</h1>
          <p className="text-lg text-gray-600 mb-6">Car Park ID: {id}</p>
          
          {/* Placeholder content - you can replace this with your actual car park details component */}
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Parking Information</h2>
            <p className="text-gray-700">
              This is where your car park details will be displayed. 
              You can fetch the car park data using the ID: <code className="bg-gray-200 px-2 py-1 rounded">{id}</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle other types or default case
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600">
          {type ? `Unknown type: ${type}` : 'No type specified'}
        </p>
      </div>
    </div>
  );
}

export default function DynamicPage({ params }: DynamicPageProps) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <DynamicPageContent id={id} />
    </Suspense>
  );
}