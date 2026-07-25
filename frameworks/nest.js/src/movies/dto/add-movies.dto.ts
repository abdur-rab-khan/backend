import { IsString, IsUUID, Max, Min } from 'class-validator';

// DTO (Data Transfer Object), used to transfer data between the client and the server, mainly for input validation
// Here we aren't use "typescript interface or typescript type"
export class AddMoviesDto {
  // @IsString()
  // @Min(2)
  // @Max(30)
  name: string;

  // @IsUUID()
  id: string;
}
