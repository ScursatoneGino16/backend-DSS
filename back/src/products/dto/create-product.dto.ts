import { IsString, IsNumber, IsInt, Min, Length, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString() @Length(2, 100) name!: string;
  @IsNumber() @IsPositive() price!: number;
  @IsInt() @Min(0) stock!: number;
  @IsInt() categoryId!: number;
}