import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET as string, (err: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
