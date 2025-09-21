import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty({ description: 'Street address' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'ZIP code' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: 'Country' })
  @IsString()
  country: string;
}

class AddressObjectDto {
  @ApiProperty({ type: AddressDto, description: 'From address' })
  @ValidateNested()
  @Type(() => AddressDto)
  from: AddressDto;

  @ApiProperty({ type: AddressDto, description: 'To address' })
  @ValidateNested()
  @Type(() => AddressDto)
  to: AddressDto;
}

export class CreateFolderDto {
  @ApiProperty({ description: 'Folder name', example: 'Moving to New York' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Folder title', example: 'New York Relocation Project' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Folder description', example: 'Moving from California to New York for work' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Publishing year', example: 2024 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  publishingYear: number;

  @ApiPropertyOptional({ description: 'Image URL or path', example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ description: 'User ID who owns this folder' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ 
    description: 'Folder status', 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    example: 'pending'
  })
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled'])
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: 'Move date', example: '2024-02-15' })
  @IsOptional()
  @IsDateString()
  moveDate?: string;

  @ApiPropertyOptional({ type: AddressObjectDto, description: 'From and to addresses' })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressObjectDto)
  address?: AddressObjectDto;

  @ApiPropertyOptional({ 
    description: 'Tags for categorization', 
    example: ['work', 'urgent', 'furniture'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Estimated cost', example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCost?: number;

  @ApiPropertyOptional({ description: 'Actual cost', example: 4500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualCost?: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
