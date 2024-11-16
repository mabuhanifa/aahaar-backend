import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  payloadPassword: string,
  userPassword: string,
) => {
  return await bcrypt.compare(payloadPassword, userPassword);
};
