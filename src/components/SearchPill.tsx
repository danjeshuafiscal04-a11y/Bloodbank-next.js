'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SearchPill({ 
  placeholder, 
  className = "search-pill w-full sm:max-w-xs block",
  inputClassName = "w-full bg-transparent outline-none text-sm text-stone-900"
}: { 
  placeholder: string;
  className?: string;
  inputClassName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (query) {
        current.set('q', query);
      } else {
        current.delete('q');
      }
      router.push(`${pathname}?${current.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, pathname, router, searchParams]);

  return (
    <div className={className}>
      <Search size={16} />
      <input 
        className={inputClassName} 
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
