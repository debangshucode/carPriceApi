import {NextFunction,Request,Response} from 'express'
import { Injectable,NestMiddleware } from '@nestjs/common'
import { UsersService } from '../users.service'

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private userService:UsersService){}

    async use(req:Request,res:Response,Next:NextFunction){
        const {userId} = req.session || {}

        if(userId){
            const user = await this.userService.findOne(userId)
            //@ts-ignore
            req.CurrentUser = user;
        }
        Next();
    }
} 