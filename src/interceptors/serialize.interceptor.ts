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
    new(...args:any[]):{}
}

export function serialize(dto:ClassConstructor) {
    return UseInterceptors( new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor (private dto:any) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        return next.handle().pipe(
            map((data) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}