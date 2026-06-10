'use client';

import Link from 'next/link';
import { clipWidget, clipBtn } from './clipStyles';
import { GameBadge } from './GameBadge';

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';

const onlineUsersData = [
  { initials: "QG", name: "QuantumGale",    game: "hsr", status: "online"  },
  { initials: "SW", name: "SilverWolf_Fan", game: "gi",  status: "online"  },
  { initials: "CA", name: "Cocolia_Arc",    game: "hsr", status: "online"  },
  { initials: "VH", name: "VoidHunter_X",   game: "gi",  status: "busy"    },
  { initials: "TK", name: "TrailBossKai",   game: "hi3", status: "online"  },
  { initials: "MS", name: "Mei_Stellaron",  game: "zzz", status: "away"    },
];

// Trending topics dengan link ke groups
const trendingTopicsData = [
  { tag: "HSR 3.2 Meta",      count: 48, game: "hsr", groupId: 1, groupName: "Star Rail Council" },
  { tag: "Natlan Lore",       count: 73, game: "gi",  groupId: 2, groupName: "Teyvat Archives" },
  { tag: "Robin Support",     count: 91, game: "hsr", groupId: 1, groupName: "Star Rail Council" },
  { tag: "ZZZ 1.4 Bangboo",   count: 35, game: "zzz", groupId: 3, groupName: "Hollow Operators" },
  { tag: "ER Season 7",       count: 29, game: "hi3", groupId: 4, groupName: "Valkyrie Order" },
];

const statusDot: Record<string, string> = {
  online: 'bg-[#6DD18A]',
  busy:   'bg-[#E05C7A]',
  away:   'bg-[#C8A96E]',
};

const gameLabels: Record<string, string> = {
  all: 'All Games', hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', zzz: 'Zenless Zone Zero', hi3: 'Honkai Impact 3rd',
};

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

export function RightWidgets({ accentColor, activeGame }: { accentColor: string; activeGame: GameFilter }) {
  const gameColorMap: Record<string, string> = {
    hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
  };

  // Filter trending topics based on activeGame
  const filteredTrending = activeGame === 'all' 
    ? trendingTopicsData 
    : trendingTopicsData.filter(t => t.game === activeGame);

  return (
    <div>
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5 relative overflow-hidden" style={clipWidget}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
        <WidgetTitle>Ikut Berdiskusi</WidgetTitle>
        <p className="text-[0.78rem] text-[#5A5248] leading-[1.6] mb-4">
          Punya teori, temuan, atau pertanyaan soal game Hoyo? Bagikan ke komunitas!
        </p>
        <Link href="/UserHoyo/create-thread">
          <button className="w-full py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:brightness-110 border-none text-[#050810]"
            style={{ background: `linear-gradient(135deg, #8B6A2E, #C8A96E)`, ...clipBtn }}>
            + Buat Thread Baru
          </button>
        </Link>
      </div>

      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>Trending Topik</WidgetTitle>
        {filteredTrending.length === 0 ? (
          <div className="text-center py-4 text-[#5A5248] text-sm">Tidak ada topik trending untuk game ini</div>
        ) : (
          filteredTrending.map((t, i) => {
            const gc = gameColorMap[t.game] ?? '#C8A96E';
            return (
              <Link key={i} href={`/UserHoyo/groups?groupId=${t.groupId}`}>
                <div className="flex items-center justify-between py-[8px] border-b border-[rgba(200,169,110,0.06)] last:border-0 cursor-pointer group/item">
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248] min-w-[18px]">#{i + 1}</span>
                    <span className="text-[0.8rem] text-[#9A8F78] group-hover/item:text-[#E8E0CC] transition-colors duration-200">{t.tag}</span>
                  </div>
                  <span className="font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]"
                    style={{ color: gc, background: `${gc}18`, clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
                    {t.count} posts
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
        <WidgetTitle>
          <span>Online Sekarang</span>
          <span className="ml-auto font-['Space_Mono',monospace] text-[0.65rem] text-[#6DD18A]">● {onlineUsersData.filter(u => u.status === 'online').length} online</span>
        </WidgetTitle>
        <div className="space-y-[8px]">
          {onlineUsersData.map((u, i) => {
            const gc = gameColorMap[u.game] ?? '#C8A96E';
            return (
              <div key={i} className="flex items-center gap-[10px] cursor-pointer group/u">
                <div className="relative shrink-0">
                  <div className="w-[30px] h-[30px] rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] font-bold"
                    style={{ background: `${gc}18`, borderColor: `${gc}60`, color: gc }}>
                    {u.initials}
                  </div>
                  <span className={`absolute -bottom-[1px] -right-[1px] w-[8px] h-[8px] rounded-full border border-[#0C1220] ${statusDot[u.status]}`} />
                </div>
                <div>
                  <div className="text-[0.78rem] text-[#9A8F78] group-hover/u:text-[#E8E0CC] transition-colors duration-200">{u.name}</div>
                  <div className="text-[0.62rem] text-[#5A5248]">{gameLabels[u.game]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <WidgetTitle>Aturan Forum</WidgetTitle>
        <ul className="space-y-2">
          {[
            'Hormati sesama Traveler & Trailblazer',
            'Gunakan tag spoiler untuk konten story',
            'Dilarang share akun / jual beli ilegal',
            'Cek thread existing sebelum post baru',
            'Sertakan versi game di judul thread',
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.75rem] text-[#5A5248] leading-[1.5]">
              <span className="text-[#C8A96E] shrink-0 mt-[1px]">▸</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}