import { Request } from 'express';
import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import {
  AuthenticationClient,
  ManagementClientOptionsWithClientCredentials,
  TokenSet,
} from 'auth0';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  private auth: AuthenticationClient;

  constructor(
    private usersService: UsersService,
    private readonly config: ConfigService,
  ) {
    const options: ManagementClientOptionsWithClientCredentials = {
      domain: this.config.get<string>('auth.domain'),
      clientId: this.config.get<string>('auth.clientID'),
      clientSecret: this.config.get<string>('auth.clientSecret'),
    };

    this.auth = new AuthenticationClient(options);
  }

  @Post('signup')
  async signUp(@Body() body: AuthCredentialsDto) {
    let result = null;

    try {
      const user: User = {
        uuid: uuidv4(),
        email: body.email,
        posts: [],
      };

      const { data } = await this.auth.database.signUp({
        email: body.email,
        password: body.password,
        connection: this.config.get<string>('auth.connections'),
        user_metadata: { user_id: user.uuid },
      });

      await this.usersService.saveUser(user);
      result = data;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }

    return result;
  }

  @Post('login')
  async login(@Body() body: AuthCredentialsDto): Promise<TokenSet> {
    let response = null;

    try {
      response = await this.auth.oauth.passwordGrant({
        audience: process.env.AUTH0_AUDIENCE,
        username: body.email,
        password: body.password,
      });
    } catch (e) {
      throw new Error(e);
    }

    return response.data;
  }

  @Post('ping')
  @UseGuards(AuthGuard('jwt'))
  async sign(@Req() req: Request) {
    console.log('ping', req.user);

    return { status: 'OK' };
  }

  // TODO: Implement the `logout` endpoint
}
