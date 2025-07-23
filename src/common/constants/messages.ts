export const AUTH_MESSAGES = {
  USERNAME_IS_REQUIRED: 'Username is required.',
  USERNAME_MUST_BE_STRING: 'Username must be a string.',
  USERNAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS:
    'Username must be between 3 and 50 characters.',
  EMAIL_IS_REQUIRED: 'Email is required.',
  INVALID_EMAIL_FORMAT: 'Invalid email format.',
  PASSWORD_IS_REQUIRED: 'Password is required.',
  PASSWORD_MUST_BE_STRING: 'Password must be string.',
  PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS:
    'Password must be at least 6 characters.',
  FIRST_NAME_IS_REQUIRED: 'First name is required.',
  FIRST_NAME_MUST_BE_STRING: 'First name must be string.',
  FIRST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS:
    'First name must be between 3 and 50 characters.',
  LAST_NAME_IS_REQUIRED: 'Last name is required.',
  LAST_NAME_MUST_BE_STRING: 'Last name must be string.',
  LAST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS:
    'Last name must be between 3 and 50 characters.',
  BIRTH_DATE_MUST_BE_VALID_FORMAT:
    'Birth date must be a valid date in YYYY-MM-DD format.',
  PHONE_NUMBER_IS_REQUIRED: 'Phone number is required.',
  PHONE_NUMBER_MUST_BE_STRING: 'Phone number must be string.',
  INVALID_PHONE_NUMBER_FORMAT: 'Invalid Vietnamese phone number format.',
  USER_NOT_FOUND: 'User not found.',
  RESET_TOKEN_IS_REQUIRED: 'Reset token is required.',
  RESET_TOKEN_IS_INVALID: 'Reset token is invalid.',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required.',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be string.',
  CONFIRM_PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS:
    'Confirm password must be at least 6 characters.',
  INVALID_OR_EXPIRED_RESET_TOKEN: 'Invalid or expired reset token.',
  PASSWORD_RESET_SUCCESSFULLY: 'Password reset successfully.',
  CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD:
    'Confirm password does not match password.',
};

export const MOTIVATION_MESSAGES = {
  MESSAGE_IS_REQUIRED: 'Message is required.',
  MESSAGE_MUST_BE_STRING: 'Message must be a string.',
  MESSAGE_CANNOT_BE_EMPTY: 'Message cannot be empty.',
  MESSAGE_TOO_LONG: 'Message is too long. Maximum length is 500 characters.',
  FAILED_TO_GENERATE_MESSAGE: 'Failed to generate motivational message.',
  FAILED_TO_UPDATE_MESSAGE: 'Failed to update motivational message.',
  FAILED_TO_RETRIEVE_MESSAGE: 'Failed to retrieve motivational message.',
  NO_MESSAGE_FOUND: 'No motivational message found.',
  FALLBACK_MESSAGE: 'Stay strong! You can quit smoking.',
  CHAT_RESPONSE_ERROR:
    'I apologize, but I am having trouble responding right now. Please try again later.',
};

export const MEDIA_MESSAGES = {
  INVALID_FILE_TYPE: 'Invalid file format.',
  IMAGES_NOT_EMPTY: 'Images are required.',
  UPLOAD_IMAGES_SUCCESSFULLY: 'Images uploaded successfully.',
} as const;

export const USERS_MESSAGES = {
  USERNAME_MUST_BE_STRING: 'Username must be a string.',
  USERNAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS:
    'Username must be between 3 and 50 characters.',
  EMAIL_IS_REQUIRED: 'Email is required.',
  INVALID_EMAIL_FORMAT: 'Invalid email format.',
  PASSWORD_IS_REQUIRED: 'Password is required.',
  PASSWORD_MUST_BE_STRING: 'Password must be string.',
  PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS:
    'Password must be at least 6 characters',
  FIRST_NAME_IS_REQUIRED: 'First name is required.',
  FIRST_NAME_MUST_BE_STRING: 'First name must be string.',
  FIRST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS:
    'First name must be between 3 and 50 characters.',
  LAST_NAME_IS_REQUIRED: 'Last name is required.',
  LAST_NAME_MUST_BE_STRING: 'Last name must be string.',
  LAST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS:
    'Last name must be between 3 and 50 characters.',
  BIRTH_DATE_MUST_BE_VALID_FORMAT:
    'Birth date must be a valid date in YYYY-MM-DD format.',
  PHONE_NUMBER_IS_REQUIRED: 'Phone number is required.',
  PHONE_NUMBER_MUST_BE_STRING: 'Phone number must be string.',
  INVALID_PHONE_NUMBER_FORMAT: 'Invalid Vietnamese phone number format.',
  AVATAR_IS_INVALID_URL: 'Invalid avatar url.',
  USER_ID_IS_REQUIRED: 'User id is required.',
  USER_ID_IS_INVALID: 'User id is invalid.',
};

