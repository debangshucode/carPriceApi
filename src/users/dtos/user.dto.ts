import { Expose,Transform } from "class-transformer";


export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    admin: boolean;

    @Expose()
    @Transform(({ obj }) => obj.reports?.map((report) => report.id) ?? [])
    reportsId: number[]
}
