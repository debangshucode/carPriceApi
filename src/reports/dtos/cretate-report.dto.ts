import { IsString, IsNumber, Min, Max, IsLatitude, IsLongitude } from "class-validator";


export class CreateReportDto {

    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1000)
    @Max(100000000000000)
    price: number;

    @IsNumber()
    @Min(1952)
    @Max(2025)
    year: number;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lng: number;

    @IsNumber()
    @Min(5)
    @Max(100)
    milage: number;

    

}