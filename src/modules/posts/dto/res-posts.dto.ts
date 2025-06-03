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
  achievement_id: string;

  @Expose()
  created_at: string | null;

  toJSON() {
    return {
      ...this,
    };
  }
}
