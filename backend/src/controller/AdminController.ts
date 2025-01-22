import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { SystemParam } from '../entity/SystemParam';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';

export class AdminController {
  static async listParams(req: Request, res: Response) {
    const paramRepo = AppDataSource.getRepository(SystemParam);
    const params = await paramRepo.find();
    res.send(params);
  }

  static async updateParam(req: Request, res: Response) {
    const {param_key, param_value} = req.body;
    const paramRepo = AppDataSource.getRepository(SystemParam);
    let param = await paramRepo.findOne({where:{param_key}});
    if(!param) {
      param = paramRepo.create({param_key, param_value});
    } else {
      param.param_value = param_value;
    }
    await paramRepo.save(param);
    res.send({message:'Param updated', param});
  }

  static async listUsers(req: Request, res: Response) {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find();
    res.send(users);
  }

  static async createUser(req: Request, res: Response) {
    const {email, password, role} = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const exist = await userRepo.findOne({where:{email}});
    if(exist) return res.status(400).send({message:'User already exists'});
    const hash = await bcrypt.hash(password,10);
    const user = userRepo.create({email, password_hash:hash, role});
    await userRepo.save(user);
    res.send({message:'User created', user});
  }

  // AdminController.ts içi
static async updateUserRole(req: Request, res: Response) {
  const {userId, role} = req.body;
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({where:{id:userId}});
  if(!user) return res.status(404).send({message:'User not found'});

  // role değerinin geçerli bir rol olduğundan emin olun
  const validRoles = ['operasyon','fotoğraf','muhasebe','seo','admin'];
  if(!validRoles.includes(role)) {
    return res.status(400).send({message:'Invalid role'});
  }

  user.role = role as any; // UserRole tipine cast
  await userRepo.save(user);

  res.send({message:'Role updated', user});
}

}
