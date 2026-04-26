'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRole } from '../hooks/useRole'; // Import your existing hook

const RoleContext = createContext<any>(null);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const roleData = useRole(); // Using your hook logic here
  return <RoleContext.Provider value={roleData}>{children}</RoleContext.Provider>;
};