import { IsEnum, IsOptional } from "class-validator";
import { LanguageEnum } from "../enum/language.enum";

export class LanguageDto {
    @IsEnum(LanguageEnum)
    @IsOptional()
    lang: string;
}