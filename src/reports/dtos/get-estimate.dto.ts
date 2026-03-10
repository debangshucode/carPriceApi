import { Transform } from "class-transformer";
import { IsString, IsNumber, Min, Max, IsLatitude, IsLongitude } from "class-validator";


export class GetEstimateDto {

    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform(({value})=>parseInt(value))
    @IsNumber()
    @Min(1952)
    @Max(2025)
    year: number;

    @Transform(({value})=>parseFloat(value))
    @IsLatitude()
    lat: number;

    @Transform(({value})=>parseFloat(value))
    @IsLongitude()
    lng: number;

    @Transform(({value})=>parseInt(value))
    @IsNumber()
    @Min(5)
    @Max(100000)
    milage: number;

}