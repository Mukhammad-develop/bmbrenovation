'use client';

import { useEffect } from 'react';

export default function LandingScript({ code }: { code: string }) {
  useEffect(() => {
    try {
      const fn = new Function(code);
      fn();
    } catch (e) {
      console.error('Failed to execute landing page script', e);
    }
  }, [code]);

  return null;
}
