import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    body: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nickname: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(512)
    avatar: string;
}