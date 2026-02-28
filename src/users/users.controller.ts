import { Controller ,Post,Body, Get, Patch, Delete, Param,Query} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto'
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
@Controller('auth')
export class UsersController {

    constructor(private userService:UsersService){}

    @Post('/signup')
    createUser(@Body() body:CreateUserDto) {
        this.userService.create(body.email,body.password)
    }
    @Get('/:id')
    findUser(@Param('id') id:string) {
        return this.userService.findOne(parseInt(id))
    }
    @Get()
    findAllUsers(@Query('email') email:string) {
        return this.userService.find(email)
    }
    @Patch('/:id')
    updateUser(@Param('id') id:number,@Body() body:updateUserDto) {
        return this.userService.update(id,body)
    }
    @Delete('/:id')
    removeUser(@Param('id') id:number) {
        return this.userService.remove(id)
    }
}
