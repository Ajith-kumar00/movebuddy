import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export enum FolderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateFolderDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'publishingYear must be a number' })
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  publishingYear?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(FolderStatus)
  status?: FolderStatus;

  @IsOptional()
  @IsDateString()
  moveDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'estimatedCost must be a number' })
  @Min(0)
  estimatedCost?: number;

  @IsOptional()
  @IsNumber({}, { message: 'actualCost must be a number' })
  @Min(0)
  actualCost?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