export const POSTS_MESSAGES = {
  USER_ID_IS_INVALID: 'User id is invalid.',
  USER_ID_IS_REQUIRED: 'User id is required.',
  TYPE_IS_REQUIRED: 'Post type is required.',
  TYPE_IS_INVALID: 'Post type is invalid.',
  TITLE_IS_REQUIRED: 'Post title is required.',
  TITLE_MUST_BE_STRING: 'Post title must be string.',
  TITLE_MUST_BE_BETWEEN_5_50_CHARACTERS:
    'Post title must be between 5 and 50 characters.',
  CONTENT_IS_REQUIRED: 'Content is required.',
  CONTENT_MUST_BE_STRING: 'Content must be string.',
  THUMBNAIL_IS_REQUIRED: 'Thumbnail is required.',
  THUMBNAIL_IS_INVALID_URL: 'Invalid thumbnail url.',
  USER_ACHIEVEMENT_IS_INVALID: 'User achievement id invalid.',
  POST_ID_IS_INVALID: 'Post id is invalid.',
  POST_ID_IS_REQUIRED: 'Post id is required.',
  USER_NOT_ALLOWED: 'User not allowed.',
  POST_NOT_FOUND: 'Post not found.',
  POST_NOT_APPROVED:
    'This post has not been approved yet and cannot be updated.',
  STATUS_IS_INVALID: 'Status is invalid.',
  STATUS_IS_REQUIRED: 'Status is required.',
  REASON_IS_REQUIRED_WHEN_REJECTED: 'Reason is required when rejection.',
};

export const QUIT_PLAN_MESSAGES = {
  ACTIVE_PLAN_EXISTS:
    'You already have an active quit plan. Please complete or delete your current plan before starting a new one.',
  SMOKING_HABITS_REQUIRED: 'Please complete your smoking habits profile first',
  FAILED_TO_GENERATE_PHASES: 'Failed to generate quit plan phases',
  FAILED_TO_CREATE_PLAN: 'Failed to create quit plan with AI assistance',
  FAILED_TO_CREATE_RECORD: 'Failed to create quit plan record',
  FAILED_TO_RETRIEVE_PLAN: 'Failed to retrieve quit plan',
  FAILED_TO_RETRIEVE_RECORDS: 'Failed to retrieve quit plan records',
  FAILED_TO_DELETE_PLAN: 'Failed to delete quit plan',
  PLAN_NOT_FOUND: 'Quit plan not found',
  FAILED_TO_UPDATE_PHASE_STATUSES: 'Failed to update phase statuses',
  FAILED_TO_RETRIEVE_PLANS: 'Failed to retrieve quit plans',
} as const;

export const QUIT_PLAN__RECORD_MESSAGES = {
  RECORD_DATE_MUST_BE_VALID_FORMAT: 'Record date must be valid format.',
  RECORD_DATE_IS_REQUIRED: 'Record date is required.',
} as const;

export const ACHIEVEMENTS_MESSAGES = {
  ACHIEVEMENT_NAME_MUST_BE_STRING: 'Achievement name must be string.',
  ACHIEVEMENT_NAME_IS_REQUIRED: 'Achievement name is required.',
  ACHIEVEMENT_DESCRIPTION_MUST_BE_STRING:
    'Achievement description must be string.',
  ACHIEVEMENT_DESCRIPTION_IS_REQUIRED: 'Achievement description is required.',
  IMAGE_IS_INVALID_URL: 'Achievement image is invalid url.',
  ACHIEVEMENT_TYPE_MUST_BE_STRING: 'Achievement type must be string.',
  ACHIEVEMENT_TYPE_IS_REQUIRED: 'Achievement type is required.',
  ACHIEVEMENT_TYPE_INVALID: 'Achievement type is invalid.',
  THRESHOLD_IS_REQUIRED: 'Achievement threshold value is required.',
  THRESHOLD_MUST_BE_STRING: 'Achievement threshold value must be string.',
  THRESHOLD_MUST_BE_POSITIVE: 'Achievement threshold value must be positive.',
  IMAGE_IS_REQUIRED: 'Achievement image is required.',
  ACHIEVEMENT_ID_IS_REQUIRED: 'Achievement id is required.',
  ACHIEVEMENT_ID_IS_INVALID: 'Achievement id is invalid.',
  ACHIEVEMENT_NOT_FOUND: 'Achievement not found.',
  POINT_IS_REQUIRED: 'Achievement point is required.',
  POINT_IS_INVALID: 'Point must be valid positive number',
};
export const USER_ACHIEVEMENT_MESSAGE = {
  USER_ID_IS_REQUIRED: 'User id is required.',
  USER_ID_IS_INVALID: 'User id is invalid.',
  ACHIEVEMENT_ID_IS_REQUIRED: 'Achievement id is required.',
  ACHIEVEMENT_ID_IS_INVALID: 'Achievement id is invalid.',
  ACHIEVEMENT_NOT_FOUND: 'Achievement not found.',
  EARNED_DATE_IS_REQUIRED: 'Earn date is required.',
  EARNED_DATE_IS_INVALID: 'Earn date is invalid.',
  POINTS_EARNED_IS_REQUIRED: 'Points earned is required.',
  POINTS_EARNED_MUST_BE_NUMBER: 'Points earned must be number.',
};

