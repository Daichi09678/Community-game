import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  
  static async getStats() {
    const stats = await DashboardService.getStatCards();
    return { success: true, data: stats };
  }

  static async getReports({ query }: any) {
    const { game = 'all', type = 'all', page = 1, limit = 20 } = query;
    const result = await DashboardService.getReports(game, type, parseInt(page), parseInt(limit));
    return { success: true, ...result };
  }

  static async getTopReports() {
    const topReports = await DashboardService.getTopReports(5);
    return { success: true, data: topReports };
  }

  static async getTrendingTags() {
    const tags = await DashboardService.getTrendingTags();
    return { success: true, data: tags };
  }

  static async getActivityData() {
    const activity = await DashboardService.getActivityData();
    return { success: true, data: activity };
  }

  static async getGameCoverage() {
    const coverage = await DashboardService.getGameCoverage();
    return { success: true, data: coverage };
  }
}