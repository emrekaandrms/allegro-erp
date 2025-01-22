import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth';

export interface AuthRequest extends Request {
  user?: {id: number; role: string};
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).send({message: 'No token provided.'});
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if(err) return res.status(401).send({message: 'Invalid token.'});
    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
}
