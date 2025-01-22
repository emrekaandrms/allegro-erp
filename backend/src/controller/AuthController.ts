import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/auth';

export class AuthController {
  static async login(req: Request, res: Response) {
    const {email, password} = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({where:{email}});
    if(!user) return res.status(404).send({message:'User not found'});

    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.status(401).send({message:'Invalid credentials'});

    const token = jwt.sign({id:user.id, role:user.role}, JWT_SECRET, {expiresIn:JWT_EXPIRES_IN});
    res.send({token, role:user.role});
  }
}