export const SMOKING_HABITS_MESSAGES = {
  HABIT_ALREADY_EXISTS: 'User already has a smoking habit profile',
  CANNOT_CREATE_WITH_ACTIVE_PLAN:
    'Cannot create smoking habit while having an active quit plan',
  CANNOT_UPDATE_WITH_ACTIVE_PLAN:
    'Cannot update smoking habit while having an active quit plan',
  CANNOT_DELETE_WITH_ACTIVE_PLAN:
    'Cannot delete smoking habit while having an active quit plan',
  HABIT_NOT_FOUND: 'Smoking habit not found',
  USER_HABIT_NOT_FOUND: 'Smoking habit for user not found',
} as const;

export const NOTIFICATION_SCHEDULES_MESSAGES = {
  USER_ID_IS_REQUIRED: 'User id is required.',
  USER_ID_IS_INVALID: 'User id is invalid.',
  TYPE_IS_INVALID: 'Type is invalid.',
  TYPE_IS_REQUIRED: 'Type is required.',
  FREQUENCY_IS_REQUIRED: 'Frequency is required.',
  FREQUENCY_IS_INVALID: 'Frequency is invalid.',
  PREFERRED_TIME_IS_REQUIRED: 'Preferred time is required.',
  PREFERRED_TIME_IS_INVALID: 'Preferred time is invalid.',
} as const;

export const NOTIFICATION_MESSAGES = {
  TITLE_IS_REQUIRED: 'Title is required.',
  TITLE_MUST_BE_STRING: 'Title must be string.',
  CONTENT_IS_REQUIRED: 'Content is required.',
  CONTENT_MUST_BE_STRING: 'Content must be string.',
  TYPE_IS_REQUIRED: 'Type must be string.',
  TYPE_IS_INVALID: 'Type is invalid.',
} as const;

export const REACTION_MESSAGES = {
  POST_ID_IS_REQUIRED: 'Post id is required.',
  POST_ID_IS_INVALID: 'Post id is invalid.',
  POST_NOT_FOUND: 'Post not found.',
  REACTION_TYPE_IS_REQUIRED: 'Reaction type is required.',
  REACTION_TYPE_IS_INVALID: 'Reaction type is invalid.',
  REACTION_ID_IS_REQUIRED: 'Reaction id is required.',
  REACTION_ID_IS_INVALID: 'Reaction id is invalid.',
  REACTION_NOT_FOUND: 'Reaction not found.',
} as const;

export const COMMENTS_MESSAGES = {
  POST_ID_IS_REQUIRED: 'Post id is required.',
  POST_ID_IS_INVALID: 'Post id is invalid.',
  POST_NOT_FOUND: 'Post not found.',
  CONTENT_IS_REQUIRED: 'Content is required.',
  CONTENT_IS_INVALID: 'Content must be a string.',
  PARENT_COMMENT_ID_IS_REQUIRED: 'Parent comment id is required.',
  PARENT_COMENT_ID_IS_INVALID: 'Parent comment id is invalid.',
  PARENT_COMMENT_NOT_FOUND: 'Parent comment not found.',
  COMMENT_ID_IS_REQUIRED: 'Comment id is required.',
  COMMENT_ID_IS_INVALID: 'Comment id is invalid.',
  COMMENT_NOT_FOUND: 'Comment not found.',
} as const;

export const FEEDBACK_MESSAGES = {
  COACH_ID_IS_REQUIRED: 'Coach id is required.',
  COACH_ID_IS_INVALID: 'Coach id is invalid.',
  RATING_STAR_IS_REQUIRED: 'Rating star is required.',
  RATING_STAR_MUST_BE_BETWEEN_1_AND_5: 'Rating star must be between 1 and 5.',
  COMMENT_IS_STRING: 'Comment must be a string.',
  FEEDBACK_NOT_FOUND: 'Feedback not found.',
  USER_ID_IS_REQUIRED: 'User id is required.',
  USER_ID_IS_INVALID: 'User id is invalid.',
};
