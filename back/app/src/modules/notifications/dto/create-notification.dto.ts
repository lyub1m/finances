export class CreateNotificationDto {
  message: string;
  userId: number;
  isRead?: boolean;
}
