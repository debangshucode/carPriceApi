import { Controller, Post, Body, Get, Patch, Delete, Param, Query, Session, NotFoundException } from '@nestjs/common';
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

    @Get('/curUser')
    async curUser(@Session() session:any) {
        const user =  await this.userService.findOne(session.userId);
        if(user===null){
            throw new NotFoundException("no user logged in");
        }
        return user;
    }

    @Post('/signout')
    signOut(@Session() Session:any) {
        Session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id;
        return user;
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
