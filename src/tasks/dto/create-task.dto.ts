import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
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
  @IsNumber()
  @Min(1)
  assignedUserId: number;
}
