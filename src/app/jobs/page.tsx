'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Clock, MapPin, ChevronRight } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { bookingsService } from '@/services/bookings.service';
import { Booking, BookingStatus } from '@/types';
import { formatDate, formatTime, formatCurrency, getBookingStatusLabel, getBookingStatusColor, cn } from '@/utils';

const TABS: { label: string; status?: BookingStatus; fn: () => Promise<any> }[] = [
  { label: 'All',        fn: () => bookingsService.getWorkerBookings() },
  { label: 'New',        fn: () => bookingsService.getPendingRequests() },
  { label: 'Upcoming',   fn: () => bookingsService.getUpcomingJobs() },
  { label: 'Completed',  status: 'COMPLETED', fn: () => bookingsService.getWorkerBookings('COMPLETED') },
  { label: 'Cancelled',  status: 'CANCELLED', fn: () => bookingsService.getWorkerBookings('CANCELLED') },
];

export default function JobsPage() {
  const [active, setActive] = useState(0);
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    TABS[active].fn()
      .then((r: any) => setJobs(r.data.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <AppLayout>
      <PageHeader title="My Jobs" subtitle="Manage all your bookings" />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
              active === i ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <div className="card mt-4">
          <EmptyState icon={Briefcase} title="No jobs found" description="Jobs matching this filter will appear here." />
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="card hover:shadow-md hover:border-blue-100 active:scale-[0.99] transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-400">#{job.bookingNumber}</p>
                      <span className={cn('badge', getBookingStatusColor(job.status))}>
                        {getBookingStatusLabel(job.status)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 truncate">
                      {job.items?.[0]?.service?.name || 'Home Service'}
                      {(job.items?.length ?? 0) > 1 && <span className="text-gray-400"> +{(job.items?.length ?? 1) - 1} more</span>}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{job.user?.name || 'Customer'}</p>
                  </div>
                  <p className="font-bold text-gray-900 shrink-0">{formatCurrency(job.finalAmount)}</p>
                </div>

                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={14} />
                    {formatDate(job.scheduledDate)} · {formatTime(job.scheduledTime)}
                  </span>
                  {job.address && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin size={13} /> {job.address.city}
                    </span>
                  )}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
