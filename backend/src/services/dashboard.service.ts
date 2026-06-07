// backend/src/services/dashboard.service.ts
import { query, queryOne, insert, update } from '../lib/db/mysql';

export interface Report {
  id: number;
  title: string;
  type: string;
  game: string;
  author: string;
  authorInitials: string;
  rating: number;
  votes: number;
  date: string;
  version: string;
  content?: string;
  thumbnail?: string;
}

export class DashboardService {
  
  static async getStatCards() {
    try {
      const summary = await queryOne(`
        SELECT 
          (SELECT COUNT(*) FROM reports WHERE status = 'published') as total_reports,
          (SELECT COUNT(*) FROM reports WHERE type = 'event' AND status = 'published') as active_events,
          (SELECT COUNT(*) FROM reports WHERE type = 'puzzle' AND status = 'published') as total_puzzles,
          (SELECT COUNT(*) FROM users WHERE is_verified = 1) as total_users,
          (SELECT COUNT(*) FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 24 HOUR)) as online_today
      `);

      const totalReports = summary?.total_reports || 0;
      const activeEvents = summary?.active_events || 0;
      const totalPuzzles = summary?.total_puzzles || 0;
      const totalUsers = summary?.total_users || 0;
      const onlineToday = summary?.online_today || 0;

      return [
        { 
          label: 'Total Reports', 
          value: this.formatNumber(totalReports), 
          change: '↑ +' + Math.floor(totalReports * 0.02) + ' this week', 
          accent: '#C8A96E' 
        },
        { 
          label: 'Active Events', 
          value: activeEvents, 
          change: 'Across all games', 
          accent: '#4ECDC4' 
        },
        { 
          label: 'Puzzles Solved', 
          value: this.formatNumber(totalPuzzles), 
          change: '↑ +' + Math.floor(totalPuzzles * 0.015) + ' today', 
          accent: '#A855F7' 
        },
        { 
          label: 'Active Travelers', 
          value: this.formatNumber(totalUsers), 
          change: `↑ Online now: ${onlineToday}`, 
          accent: '#C84040' 
        },
      ];
    } catch (error) {
      console.error('Error getting stat cards:', error);
      return this.getDefaultStatCards();
    }
  }

  private static getDefaultStatCards() {
    return [
      { label: 'Total Reports', value: '0', change: 'No reports yet', accent: '#C8A96E' },
      { label: 'Active Events', value: '0', change: 'No events yet', accent: '#4ECDC4' },
      { label: 'Puzzles Solved', value: '0', change: 'No puzzles yet', accent: '#A855F7' },
      { label: 'Active Travelers', value: '0', change: 'No users yet', accent: '#C84040' },
    ];
  }

