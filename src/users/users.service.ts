import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({email, password});

        this.repo.save(user);
        return user;
    }




    findOne(id: number) {
        if(!id){
            return null;
        }
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<User>){    //attrs: Partial<User> ---> used because so as, if we wanted to update only email or only pwd, then we cannot directly pass it in the arguments because if argument contains both email and pwd but I pass only email or only pwd, then it will throw error, so we used Partial attributes property for User entity so that it will recieve the part that we want to update
        const user = await this.findOne(id);

        if(!user){
            throw new NotFoundException('User not Found!!');
        }

        Object.assign(user, attrs);   //update 'user' with 'attrs' atrributes  (in-built function)

        return this.repo.save(user);
    }

    async remove(id: number){

        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User not Found!!');
        }
        return this.repo.remove(user)
    }

}
