/* eslint-disable prettier/prettier */
import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    const { username, password, name } = authSignUpDto;
    const user = new User();

    user.username = username;
    user.password = password;
    user.name = name;

    try{
        await user.save();
    }
    catch(err){
        throw new ConflictException('Username already exists')
    }
  }
}