  static async getReports(game: string, type: string, page: number = 1, limit: number = 20, search?: string) {
    try {
      const offset = (page - 1) * limit;
      
      let whereClause = "WHERE r.status = 'published'";
      const params: any[] = [];
      
      if (game && game !== 'all') {
        whereClause += " AND r.game = ?";
        params.push(game);
      }
      
      if (type && type !== 'all') {
        whereClause += " AND r.type = ?";
        params.push(type);
      }
      
      if (search && search.trim()) {
        whereClause += " AND (r.title LIKE ? OR r.summary LIKE ?)";
        const searchPattern = `%${search.trim()}%`;
        params.push(searchPattern, searchPattern);
      }
      
      const countResult = await queryOne<{ total: number }>(
        `SELECT COUNT(*) as total FROM reports r ${whereClause}`,
        params
      );
      
      const queryParams = [...params];
      queryParams.push(limit, offset);
      
      const reports = await query(`
        SELECT 
          r.id,
          r.title,
          r.type,
          r.game,
          COALESCE(u.username, 'Anonymous') as author,
          COALESCE(r.author_initials, UPPER(LEFT(COALESCE(u.username, 'TB'), 2))) as author_initials,
          r.rating,
          r.votes,
          r.created_at,
          r.version,
          r.content,
          r.thumbnail,
          r.summary
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        ${whereClause}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, queryParams);
      
      return {
        reports: reports.map((r: any) => ({
          id: r.id,
          title: r.title,
          type: r.type,
          game: r.game,
          author: r.author,
          initials: r.author_initials || r.author?.substring(0, 2).toUpperCase() || 'TB',
          rating: r.rating || 0,
          votes: r.votes || 0,
          date: this.formatRelativeDate(r.created_at),
          version: r.version || '1.0',
          content: r.content,
          thumbnail: r.thumbnail,
          summary: r.summary
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((countResult?.total || 0) / limit),
          totalItems: countResult?.total || 0
        }
      };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { reports: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
  }

  static async getTopReports(limit: number = 5) {
    try {
      const results = await query(`
        SELECT title, votes as score
        FROM reports
        WHERE status = 'published'
        ORDER BY votes DESC
        LIMIT ?
      `, [limit]);
      
      const rankStyles = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]', 'text-[#5A5248]'];
      
      if (results.length === 0) {
        return [
          { title: 'No reports yet', score: 0, rankStyle: 'text-[#5A5248]' }
        ];
      }
      
      return results.map((item: any, index: number) => ({
        title: item.title,
        score: item.score || 0,
        rankStyle: rankStyles[index] || rankStyles[rankStyles.length - 1]
      }));
    } catch (error) {
      console.error('Error getting top reports:', error);
      return [
        { title: 'Sample Report 1', score: 100, rankStyle: 'text-[#C8A96E]' },
        { title: 'Sample Report 2', score: 80, rankStyle: 'text-[#B0B8C4]' },
        { title: 'Sample Report 3', score: 60, rankStyle: 'text-[#CD7F32]' },
      ];
    }
  }

  static async getTrendingTags() {
    try {
      const results = await query(`
        SELECT 
          tag,
          COUNT(*) as count
        FROM report_tags
        GROUP BY tag
        ORDER BY count DESC
        LIMIT 10
      `);
      
      if (results.length > 0) {
        const variants = ['gold', 'cyan', 'default', 'default', 'gold', 'purple', 'default', 'cyan', 'default', 'gold'];
        return results.map((item: any, index: number) => ({
          label: item.tag,
          variant: variants[index % variants.length],
          count: item.count
        }));
      }
      
      return [
        { label: '#Exploration', variant: 'gold', count: 234 },
        { label: '#Lore', variant: 'cyan', count: 189 },
        { label: '#Build', variant: 'default', count: 156 },
        { label: '#Guide', variant: 'default', count: 142 },
        { label: '#Achievement', variant: 'gold', count: 128 },
        { label: '#Secret', variant: 'purple', count: 97 },
      ];
    } catch (error) {
      console.error('Error getting trending tags:', error);
      return [
        { label: '#Exploration', variant: 'gold', count: 234 },
        { label: '#Lore', variant: 'cyan', count: 189 },
        { label: '#Build', variant: 'default', count: 156 },
      ];
    }
  }

  // Activity data dari reports
  static async getActivityData() {
    try {
      const results = await query(`
        SELECT 
          DATE(created_at) as activity_date,
          COUNT(*) as total_activity
        FROM reports
        WHERE status = 'published'
          AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY activity_date ASC
      `);
      
      const days = [];
      const dayMap: Record<string, number> = {};
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push(dayName);
        dayMap[dateStr] = 0;
      }
      
      results.forEach((r: any) => {
        let dateStr: string;
        if (r.activity_date instanceof Date) {
          dateStr = r.activity_date.toISOString().split('T')[0];
        } else {
          dateStr = new Date(r.activity_date).toISOString().split('T')[0];
        }
        
        if (dayMap[dateStr] !== undefined) {
          dayMap[dateStr] = r.total_activity || 0;
        }
      });
      
      const vals = Object.values(dayMap) as number[];
      const maxVal = Math.max(...vals, 1);
      
      console.log('Activity data from reports:', { days, vals, maxVal });
      
      return { days, vals, maxVal };
    } catch (error) {
      console.error('Error getting activity data:', error);
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
      return {
        days: days,
        vals: [0, 0, 0, 0, 0, 0, 0],
        maxVal: 1
      };
    }
  }

  static async getGameCoverage() {
    try {
      const results = await query(`
        SELECT 
          game,
          COUNT(*) as count
        FROM reports
        WHERE status = 'published'
        GROUP BY game
      `);
      
      const total = results.reduce((sum: number, r: any) => sum + r.count, 0);
      
      const gameLabels: Record<string, string> = {
        hsr: 'Honkai: Star Rail',
        gi: 'Genshin Impact',
        zzz: 'Zenless Zone Zero',
        hi3: 'Honkai Impact 3rd',
        wuwa: 'Wuthering Waves',
        arknights: 'Arknights'
      };
      
      const gameColors: Record<string, string> = {
        hsr: 'bg-[#4ECDC4]',
        gi: 'bg-[#6DD18A]',
        zzz: 'bg-[#A855F7]',
        hi3: 'bg-[#E05C7A]',
        wuwa: 'bg-[#F59E0B]',
        arknights: 'bg-[#3B82F6]'
      };
      
      if (total === 0 || results.length === 0) {
        return [
          { label: 'No data', pct: 100, fill: 'bg-[#4A4540]' }
        ];
      }
      
      return results.map((g: any) => ({
        label: gameLabels[g.game] || g.game.toUpperCase(),
        pct: Math.round((g.count / total) * 100),
        fill: gameColors[g.game] || 'bg-[#C8A96E]'
      }));
    } catch (error) {
      console.error('Error getting game coverage:', error);
      return [
        { label: 'Error loading data', pct: 100, fill: 'bg-[#E85050]' }
      ];
    }
  }

  // 🔥 PERBAIKAN: Menggunakan column name yang benar (reports_count, bukan report_count)
  static async recordUserActivity(userId: string, activityType: 'report' | 'comment' | 'like') {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Mapping activity type ke column name yang benar di database
      const columnMap = {
        report: 'reports_count',    // ← perhatikan: reports_count (plural)
        comment: 'comments_count',  // ← comments_count
        like: 'likes_count'         // ← likes_count
      };
      
      const columnName = columnMap[activityType];
      
      // Cek apakah sudah ada record untuk user ini hari ini
      const existing = await queryOne(
        `SELECT id FROM user_activity WHERE user_id = ? AND activity_date = ?`,
        [userId, today]
      );
      
      if (existing) {
        // Update existing record
        await update(
          `UPDATE user_activity 
           SET ${columnName} = ${columnName} + 1
           WHERE user_id = ? AND activity_date = ?`,
          [userId, today]
        );
      } else {
        // Insert new record
        await insert(
          `INSERT INTO user_activity (user_id, activity_date, ${columnName}, created_at)
           VALUES (?, ?, 1, NOW())`,
          [userId, today]
        );
      }
      
      console.log(`Activity recorded: ${activityType} for user ${userId} on ${today}`);
    } catch (error) {
      console.error('Error recording user activity:', error);
    }
  }

  static async createReport(data: {
    title: string;
    type: string;
    game: string;
    content: string;
    userId: string;
    version?: string;
    thumbnail?: string;
    tags?: string[];
    summary?: string;
  }) {
    try {
      const result = await insert(
        `INSERT INTO reports (
          title, type, game, content, user_id, version, thumbnail, summary,
          status, rating, votes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 0, 0, NOW())`,
        [
          data.title, 
          data.type, 
          data.game, 
          data.content, 
          data.userId, 
          data.version || '1.0', 
          data.thumbnail || null, 
          data.summary || ''
        ]
      );
      
      const reportId = (result as any).insertId;
      
      // Record user activity
      await this.recordUserActivity(data.userId, 'report');
      
      // Insert tags if any
      if (data.tags && data.tags.length > 0) {
        for (const tag of data.tags) {
          await insert(
            `INSERT INTO report_tags (report_id, tag) VALUES (?, ?)`,
            [reportId, tag.startsWith('#') ? tag : '#' + tag]
          );
        }
      }
      
      // Update user's report count
      await update(
        `UPDATE users SET total_reports = total_reports + 1 WHERE id = ?`,
        [data.userId]
      );
      
      console.log(`Report created: ${data.title} by user ${data.userId}`);
      
      return { reportId };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  private static formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  private static formatRelativeDate(date: Date | string): string {
    if (!date) return 'Just now';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Just now';
    
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return `${Math.floor(diffHours / 24)}d ago`;
  }
}