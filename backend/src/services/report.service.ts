// backend/src/services/report.service.ts
import { query, queryOne, insert, update } from '../lib/db/mysql';

export class ReportService {
  
  // Get stat cards data
  static async getStatCards() {
    try {
      const totalReports = await queryOne<{ count: number }>(`
        SELECT COUNT(*) as count FROM reports WHERE status = 'published'
      `);
      
      const activeEvents = await queryOne<{ count: number }>(`
        SELECT COUNT(*) as count FROM reports 
        WHERE type = 'event' AND status = 'published'
      `);
      
      const totalPuzzles = await queryOne<{ count: number }>(`
        SELECT COUNT(*) as count FROM reports 
        WHERE type = 'puzzle' AND status = 'published'
      `);
      
      const totalUsers = await queryOne<{ count: number }>(`
        SELECT COUNT(*) as count FROM users
      `);
      
      const onlineToday = await queryOne<{ count: number }>(`
        SELECT COUNT(*) as count FROM users 
        WHERE last_login > DATE_SUB(NOW(), INTERVAL 24 HOUR)
      `);
      
      return [
        { 
          label: 'Total Reports', 
          value: (totalReports?.count || 0).toString(), 
          change: '↑ +0 this week', 
          accent: '#C8A96E' 
        },
        { 
          label: 'Active Events', 
          value: (activeEvents?.count || 0).toString(), 
          change: 'Across all games', 
          accent: '#4ECDC4' 
        },
        { 
          label: 'Puzzles Solved', 
          value: (totalPuzzles?.count || 0).toString(), 
          change: '↑ +0 today', 
          accent: '#A855F7' 
        },
        { 
          label: 'Active Travelers', 
          value: (totalUsers?.count || 0).toString(), 
          change: `Online: ${onlineToday?.count || 0}`, 
          accent: '#C84040' 
        },
      ];
    } catch (error) {
      console.error('Error getting stat cards:', error);
      return [
        { label: 'Total Reports', value: '0', change: 'No reports yet', accent: '#C8A96E' },
        { label: 'Active Events', value: '0', change: 'No events yet', accent: '#4ECDC4' },
        { label: 'Puzzles Solved', value: '0', change: 'No puzzles yet', accent: '#A855F7' },
        { label: 'Active Travelers', value: '0', change: 'No users yet', accent: '#C84040' },
      ];
    }
  }

  // Get all reports with pagination and filters
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
      
      // Get total count
      const countResult = await queryOne<{ total: number }>(
        `SELECT COUNT(*) as total FROM reports r ${whereClause}`,
        params
      );
      
      // Get paginated reports
      const queryParams = [...params];
      queryParams.push(limit, offset);
      
      const reports = await query(`
        SELECT 
          r.id,
          r.title,
          r.type,
          r.game,
          r.content,
          r.severity,
          r.status,
          r.version,
          r.user_id as userId,
          r.created_at as createdAt,
          r.updated_at as updatedAt,
          r.views,
          r.votes,
          r.thumbnail,
          r.summary,
          COALESCE(u.username, 'Anonymous') as author,
          COALESCE(u.initials, UPPER(LEFT(COALESCE(u.username, 'TB'), 2))) as authorInitials
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        ${whereClause}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, queryParams);
      
      const formattedReports = reports.map((r: any) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        game: r.game,
        content: r.content,
        severity: r.severity,
        status: r.status,
        version: r.version,
        userId: r.userId,
        author: r.author,
        authorInitials: r.authorInitials,
        views: r.views || 0,
        votes: r.votes || 0,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        thumbnail: r.thumbnail,
        summary: r.summary,
        date: this.formatRelativeDate(r.createdAt)
      }));
      
      return {
        reports: formattedReports,
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

  // Get single report by ID
  static async getReportById(reportId: string | number) {
    try {
      const report = await queryOne(`
        SELECT 
          r.id,
          r.title,
          r.type,
          r.game,
          r.content,
          r.severity,
          r.status,
          r.version,
          r.user_id as userId,
          r.created_at as createdAt,
          r.updated_at as updatedAt,
          r.views,
          r.votes,
          r.thumbnail,
          r.summary,
          COALESCE(u.username, 'Anonymous') as author,
          COALESCE(u.initials, UPPER(LEFT(COALESCE(u.username, 'TB'), 2))) as authorInitials
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = ? AND r.status = 'published'
      `, [reportId]);
      
      if (!report) return null;
      
      // Get tags for this report
      const tags = await query(
        `SELECT tag FROM report_tags WHERE report_id = ?`,
        [reportId]
      );
      
      return {
        id: report.id,
        title: report.title,
        type: report.type,
        game: report.game,
        content: report.content,
        severity: report.severity,
        status: report.status,
        version: report.version,
        userId: report.userId,
        author: report.author,
        authorInitials: report.authorInitials,
        views: report.views || 0,
        votes: report.votes || 0,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        thumbnail: report.thumbnail,
        summary: report.summary,
        tags: tags.map((t: any) => t.tag)
      };
    } catch (error) {
      console.error('Error getting report by id:', error);
      return null;
    }
  }

  // Create new report
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
          status, rating, votes, views, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 0, 0, 0, NOW(), NOW())`,
        [
          data.title, 
          data.type, 
          data.game, 
          data.content, 
          data.userId, 
          data.version || '1.0', 
          data.thumbnail || null, 
          data.summary || data.title.slice(0, 100)
        ]
      );
      
