import { Response } from 'express';

export function setAuthCookies(res: Response, refreshToken: string) { 
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
}
