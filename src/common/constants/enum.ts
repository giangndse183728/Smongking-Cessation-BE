export enum UserRole {
  USER = 'user',
  COACH = 'coach',
  ADMIN = 'admin',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export const MEDIA_TYPE = {
  IMAGES: 'images',
  VIDEOS: 'videos',
};

export const KILOBYTE = 1024;

export const POST_TYPE = {
  HEALTH_BENEFITS: 'health_benefits',
  SUCCESS_STORIES: 'success_stories',
  TOOLS_AND_TIPS: 'tools_and_tips',
  SMOKING_DANGERS: 'smoking_dangers',
  SUPPORT_RESOURCES: 'support_resources',
  NEWS_AND_RESEARCH: 'news_and_research',
};

export const POST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UPDATING: 'UPDATING',
};

export const POST_VERIFY_STATUS = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const achievement_type = {
  ABSTINENCE_DAYS: 'abstinence_days',
  MONEY_SAVED: 'money_saved',
  HEALTH_MILESTONE: 'health_milestone',
  COMMUNITY_SUPPORT: 'community_support',
  APP_USAGE: 'app_usage',
  RELAPSE_FREE_STREAK: 'relapse_free_streak',
};
