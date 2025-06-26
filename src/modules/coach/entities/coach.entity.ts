import { Exclude, Expose, Type } from 'class-transformer';
import { UserEntity } from '../../users/entities/users.entity';

@Exclude()
export class CoachEntity {
  @Expose()
  id: string;

  @Expose()
  user_id: string;

  @Expose()
  specialization?: string;

  @Expose()
  experience_years?: number;

  @Expose()
  bio?: string;

  @Expose()
  working_hours?: string;

  @Expose()
  is_active?: boolean;

  @Expose()
  @Type(() => UserEntity)
  users?: UserEntity;

  constructor(partial: any) {
    Object.assign(this, partial);
    
    this.specialization = partial.specialization ?? undefined;
    this.experience_years = partial.experience_years ?? undefined;
    this.bio = partial.bio ?? undefined;
    this.working_hours = partial.working_hours ?? undefined;
    this.is_active = partial.is_active ?? undefined;

    if (partial.users) {
      this.users = new UserEntity(partial.users);
    } else {
      this.users = undefined;
    }
  }
}
