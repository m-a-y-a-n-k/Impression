"use client";

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <ProgressProvider>
            {children}
          </ProgressProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
