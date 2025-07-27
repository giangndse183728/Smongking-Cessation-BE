import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserEntity {
  @Exclude()
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  avatar: string;

  @Expose()
  phone_number: string;

  @Expose()
  role: string;

  @Expose()
  @Type(() => Date)
  dob?: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
