import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class PostResponseDto {
  @Expose()
  user_id: string;

  @Expose()
  type: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  thumbnail: string;

  @Expose()
  health_issues: string;

  @Expose()
  ai_feedback: string | null;

  @Expose()
  created_at: string | null;

  toJSON() {
    return {
      ...this,
    };
  }
}
