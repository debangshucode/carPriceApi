import { IsString, IsNumber, Min, Max, IsLatitude, IsLongitude,IsOptional } from "class-validator";


export class UpdateReportDto {

    @IsOptional()
    @IsString()
    make: string;

    @IsOptional()
    @IsString()
    model: string;

    @IsOptional()
    @IsNumber()
    @Min(1000)
    @Max(100000000000000)
    price: number;

    @IsOptional()
    @IsNumber()
    @Min(1952)
    @Max(2025)
    year: number;

    @IsOptional()
    @IsLatitude()
    lat: number;

    @IsOptional()
    @IsLongitude()
    lng: number;

    @IsOptional()
    @IsNumber()
    @Min(5)
    @Max(100)
    milage: number;

}