import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { plainToClass } from "class-transformer";

interface ClassConstructor {
    new(...args: any[]): {}
}

export function serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // code here will run before controller/ route handeller 
        return next.handle().pipe(
            //  code here will run after route handeller - to transform response data
            map((data) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}