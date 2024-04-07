import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(['open', 'inProgress', 'closed'], {
    message:
      'status must be one of the following values : open, inProgress, closed',
  })
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['low', 'medium', 'high'], {
    message: 'priority must be one of the following values : low, medium, high',
  })
  priority: string;

  @IsNotEmpty()
  dueDate: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  assignedUserId: number;
}
