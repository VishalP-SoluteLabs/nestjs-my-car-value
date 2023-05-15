import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async signup(email: string, password: string){

       const users = await this.userService.find(email);
       if(users.length){
        const error = new BadRequestException('User already exists with this email!');
        throw error;
       }


       const salt = randomBytes(8).toString('hex');

       const hash = (await scrypt(password, salt, 32)) as Buffer;

       const resultPwd = salt + '.' + hash.toString('hex');


       const user = this.userService.create(email, resultPwd);

       return user;
    }


    async login(email: string, password: string){
        const [user] = await this.userService.find(email);   //[user] for destructuring
        if(!user){
            const error = new NotFoundException('User does not exist!');
            throw error;
            }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storedHash !== hash.toString('hex')){
            const error = new BadRequestException('Invalid password!');
            throw error;
        }

        return user;
    }
}