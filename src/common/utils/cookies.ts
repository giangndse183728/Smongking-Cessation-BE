import { Response } from 'express';

const COOKIE_MAX_AGE =
  Number(process.env.COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 7; // Default to 7 days

export function setAuthCookies(res: Response, refreshToken: string) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
  });
}
