// backend/src/controllers/report.controller.ts
import { ReportService } from '../services/report.service';

export class ReportController {
  
  // Get all reports with filters
  static async getReports({ query }: any) {
    try {
      const { 
        game = 'all', 
        type = 'all', 
        page = 1, 
        limit = 20, 
        search = '' 
      } = query;
      
      const result = await ReportService.getReports(
        game, 
        type, 
        parseInt(page), 
        parseInt(limit),
        search
      );
      
      return { success: true, ...result };
    } catch (error) {
      console.error('Controller error getReports:', error);
      return { 
        success: false, 
        error: 'Failed to get reports', 
        reports: [], 
        pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } 
      };
    }
  }

  // Get single report by ID
  static async getReportById({ params }: any) {
    try {
      const { id } = params;
      const report = await ReportService.getReportById(id);
      
      if (!report) {
        return { success: false, error: 'Report not found' };
      }
      
      return { success: true, report };
    } catch (error) {
      console.error('Controller error getReportById:', error);
      return { success: false, error: 'Failed to get report' };
    }
  }

  // Create new report
  static async createReport({ body }: any) {
    try {
      const { 
        title, 
        type, 
        game, 
        content, 
        userId, 
        version, 
        thumbnail, 
        tags, 
        summary 
      } = body;
      
      if (!title || !type || !game || !content || !userId) {
        return { success: false, error: 'Missing required fields' };
      }
      
      const result = await ReportService.createReport({
        title, 
        type, 
        game, 
        content, 
        userId, 
        version, 
        thumbnail, 
        tags,
        summary
      });
      
      return { success: true, reportId: result.reportId };
    } catch (error) {
      console.error('Controller error createReport:', error);
      return { success: false, error: 'Failed to create report' };
    }
  }

  // Increment report views
  static async incrementReportViews({ params }: any) {
    try {
      const { id } = params;
      await ReportService.incrementReportViews(id);
      return { success: true };
    } catch (error) {
      console.error('Controller error incrementReportViews:', error);
      return { success: false };
    }
  }

  // Like report
  static async likeReport({ params }: any) {
    try {
      const { id } = params;
      await ReportService.incrementReportLikes(id);
      return { success: true };
    } catch (error) {
      console.error('Controller error likeReport:', error);
      return { success: false };
    }
  }

  // Delete report
  static async deleteReport({ params, body }: any) {
    try {
      const { id } = params;
      const { userId } = body;
      
      if (!userId) {
        return { success: false, error: 'Unauthorized - User ID required' };
      }
      
      const result = await ReportService.deleteReport(id, userId);
      return result;
    } catch (error) {
      console.error('Controller error deleteReport:', error);
      return { success: false, error: 'Failed to delete report' };
    }
  }

  // Get top reports
  static async getTopReports() {
    try {
      const topReports = await ReportService.getTopReports(5);
      return { success: true, data: topReports };
    } catch (error) {
      console.error('Controller error getTopReports:', error);
      return { success: false, error: 'Failed to get top reports', data: [] };
    }
  }

  // Get trending tags
  static async getTrendingTags() {
    try {
      const tags = await ReportService.getTrendingTags();
      return { success: true, data: tags };
    } catch (error) {
      console.error('Controller error getTrendingTags:', error);
      return { success: false, error: 'Failed to get trending tags', data: [] };
    }
  }

  // Get activity data
  static async getActivityData() {
    try {
      const activity = await ReportService.getActivityData();
      return { success: true, data: activity };
    } catch (error) {
      console.error('Controller error getActivityData:', error);
      return { success: false, error: 'Failed to get activity data', data: { days: [], vals: [], maxVal: 0 } };
    }
  }

  // Get game coverage
  static async getGameCoverage() {
    try {
      const coverage = await ReportService.getGameCoverage();
      return { success: true, data: coverage };
    } catch (error) {
      console.error('Controller error getGameCoverage:', error);
      return { success: false, error: 'Failed to get game coverage', data: [] };
    }
  }

  // Get stats
  static async getStats() {
    try {
      const stats = await ReportService.getStatCards();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Controller error getStats:', error);
      return { success: false, error: 'Failed to get stats', data: [] };
    }
  }
}