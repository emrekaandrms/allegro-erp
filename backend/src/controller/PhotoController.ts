import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Photo } from '../entity/Photo';
import { Product } from '../entity/Product';

export class PhotoController {
  static async listPending(req: Request, res: Response) {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({where:{status:'foto_gerekli'}});
    res.send(products);
  }

  static async uploadPhoto(req: Request, res: Response) {
    const { productId, photoUrl } = req.body;
    const photoRepo = AppDataSource.getRepository(Photo);
    const productRepo = AppDataSource.getRepository(Product);

    const product = await productRepo.findOne({where:{id:productId}});
    if(!product) return res.status(404).send({message:'Product not found'});

    const photo = photoRepo.create({product, photo_url:photoUrl});
    await photoRepo.save(photo);

    product.status = 'foto_yuklendi';
    await productRepo.save(product);

    res.send({message:'Fotoğraf yüklendi', photo});
  }
}