      const reportId = (result as any).insertId;
      
      // Insert tags if any
      if (data.tags && data.tags.length > 0) {
        for (const tag of data.tags) {
          await insert(
            `INSERT INTO report_tags (report_id, tag) VALUES (?, ?)`,
            [reportId, tag.startsWith('#') ? tag : '#' + tag]
          );
        }
      }
      
      // Update user's total reports count
      await update(
        `UPDATE users SET total_reports = COALESCE(total_reports, 0) + 1 WHERE id = ?`,
        [data.userId]
      );
      
      return { reportId };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  // Delete report
  static async deleteReport(reportId: string | number, userId: string) {
    try {
      const report = await queryOne(
        `SELECT user_id FROM reports WHERE id = ?`,
        [reportId]
      );
      
      if (!report) {
        return { success: false, error: 'Report not found' };
      }
      
      const user = await queryOne(
        `SELECT role FROM users WHERE id = ?`,
        [userId]
      );
      
      const isAdmin = user?.role === 'admin';
      const isOwner = report.user_id === userId;
      
      if (!isOwner && !isAdmin) {
        return { success: false, error: 'Unauthorized' };
      }
      
      // Delete tags first
      await update(`DELETE FROM report_tags WHERE report_id = ?`, [reportId]);
      
      // Delete report
      await update(`DELETE FROM reports WHERE id = ?`, [reportId]);
      
      // Update user's total reports count if owner
      if (isOwner) {
        await update(
          `UPDATE users SET total_reports = total_reports - 1 WHERE id = ?`,
          [userId]
        );
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting report:', error);
      return { success: false, error: 'Failed to delete report' };
    }
  }

  // Increment report views
  static async incrementReportViews(reportId: string | number) {
    try {
      await update(
        `UPDATE reports SET views = COALESCE(views, 0) + 1 WHERE id = ?`,
        [reportId]
      );
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // Increment report likes/votes
  static async incrementReportLikes(reportId: string | number) {
    try {
      await update(
        `UPDATE reports SET votes = COALESCE(votes, 0) + 1 WHERE id = ?`,
        [reportId]
      );
    } catch (error) {
      console.error('Error incrementing likes:', error);
    }
  }

  // Get top 5 reports by votes
  static async getTopReports(limit: number = 5) {
    try {
      const results = await query(`
        SELECT 
          r.id, 
          r.title, 
          r.votes as score,
          COALESCE(u.username, 'Anonymous') as author
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.status = 'published'
        ORDER BY r.votes DESC
        LIMIT ?
      `, [limit]);
      
      const rankStyles = ['text-[#C8A96E]', 'text-[#B0B8C4]', 'text-[#CD7F32]', 'text-[#5A5248]', 'text-[#5A5248]'];
      
      if (results.length === 0) {
        return [
          { id: 0, title: 'No reports yet', score: 0, author: '—', rankStyle: 'text-[#5A5248]' }
        ];
      }
      
      return results.map((item: any, index: number) => ({
        id: item.id,
        title: item.title,
        score: item.score || 0,
        author: item.author,
        rankStyle: rankStyles[index] || rankStyles[rankStyles.length - 1]
      }));
    } catch (error) {
      console.error('Error getting top reports:', error);
      return [];
    }
  }

  // Get trending tags
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

  // Get activity data for chart
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

  // Get game coverage data
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
      
      const total = results.reduce((sum: number, r: any) => sum + (r.count || 0), 0);
      
      const gameLabels: Record<string, string> = {
        hsr: 'Honkai: Star Rail',
        gi: 'Genshin Impact',
        zzz: 'Zenless Zone Zero',
        hi3: 'Honkai Impact 3rd'
      };
      
      const gameColors: Record<string, string> = {
        hsr: 'bg-[#4ECDC4]',
        gi: 'bg-[#6DD18A]',
        zzz: 'bg-[#A855F7]',
        hi3: 'bg-[#E05C7A]'
      };
      
      if (results.length === 0 || total === 0) {
        return [
          { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
          { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
          { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
          { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
        ];
      }
      
      return results.map((g: any) => ({
        label: gameLabels[g.game] || g.game.toUpperCase(),
        pct: Math.round((Number(g.count) / total) * 100),
        fill: gameColors[g.game] || 'bg-[#C8A96E]'
      }));
    } catch (error) {
      console.error('Error getting game coverage:', error);
      return [
        { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
        { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
        { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
        { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
      ];
    }
  }

  // Helper: Format relative date
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