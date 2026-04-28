'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Modal from '@/components/ui/Modal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name);
          setUserRole(profile.role || '');
        }
      }
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isAdmin = userRole === 'owner' || userRole === 'superadmin';

  const navItems = [
    ...(isAdmin ? [{ name: 'Intelligence Center', path: '/dashboard' }] : []),
    { name: 'Sales', path: '/sales' },
    { name: 'Production', path: '/production' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Attendance', path: '/attendance' },
    ...(isAdmin ? [
      { name: 'Payroll', path: '/payroll' },
      { name: 'Staff', path: '/staff' },
      { name: 'Workers', path: '/workers' }
    ] : []),
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Container: h-screen and overflow-hidden ensures a static structure */}
      <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        
        {/* Sidebar: flex-shrink-0 keeps it from collapsing, h-full keeps it static */}
        <aside className={`flex-shrink-0 w-64 z-50 ${isDarkMode ? 'bg-gray-950' : 'bg-blue-900'} text-white p-6 transition-all duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative absolute inset-y-0`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Candy ERP</h2>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                onClick={() => setIsOpen(false)}
                className={`block py-2.5 px-4 rounded-lg transition-all border-l-4 ${
                  pathname === item.path 
                    ? 'bg-blue-600 border-blue-300 font-semibold shadow-md' 
                    : 'border-transparent hover:bg-blue-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content Area: flex-1 takes remaining space, overflow-y-auto makes it scrollable */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex justify-between items-center z-40`}>
            <button className="md:hidden p-2 bg-gray-100 dark:bg-gray-700 rounded" onClick={() => setIsOpen(!isOpen)}>☰</button>
            <div className="flex items-center gap-6">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">{isDarkMode ? '☀️' : '🌙'}</button>
              <div className="hidden md:flex flex-col text-sm">
                <span className="font-bold">{userName || 'User'}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{userEmail}</span>
              </div>
              <button onClick={() => setShowLogoutModal(true)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-medium transition">Logout</button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>

        {showLogoutModal && (
          <Modal onClose={() => setShowLogoutModal(false)}>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Leave?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to log out of Candy ERP?</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowLogoutModal(false)} className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleLogout} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Logout</button>
              </div>
            </div>
          </Modal>
        )}
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>}
      </div>
    </div>
  );
}