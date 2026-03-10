import { CanActivate,ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext){
        /* `const request = context.switchToHttp().getRequest();` is retrieving the HTTP request object
        from the execution context in a NestJS application. This allows the `AuthGuard` class to
        access the incoming request and perform authentication or authorization logic based on the
        request information. */
        const request = context.switchToHttp().getRequest();
        if(!request.currentUser){
            return false ;
        }
        return request.currentUser.admin;
    }
}