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
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  UPDATING: 'updating',
};
