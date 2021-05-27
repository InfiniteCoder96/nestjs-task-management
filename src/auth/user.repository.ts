/* eslint-disable prettier/prettier */
import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { User } from './user.entity';
import { AuthSignInDto } from './dto/auth-signin.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    const { username, password, name } = authSignUpDto;

    const user = new User();

    user.username = username;
    user.password = await bcrypt.hashSync(password, 8),
    user.name = name;

    try{
        await user.save();
    }
    catch(err){
        throw new ConflictException('Username already exists')
    }
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<string> {
    const { username, password } = authSignInDto;

    const user = await this.findOne({ username });

    if(user && await user.validatePassword(password)){
      return user.username;
    }
    else{
      return null;
    }
  }

}


