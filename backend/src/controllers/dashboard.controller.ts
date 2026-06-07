// backend/src/controllers/dashboard.controller.ts
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  
  static async getStats() {
    try {
      const stats = await DashboardService.getStatCards();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Controller error getStats:', error);
      return { success: false, error: 'Failed to get stats', data: [] };
    }
  }

  // 🔥 DIPERBAIKI: Menambahkan parameter search
  static async getReports({ query }: any) {
    try {
      const { game = 'all', type = 'all', page = 1, limit = 20, search = '' } = query;
      const result = await DashboardService.getReports(
        game, 
        type, 
        parseInt(page), 
        parseInt(limit),
        search
      );
      return { success: true, ...result };
    } catch (error) {
      console.error('Controller error getReports:', error);
      return { success: false, error: 'Failed to get reports', reports: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
    }
  }

  static async getTopReports() {
    try {
      const topReports = await DashboardService.getTopReports(5);
      return { success: true, data: topReports };
    } catch (error) {
      console.error('Controller error getTopReports:', error);
      return { success: false, error: 'Failed to get top reports', data: [] };
    }
  }

  static async getTrendingTags() {
    try {
      const tags = await DashboardService.getTrendingTags();
      return { success: true, data: tags };
    } catch (error) {
      console.error('Controller error getTrendingTags:', error);
      return { success: false, error: 'Failed to get trending tags', data: [] };
    }
  }

  static async getActivityData() {
    try {
      const activity = await DashboardService.getActivityData();
      return { success: true, data: activity };
    } catch (error) {
      console.error('Controller error getActivityData:', error);
      return { success: false, error: 'Failed to get activity data', data: { days: [], vals: [], maxVal: 0 } };
    }
  }

  static async getGameCoverage() {
    try {
      const coverage = await DashboardService.getGameCoverage();
      return { success: true, data: coverage };
    } catch (error) {
      console.error('Controller error getGameCoverage:', error);
      return { success: false, error: 'Failed to get game coverage', data: [] };
    }
  }

  static async createReport({ body }: any) {
    try {
      const { title, type, game, content, userId, version, thumbnail, tags } = body;
      
      if (!title || !type || !game || !content || !userId) {
        return { success: false, error: 'Missing required fields' };
      }
      
      const result = await DashboardService.createReport({
        title, 
        type, 
        game, 
        content, 
        userId, 
        version, 
        thumbnail, 
        tags
      });
      
      return { success: true, reportId: result.reportId };
    } catch (error) {
      console.error('Controller error createReport:', error);
      return { success: false, error: 'Failed to create report' };
    }
  }
}