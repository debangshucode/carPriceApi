import { Controller, Post, Body, Get, Patch, Delete, Param, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto'
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
import { serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@serialize(UserDto) //exclude password from response
export class UsersController {

    constructor(private userService: UsersService, private authService: AuthService) { }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body.email,body.password)
    }

    @Post('/signin')
    signin(@Body() body:CreateUserDto) {
        return this.authService.signin(body.email,body.password)
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
        console.log("handeller us running")
        return this.userService.findOne(parseInt(id))
    }
    @Get()
    findAllUsers(@Query('email') email: string) {

        return this.userService.find(email)
    }
    @Patch('/:id')
    updateUser(@Param('id') id: number, @Body() body: updateUserDto) {
        return this.userService.update(id, body)
    }
    @Delete('/:id')
    removeUser(@Param('id') id: number) {
        return this.userService.remove(id)
    }
}
