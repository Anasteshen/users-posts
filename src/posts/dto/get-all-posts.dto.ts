import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class GetAllPostsDto {
  @ApiProperty()
  @IsString()
  userUuid: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
