/**
 * Single swap point for external capabilities.
 *
 * For production, provide alternate implementations and re-export here:
 *   mockAuthService          → SupabaseAuthService
 *   localProfileRepository   → SupabaseProfileRepository
 *   localMealRepository      → SupabaseMealRepository
 *   mockMealAnalysisService  → ApiMealAnalysisService (POST /api/analyze-meal)
 * No screen or hook imports the concrete classes directly.
 */
export { mockAuthService as authService } from "./auth/authService";
export { localProfileRepository as profileRepository } from "./profile/profileRepository";
export { localMealRepository as mealRepository } from "./meals/mealRepository";
export { mockMealAnalysisService as mealAnalysisService } from "./analysis/mockMealAnalysisService";
export type { AuthService } from "./auth/authService";
export type { ProfileRepository } from "./profile/profileRepository";
export type { MealRepository, MealInput } from "./meals/mealRepository";
export type { MealAnalysisService, MealAnalysis, MealAnalysisItem } from "./analysis/mealAnalysisService";
