import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_TIME = process.env.JWT_TIME || '60m';

type Payload = {
  name: string;
  role: string;
};

export const generateToken = (payload: Payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TIME });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
