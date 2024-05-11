import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEmail()
  @ValidateIf((organization) => !organization.bussinessPhone)
  bussinessEmail: string;

  @IsNotEmpty()
  @IsString()
  ceo: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ValidateIf((organization) => !organization.bussinessEmail)
  bussinessPhone?: string;
}
