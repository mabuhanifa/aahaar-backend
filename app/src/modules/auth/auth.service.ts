import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { generateToken } from 'src/utils/jwt.config';

@Injectable()
export class AuthService {
  create(res: Response) {
    const token = generateToken({
      name: 'rahim',
      role: 'admin',
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
    return {
      token,
    };
  }

  findAll(res: Response) {
    const accessToken = 'hello world';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    return res.json({ hi: 'hello' });
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
