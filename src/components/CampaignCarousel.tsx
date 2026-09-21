'use client';

import React, { useRef } from 'react';

export default function CampaignCarousel({ campaigns }: { campaigns: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-red-700">Campaigns</p>
          <h2 className="mt-1.5 text-2xl font-extrabold sm:mt-2 sm:text-3xl">Current Blood Donation Campaigns</h2>
        </div>
        <div className="hidden shrink-0 gap-3 sm:flex">
          <button aria-label="Previous campaign" className="icon-btn" onClick={scrollLeft} type="button">&larr;</button>
          <button aria-label="Next campaign" className="icon-btn" onClick={scrollRight} type="button">&rarr;</button>
        </div>
      </div>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-5 sm:overflow-visible" 
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <article 
                key={campaign.id} 
                className="card campaign-card group w-[75vw] min-w-[260px] max-w-[300px] shrink-0 snap-start overflow-hidden text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto sm:min-w-0 sm:max-w-none sm:snap-align-none"
              >
                <div className="relative h-32 overflow-hidden bg-red-50 sm:h-36">
                  <img 
                    className="campaign-image h-full w-full object-cover" 
                    src={campaign.image_url || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=900&q=80'} 
                    alt={campaign.title} 
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-red-700 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-white sm:text-xs">
                    {campaign.status || 'Upcoming'}
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base font-extrabold leading-snug sm:text-lg">{campaign.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-stone-600 sm:mt-2 sm:line-clamp-3 sm:leading-6">
                    {campaign.description}
                  </p>
                  <p className="mt-3 text-[11px] font-bold text-stone-500 sm:mt-4 sm:text-xs">
                    {campaign.date_range || ''} - {campaign.locations || ''}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="card p-5 sm:p-7 col-span-full">No campaigns posted yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
