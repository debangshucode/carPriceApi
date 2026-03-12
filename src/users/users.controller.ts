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
import { Paginate} from 'nestjs-paginate';
import type { PaginateQuery }from 'nestjs-paginate'
import { plainToInstance } from 'class-transformer';



@Controller('auth')

export class UsersController {

    constructor(private userService: UsersService, private authService: AuthService) { }

    @Get('/allUser')
    async findAll(@Paginate() query:PaginateQuery){
        const result = await this.userService.findAll(query)

        return {
            ...result,
            data : plainToInstance(UserDto,result.data,{
                excludeExtraneousValues:true
            }),
        };
    }

    @Get('/curUser')
    @UseGuards(AuthGuard)
    @serialize(UserDto) //exclude password from response

    async curUser(@CurrentUser() user:User) {
        
        return user;
    }

    @Post('/signout')
    @serialize(UserDto) //exclude password from response

    signOut(@Session() Session:any) {
        Session.userId = null;
    }

    @Post('/signup')
    @serialize(UserDto) //exclude password from response

    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    @serialize(UserDto) //exclude password from response

    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    @serialize(UserDto) //exclude password from response

    findUser(@Param('id') id: string) {
        console.log("handeller us running")
        return this.userService.findOne(parseInt(id))
    }
    @Get()
    @serialize(UserDto) //exclude password from response

    findAllUsers(@Query('email') email: string) {

        return this.userService.find(email)
    }
    @Patch('/:id')
    @serialize(UserDto) //exclude password from response

    updateUser(@Param('id') id: string, @Body() body: updateUserDto) {
        return this.userService.update(parseInt(id), body)
    }
    @Delete('/:id')
    @serialize(UserDto) //exclude password from response

    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id))
    }
}
