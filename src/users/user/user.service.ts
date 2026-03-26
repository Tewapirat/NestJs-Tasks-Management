import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreaeteUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepositoty:Repository<User>,
        private readonly passwordService:PasswordService,
    ){}

    // 1) find the user by email
    // 2) create user
    // 3) fetch the user by id
    
    public async findOneByEmail(email:string):Promise<User | null>{
        return await this.userRepositoty.findOneBy({email});
    }

    public async createUser(createUserDto:CreaeteUserDto):Promise<User>{
        const hashedPassword = await this.passwordService.hash(createUserDto.password);

        const user = this.userRepositoty.create({
            ...createUserDto,
            password:hashedPassword,
        });

        return await this.userRepositoty.save(user);
    }

    public async findOne(id:string):Promise<User|null>{
        return await this.userRepositoty.findOneBy({id})
    }

}
