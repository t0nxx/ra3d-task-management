import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

enum status {
  open = 'open',
  inProgress = 'inProgress',
  closed = 'closed',
}
enum priority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(status)
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(priority)
  priority: string;

  @IsNotEmpty()
  dueDate: Date;

  @IsOptional()
  @IsUUID()
  assignedUserId?: string;
}
