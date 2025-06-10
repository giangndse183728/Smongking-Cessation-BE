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
  ACHIEVEMENT_IS_INVALID: 'Achievement id invalid.',
  POST_ID_IS_INVALID: 'Post id is invalid.',
  POST_ID_IS_REQUIRED: 'Post id is required.',
};

export const QUIT_PLAN_MESSAGES = {
  ACTIVE_PLAN_EXISTS: 'You already have an active quit plan. Please complete or delete your current plan before starting a new one.',
  SMOKING_HABITS_REQUIRED: 'Please complete your smoking habits profile first',
  FAILED_TO_GENERATE_PHASES: 'Failed to generate quit plan phases',
  FAILED_TO_CREATE_PLAN: 'Failed to create quit plan with AI assistance',
  FAILED_TO_CREATE_RECORD: 'Failed to create quit plan record',
  FAILED_TO_RETRIEVE_PLAN: 'Failed to retrieve quit plan',
  FAILED_TO_RETRIEVE_RECORDS: 'Failed to retrieve quit plan records',
  FAILED_TO_DELETE_PLAN: 'Failed to delete quit plan',
  PLAN_NOT_FOUND: 'Quit plan not found',
  FAILED_TO_UPDATE_PHASE_STATUSES: 'Failed to update phase statuses',
} as const;
