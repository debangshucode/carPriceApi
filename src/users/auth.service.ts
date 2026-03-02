import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service"
import { randomBytes,scrypt as _scrypt } from "crypto";
import { promisify } from "util";


const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {
    constructor(private userService: UsersService) { }

    async signup(email: string, password: string) {

        // check if user exist
        const userMail = await this.userService.find(email);
        if(userMail.length) throw new BadRequestException("User already register! EMail in Use");

        // hash the pass 
        // Generate a salt 
        const salt = randomBytes(8).toString('hex')
        // Hash and salt the pass together
        const hash = (await scrypt(password,salt,32)) as Buffer;

        // join the hashed result and salt together 
        const result = salt +'.'+ hash.toString('hex')
        // save the user
        const user = await this.userService.create(email,result);

        return user;
    }

    async signin(email:string,password:string) {
        const [user] =await this.userService.find(email);
        if(!user){
            throw new NotFoundException("User not found wrong Mail")
        }
        const[salt,storedHash] = user.password.split('.');
        
        const hash = (await scrypt(password,salt,32)) as Buffer;

        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('Wrong Password');
        }
        return user;
    }
}