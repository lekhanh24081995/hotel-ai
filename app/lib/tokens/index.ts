import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
  REGISTER_TOKEN_EXPIRED,
  REGISTER_TOKEN_SECRET,
  RESET_PASSWORD_TOKEN_EXPIRED,
  RESET_PASSWORD_TOKEN_SECRET
} from '../constants/token';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
  if (ACCESS_TOKEN_SECRET) {
    const access_token = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRED
    });
    const decodedAccessToken = jwt.decode(access_token) as DecodedToken;
    const expires_in = decodedAccessToken.exp - Math.floor(Date.now() / 1000);
    return { access_token, expires_in };
  } else {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }
};

export const generateRegisterToken = (userId: string) => {
  if (REGISTER_TOKEN_SECRET) {
    return jwt.sign({ userId }, REGISTER_TOKEN_SECRET, {
      expiresIn: REGISTER_TOKEN_EXPIRED
    });
  } else {
    throw new Error('REGISTER_TOKEN_SECRET is not defined');
  }
};

// Function to generate refresh token
export const generateRefreshToken = (userId: string) => {
  if (REFRESH_TOKEN_SECRET) {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRED
    });
  } else {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
};

export const generateResetPasswordToken = (userId: string) => {
  if (RESET_PASSWORD_TOKEN_SECRET) {
    return jwt.sign({ userId }, RESET_PASSWORD_TOKEN_SECRET, {
      expiresIn: RESET_PASSWORD_TOKEN_EXPIRED
    });
  } else {
    throw new Error('RESET_PASSWORD_TOKEN_SECRET is not defined');
  }
};

export const verifyToken = (
  token: string,
  type: 'access' | 'refresh' | 'register' | 'reset'
) => {
  let secret;

  switch (type) {
    case 'access':
      secret = ACCESS_TOKEN_SECRET;
      break;
    case 'refresh':
      secret = REFRESH_TOKEN_SECRET;
      break;
    case 'register':
      secret = REGISTER_TOKEN_SECRET;
      break;
    case 'reset':
      secret = RESET_PASSWORD_TOKEN_SECRET;
      break;
    default:
      throw new Error('Invalid token type');
  }

  if (secret) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      return null;
    }
  } else {
    throw new Error(`${type.toUpperCase()}_TOKEN_SECRET is not defined`);
  }
};
