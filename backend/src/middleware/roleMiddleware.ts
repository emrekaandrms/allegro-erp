import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export function roleMiddleware(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).send({message: 'Access forbidden.'});
    }
    next();
  }
}
