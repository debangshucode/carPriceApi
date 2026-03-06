import { Expose, Transform } from "class-transformer";


export class ReportDto {
    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lat: number;

    @Expose()
    lng: number;

    @Expose()
    milage: number;

    @Expose()
    approve:boolean

    @Expose()
    @Transform(({obj})=>obj.user.id)
    UserId: number
}