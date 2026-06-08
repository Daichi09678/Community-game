'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/dashboard-admin/AdminSidebar';
import AdminStatCards from '@/components/dashboard-admin/AdminStatCards';
import UserActivityTable from '@/components/dashboard-admin/UserActivityTable';
import UserDetailPanel from '@/components/dashboard-admin/UserDetailPanel';
import AdminRightWidgets from '@/components/dashboard-admin/AdminRightWidgets';
import { MOCK_STATS, MOCK_USERS, UserActivity } from '@/components/dashboard-admin/data';

const clipBtn = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;

export default function DashboardAdminClient() {
  const [selectedUser, setSelectedUser] = useState<UserActivity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = MOCK_STATS;
  const filteredUsers = MOCK_USERS.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className="flex min-h-screen overflow-x-hidden"
        style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}
      >
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
        }} />

        <AdminSidebar activePage="dashboard" />

        <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
          <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
            <div>
              <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
                Hoyoverse Hub — <span className="text-[#C8A96E]">Admin Dashboard</span>
              </div>
              <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
                Admin Control Panel · {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]"
              style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>

          <div style={{ padding: '32px', flex: 1 }}>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-6 relative">
                  <svg width="80" height="80" viewBox="0 0 28 28" className="mx-auto">
                    <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2">
                      <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                    </polygon>
                    <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8">
                      <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8">
                      <animate attributeName="y2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
                    </line>
                    <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8">
                      <animate attributeName="y1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
                    </line>
                    <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                      <animate attributeName="x2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
                    </line>
                    <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                      <animate attributeName="x1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
                    </line>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
                <p className="mt-6 text-[#C8A96E] font-['Rajdhani',sans-serif] text-sm tracking-wider animate-pulse">
                  LOADING DASHBOARD...
                </p>
              </div>
            </div>
          </div>
        </main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}
    >
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
      }} />

      <AdminSidebar activePage="dashboard" />

      <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
        {/* Topbar */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.85)' }}
        >
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Hoyoverse Hub — <span className="text-[#C8A96E]">Admin Dashboard</span>
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
              Admin Control Panel · {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
            </div>
          </div>
          <div className="flex gap-[10px] items-center">
            <div
              className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-[14px] py-[7px] w-64 transition-colors duration-200 focus-within:border-[#C8A96E]"
              style={clipBtn}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[#E8E0CC] font-['Rajdhani',sans-serif] text-[0.88rem] flex-1 placeholder-[#5A5248]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#5A5248] hover:text-[#E05C7A] transition-colors">✕</button>
              )}
            </div>
            <div
              className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]"
              style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', flex: 1 }}>
          <AdminStatCards stats={stats} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-['Cinzel',serif] text-[0.95rem] font-semibold text-[#E8E0CC]">
                  User Activity Monitor
                  {searchQuery && (
                    <span className="ml-2 text-[0.7rem] text-[#C8A96E] font-['Space_Mono',monospace]">
                      · "{searchQuery}" ({filteredUsers.length} found)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
                  <span className="text-[0.6rem] text-[#4ECDC4] font-['Space_Mono',monospace]">Live monitoring</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 300px' : '1fr', gap: '16px' }}>
                <div>
                  <UserActivityTable
                    users={filteredUsers}
                    onSelectUser={setSelectedUser}
                    selectedId={selectedUser?.id || null}
                  />
                </div>
                {selectedUser && (
                  <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} />
                )}
              </div>
            </div>

            <AdminRightWidgets stats={stats} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}