import { JwtModuleOptions } from '@nestjs/jwt';

const jwtEnvVar = {
  publicKey: process.env.JWT_PUBLIC_KEY,
  privateKey: process.env.JWT_PRIVATE_KEY,
  TokenExpTime: process.env.TOKEN_EXP_TIME,
  jwtPassPhrase: process.env.JWT_PASSPHRASE,
};

const jwtConfig: JwtModuleOptions = {
  publicKey: Buffer.from(jwtEnvVar.publicKey, 'base64').toString().trim(),
  privateKey: {
    key: Buffer.from(jwtEnvVar.privateKey, 'base64').toString().trim(),
    passphrase: jwtEnvVar.jwtPassPhrase,
  },
  signOptions: {
    expiresIn: jwtEnvVar.TokenExpTime,
    algorithm: 'RS512',
    issuer: jwtEnvVar.jwtPassPhrase,
  },
};

export default jwtConfig;
