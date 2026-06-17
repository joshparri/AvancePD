"use client";

import { useEffect } from 'react';
import { initEyeCareCoordinator } from '@/shared/health/eyeCareCoordinator';

export default function EyeCareInitializer() {
  useEffect(() => {
    initEyeCareCoordinator();
    return () => {
      // noop for now
    };
  }, []);
  return null;
}
