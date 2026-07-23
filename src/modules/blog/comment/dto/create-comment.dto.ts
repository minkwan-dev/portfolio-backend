import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    body: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nickname: string;

    @IsUrl()
    @MaxLength(512)
    avatar: string;
}