import { Expose, Transform } from 'class-transformer';

export class NotificationSchedule {
  @Expose()
  id: string;
  @Expose()
  user_id: string;
  @Expose()
  type: string;
  @Expose()
  frequency: string | null;
  @Expose()
  is_active: boolean | null;
  @Expose()
  created_at: Date | null;
  @Expose()
  created_by: string | null;
  @Expose()
  updated_at: Date | null;
  @Expose()
  updated_by: string | null;
  @Expose()
  deleted_at: Date | null;
  @Expose()
  deleted_by: string | null;

  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;

    const date = new Date(value as Date);
    if (isNaN(date.getTime())) return null;

    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  })
  preferred_time: Date;

  constructor(partial: Partial<NotificationSchedule>) {
    Object.assign(this, partial);
  }
}
