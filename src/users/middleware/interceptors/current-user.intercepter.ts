import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { UsersService } from '../../users.service'
import { Observable } from 'rxjs'

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService:UsersService) {}

    async intercept(context: ExecutionContext, handeler: CallHandler<any>){
        const request = context.switchToHttp().getRequest();
        const {userId} = request.session || {};

        if(userId){
            try {
                const user = await this.userService.findOne(userId);
                request.CurrentUser = user;
            } catch (err) {
                // Stale session id should not break unrelated endpoints (e.g. signup/signin).
                if (err instanceof NotFoundException) {
                    request.session.userId = null;
                } else {
                    throw err;
                }
            }
        }
        return handeler.handle();
    }
}
