'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { StatCards } from '@/components/dashboard/StatCards';
import { GamePills } from '@/components/dashboard/GamePills';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { RightWidgets } from '@/components/dashboard/RightWidgets';
import { reportsData, GameFilter, TypeFilter, gameAccentMap } from '@/utils';

// Tipe yang sesuai dengan data di constants.ts
interface ReportItem {
  title: string;
  type: string;
  game: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  version: string;
}

export default function DashboardClient() {
  const [activeFilter, setActiveFilter] = useState<TypeFilter>('all');
  const [activeGame, setActiveGame] = useState<GameFilter>('all');

  // Hapus tipe parameter, biarkan TypeScript infer secara otomatis
  const filteredReports = reportsData.filter((r) => {
    const matchGame = activeGame === 'all' || r.game === activeGame;
    const matchType = activeFilter === 'all' || r.type === activeFilter;
    return matchGame && matchType;
  });

  const handleGameNav = (game: GameFilter) => {
    setActiveGame(game);
    setActiveFilter('all');
  };

  const accentColor = gameAccentMap[activeGame];

  return (
    <div
      className="flex min-h-screen overflow-x-hidden"
      style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}
    >
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)`,
      }} />

      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
        <Topbar activeGame={activeGame} />

        <div style={{ padding: '32px', flex: 1 }}>
          <StatCards />
          <GamePills activeGame={activeGame} onGameChange={handleGameNav} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '24px',
          }}>
            <ReportsSection
              filteredReports={filteredReports}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
            <RightWidgets accentColor={accentColor} />
          </div>
        </div>
      </main>
    </div>
  );
}