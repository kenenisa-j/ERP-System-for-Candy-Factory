'use client';
import { RoleProvider } from './RoleProvider'; // We will create this below
import { ToastProvider } from './ui/Toast';    // Assuming your Toast.tsx can act as a provider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </RoleProvider>
  );
}