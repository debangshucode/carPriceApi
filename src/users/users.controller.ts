import { Controller, Post, Body, Get, Patch, Delete, Param, Query, Session, NotFoundException,UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto'
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
import { serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from './user.entity';
import {AuthGuard} from '../guards/auth.guard'




@Controller('auth')
@serialize(UserDto) //exclude password from response

export class UsersController {

    constructor(private userService: UsersService, private authService: AuthService) { }

    @Get('/curUser')
    @UseGuards(AuthGuard)
    async curUser(@CurrentUser() user:User) {
        
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
