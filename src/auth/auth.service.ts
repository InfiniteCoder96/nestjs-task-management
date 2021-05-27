import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { SignInPayload } from './payload/signin-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    return await this.userRepository.signUp(authSignUpDto);
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken }> {
    const username = await this.userRepository.signIn(authSignInDto);
    if (!username) {
      throw new UnauthorizedException(
        `These credentials are not in our system`,
      );
    }

    const payload: SignInPayload = { username };

    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
