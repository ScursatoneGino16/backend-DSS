import { IsString, IsNumber, IsInt, Min, IsOptional, Length, IsPositive } from 'class-validator';

export class UpdateProductDto {
  @IsOptional() @IsString() @Length(2, 100) name?: string;
  @IsOptional() @IsNumber() @IsPositive() price?: number;
  @IsOptional() @IsInt() @Min(0) stock?: number;
  @IsOptional() @IsInt() categoryId?: number;
}