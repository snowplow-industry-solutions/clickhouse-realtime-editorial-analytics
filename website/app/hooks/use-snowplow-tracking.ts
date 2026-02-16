'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageViewEvent } from '@/website/lib/snowplow';

export function useSnowplowTracking() {
  const pathname = usePathname();
  const lastPathnameRef = useRef<string>('');
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    // Track page view on initial mount and when pathname changes
    if (pathname && (isInitialMount.current || pathname !== lastPathnameRef.current)) {
      console.log('Tracking page view for:', pathname);
      trackPageViewEvent();
      lastPathnameRef.current = pathname;
      isInitialMount.current = false;
    }
  }, [pathname]);
} 