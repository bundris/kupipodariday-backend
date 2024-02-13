import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 30)
  @IsString()
  @IsOptional()
  username: string;

  @Length(2, 200)
  @IsString()
  @IsOptional()
  about: string;

  @IsUrl()
  @IsString()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
